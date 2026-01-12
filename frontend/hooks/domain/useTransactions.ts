import { useState, useCallback } from 'react';
import { Transaction, TransactionService } from '@/services/transactionService';

export function useTransactions(token: string | null, refresh?: () => void) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [txForm, setTxForm] = useState({ label: "", amount: "", type: "depense", category: "Alimentation" });

    const addTransaction = useCallback(async (overrideForm?: any) => {
        if (!token) return;
        const form = overrideForm || txForm;
        if (!form.amount) return;

        setLoading(true);
        try {
            await TransactionService.add({ ...form, amount: parseFloat(form.amount) }, token);
            if (refresh) refresh();
            // Reset form could be here or handled by caller, useHessData didn't resets explicitly?
            // checking useHessData: it did NOT reset txForm explicitly in the snippet shown, 
            // but it's good UX to reset or maybe keep for multiple entry. 
            // The snippet for handleAddTx was: 
            // await fetch(...); refresh();
            // It did NOT reset the form. So I will keep that behavior.
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            return false;
        } finally {
            setLoading(false);
        }
    }, [token, txForm, refresh]);

    const deleteTransaction = useCallback(async (id: number) => {
        if (!token) return;
        setLoading(true);
        try {
            await TransactionService.delete(id, token);
            if (refresh) refresh();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            return false;
        } finally {
            setLoading(false);
        }
    }, [token, refresh]);

    const updateTransaction = useCallback(async (id: number, form: any) => {
        if (!token) return;
        setLoading(true);
        try {
            await TransactionService.update(id, { ...form, amount: parseFloat(form.amount) }, token);
            if (refresh) refresh();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            return false;
        } finally {
            setLoading(false);
        }
    }, [token, refresh]);

    return {
        txForm,
        setTxForm,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        loading,
        error
    };
}
