import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSupportedCurrencies } from '@/api/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Globe } from 'lucide-react';
import { format } from 'date-fns';

export default function SupportedCurrencies() {
  const [search, setSearch] = useState('');

  const { data: currencies, isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: fetchSupportedCurrencies,
  });

  const filteredCurrencies = currencies?.filter(c => 
    c.country.toLowerCase().includes(search.toLowerCase()) || 
    c.currency.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Supported Currencies</h1>
          <p className="text-muted-foreground mt-1">Available conversion rates sourced directly from the U.S. Treasury API.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
          <div>
            <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-primary"/> Treasury Data</CardTitle>
            <CardDescription className="mt-1 max-w-xl">
              These are the latest available exchange rates reported by the Treasury. Conversions will use the rate effective on or up to 6 months before your purchase date.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search country or currency..."
              className="pl-8"
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading Treasury data...</div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b bg-muted/20">
                  <tr className="border-b transition-colors">
                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Country</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Currency</th>
                    <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Latest Exchange Rate</th>
                    <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Effective Date</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredCurrencies.map((c) => (
                    <tr key={`${c.country}-${c.currency}`} className="border-b transition-colors hover:bg-muted/30">
                      <td className="p-6 align-middle font-medium">{c.country}</td>
                      <td className="p-6 align-middle text-muted-foreground">{c.currency}</td>
                      <td className="p-6 align-middle text-right font-mono">{c.latestExchangeRate.toString()}</td>
                      <td className="p-6 align-middle text-right text-muted-foreground">
                        {format(new Date(c.latestExchangeRateDate), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  ))}
                  {filteredCurrencies.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">
                        No currencies match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
