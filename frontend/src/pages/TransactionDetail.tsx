import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchTransaction, convertTransaction, fetchSupportedCurrencies } from '@/api/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Copy, Loader2, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');

  const { data: transaction, isLoading: txLoading } = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => fetchTransaction(id!),
    enabled: !!id,
  });

  const { data: currencies, isLoading: currenciesLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: fetchSupportedCurrencies,
  });

  const convertMutation = useMutation({
    mutationFn: (currencyCombo: string) => {
      const [country, currency] = currencyCombo.split('|');
      return convertTransaction(id!, country, currency);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to convert transaction.");
    }
  });

  const handleConvert = () => {
    if (!selectedCurrency) return;
    convertMutation.mutate(selectedCurrency);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Transaction ID copied to clipboard.");
  };

  if (txLoading) return <div className="p-12 text-center text-muted-foreground">Loading transaction details...</div>;
  if (!transaction) return <div className="p-12 text-center text-destructive">Transaction not found.</div>;

  const conversionResult = convertMutation.data;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/transactions"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{transaction.nickname || 'Transaction Details'}</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            ID: <span className="font-mono text-sm">{transaction.id}</span>
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyToClipboard(transaction.id)}>
              <Copy className="h-3 w-3" />
            </Button>
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Transaction Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Description</span>
              <span className="font-medium text-right">{transaction.description}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium text-right">{format(new Date(transaction.transactionDate), 'PPP')}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Original Amount</span>
              <span className="font-bold text-lg text-right">${transaction.purchaseAmountUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Added On</span>
              <span className="text-right text-sm">{format(new Date(transaction.createdAt), 'PPP p')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Panel */}
        <Card className="border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <ArrowRight className="h-5 w-5" /> Currency Conversion
            </CardTitle>
            <CardDescription>Convert this USD purchase to a supported foreign currency based on Treasury rates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Currency</label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency} disabled={currenciesLoading || convertMutation.isPending}>
                <SelectTrigger>
                  <SelectValue placeholder={currenciesLoading ? "Loading currencies..." : "Select a country/currency"} />
                </SelectTrigger>
                <SelectContent>
                  {currencies?.map(c => (
                    <SelectItem key={`${c.country}|${c.currency}`} value={`${c.country}|${c.currency}`}>
                      {c.country} - {c.currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full" 
              disabled={!selectedCurrency || convertMutation.isPending} 
              onClick={handleConvert}
            >
              {convertMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Converting...</> : "Convert Amount"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Result */}
      {conversionResult && (
        <Card className="border-secondary/50 bg-secondary/5 animate-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary">
              <CheckCircle2 className="h-5 w-5" /> Conversion Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Target Currency</p>
                <p className="font-semibold text-lg">{conversionResult.targetCurrency} ({conversionResult.targetCountry})</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Exchange Rate</p>
                <p className="font-semibold text-lg">{conversionResult.exchangeRate.toString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rate Date</p>
                <p className="font-semibold text-lg">{format(new Date(conversionResult.exchangeRateDate), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Converted Amount</p>
                <p className="font-bold text-2xl text-primary">{conversionResult.convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 pt-4 rounded-b-lg border-t">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Treasury rates may not exist for the exact purchase date. This app uses the most recent available rate on or before the purchase date, within six months. (Rate age: {conversionResult.rateAgeDays} days)
            </p>
          </CardFooter>
        </Card>
      )}

      {convertMutation.isError && (
        <Card className="border-destructive/50 bg-destructive/5 animate-in slide-in-from-bottom-4">
           <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" /> Conversion Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive/90">
              {(convertMutation.error as any).response?.data?.message || "An error occurred while converting the transaction."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
