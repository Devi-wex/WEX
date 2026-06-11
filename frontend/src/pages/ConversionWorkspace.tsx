import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchTransactions } from '@/api/apiClient';
import type { Transaction } from '@/api/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { format } from 'date-fns';

export default function ConversionWorkspace() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', 0, 5, debouncedSearch],
    queryFn: () => fetchTransactions(0, 5, debouncedSearch),
    placeholderData: keepPreviousData
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDebouncedSearch(search);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <ArrowLeftRight className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Conversion Workspace</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Select a previous purchase transaction to convert its USD amount to a supported foreign currency.
        </p>
      </div>

      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle>Step 1: Select a Transaction</CardTitle>
          <CardDescription>Search for a transaction by description or nickname to begin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search purchases..."
              className="pl-10 h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading recent transactions...</div>
          ) : (
            <div className="grid gap-4">
              {data?.content.map((tx: Transaction) => (
                <div key={tx.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-colors bg-card">
                  <div className="space-y-1 mb-4 sm:mb-0">
                    <h4 className="font-semibold">{tx.nickname || tx.description}</h4>
                    <p className="text-sm text-muted-foreground">{tx.description !== tx.nickname ? tx.description : ''}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                      <span>{format(new Date(tx.transactionDate), 'MMM d, yyyy')}</span>
                      <span className="font-mono">ID: {tx.id.substring(0,8)}...</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="font-bold text-lg">${tx.purchaseAmountUsd.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    <Button onClick={() => navigate(`/transactions/${tx.id}`)}>
                      Select <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {data?.content.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/20">
                  No transactions found matching your search.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
