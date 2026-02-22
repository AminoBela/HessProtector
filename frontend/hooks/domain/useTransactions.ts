import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction, TransactionService } from '@/services/transactionService';

export function useTransactions(token: string | null, refresh?: () => void) {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);
    const [txForm, setTxForm] = useState({ label: "", amount: "", type: "depense", category: "Alimentation" });

    const addMutation = useMutation({
        mutationFn: async (overrideForm?: any) => {
            const form = overrideForm || txForm;
            if (!token || !form.amount) throw new Error("Missing data");
            return await TransactionService.add({ ...form, amount: parseFloat(form.amount) }, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            if (refresh) refresh();
        },
        onError: (err) => {
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            if (!token) throw new Error("Missing token");
            return await TransactionService.delete(id, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            if (refresh) refresh();
        },
        onError: (err) => {
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (args: { id: number, form: any }) => {
            if (!token) throw new Error("Missing token");
            return await TransactionService.update(args.id, { ...args.form, amount: parseFloat(args.form.amount) }, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            if (refresh) refresh();
        },
        onError: (err) => {
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    });

    return {
        txForm,
        setTxForm,
        addTransaction: async (overrideForm?: any) => {
            try { await addMutation.mutateAsync(overrideForm); return true; } catch { return false; }
        },
        deleteTransaction: async (id: number) => {
            try { await deleteMutation.mutateAsync(id); return true; } catch { return false; }
        },
        updateTransaction: async (id: number, form: any) => {
            try { await updateMutation.mutateAsync({ id, form }); return true; } catch { return false; }
        },
        loading: addMutation.isPending || deleteMutation.isPending || updateMutation.isPending,
        error
    };
}
