import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '@/api/apiClient';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const transactionSchema = z.object({
  nickname: z.string().max(40, "Nickname cannot exceed 40 characters").optional().transform(val => val?.trim() || undefined),
  description: z.string().min(1, "Description is required").max(50, "Description cannot exceed 50 characters").trim(),
  transactionDate: z.string().min(1, "Date is required"),
  purchaseAmountUsd: z.coerce.number().positive("Amount must be positive").multipleOf(0.01, "Maximum 2 decimal places allowed").or(z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format").transform(Number)),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function CreateTransaction() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      nickname: '',
      description: '',
      transactionDate: new Date().toISOString().split('T')[0],
      purchaseAmountUsd: 0,
    }
  });

  const descriptionLength = watch('description')?.length || 0;

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success("Transaction Created: Your purchase has been successfully saved.");
      navigate(`/transactions/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create transaction.");
    }
  });

  const onSubmit: any = (data: TransactionFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">New Purchase</h1>
        <p className="text-muted-foreground mt-1">Record a new USD purchase transaction.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>Enter the details of your purchase. All fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="e.g., MacBook Pro M3"
                {...register('description')}
                className={errors.description ? "border-destructive" : ""}
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-destructive">{errors.description?.message}</p>
                <p className="text-xs text-muted-foreground">{descriptionLength} / 50</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname (Optional)</Label>
              <Input
                id="nickname"
                placeholder="e.g., Work Laptop"
                {...register('nickname')}
                className={errors.nickname ? "border-destructive" : ""}
              />
              <p className="text-xs text-destructive mt-1">{errors.nickname?.message}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="transactionDate">Transaction Date *</Label>
                <Input
                  id="transactionDate"
                  type="date"
                  {...register('transactionDate')}
                  className={errors.transactionDate ? "border-destructive" : ""}
                />
                <p className="text-xs text-destructive mt-1">{errors.transactionDate?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseAmountUsd">Purchase Amount (USD) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="purchaseAmountUsd"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className={`pl-8 ${errors.purchaseAmountUsd ? "border-destructive" : ""}`}
                    {...register('purchaseAmountUsd')}
                  />
                </div>
                <p className="text-xs text-destructive mt-1">{errors.purchaseAmountUsd?.message}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Transaction"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
