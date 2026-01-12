import { useState, useCallback } from 'react';
import { RecurringItem, RecurringService } from '@/services/recurringService';

export function useRecurring(token: string | null, refresh?: () => void) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recForm, setRecForm] = useState({ label: "", amount: "", day: "1", type: "Fixe" });

    const addRecurring = useCallback(async () => {
        if (!token) return;
        if (!recForm.label) return;
        setLoading(true);
        try {
            await RecurringService.add({ ...recForm, amount: parseFloat(recForm.amount), day: parseInt(recForm.day) }, token);
            setRecForm({ label: "", amount: "", day: "1", type: "Fixe" });
            if (refresh) refresh();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            return false;
        } finally {
            setLoading(false);
        }
    }, [token, recForm, refresh]);

    const deleteRecurring = useCallback(async (id: number) => {
        if (!token) return;
        setLoading(true);
        try {
            await RecurringService.delete(id, token);
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
        recForm,
        setRecForm,
        addRecurring,
        deleteRecurring,
        loading,
        error
    };
}
