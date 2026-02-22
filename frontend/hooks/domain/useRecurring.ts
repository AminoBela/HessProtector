import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RecurringItem, RecurringService } from '@/services/recurringService';

export function useRecurring(token: string | null, refresh?: () => void) {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);
    const [recForm, setRecForm] = useState({ label: "", amount: "", day: "1", type: "Fixe" });

    const addMutation = useMutation({
        mutationFn: async () => {
            if (!token || !recForm.label) throw new Error("Missing data");
            return await RecurringService.add({ ...recForm, amount: parseFloat(recForm.amount), day: parseInt(recForm.day) }, token);
        },
        onSuccess: () => {
            setRecForm({ label: "", amount: "", day: "1", type: "Fixe" });
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
            return await RecurringService.delete(id, token);
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
        recForm,
        setRecForm,
        addRecurring: async () => {
            try { await addMutation.mutateAsync(); return true; } catch { return false; }
        },
        deleteRecurring: async (id: number) => {
            try { await deleteMutation.mutateAsync(id); return true; } catch { return false; }
        },
        loading: addMutation.isPending || deleteMutation.isPending,
        error
    };
}
