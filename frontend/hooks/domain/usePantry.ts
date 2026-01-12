import { useState, useCallback } from 'react';
import { PantryItem, PantryService } from '@/services/pantryService';

export function usePantry(token: string | null, refresh?: () => void) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pantryForm, setPantryForm] = useState({ item: "", qty: "", category: "Autre", expiry: "" });
    const [scannedTotal, setScannedTotal] = useState<number | null>(null);

    const addPantryItem = useCallback(async () => {
        if (!token) return;
        if (!pantryForm.item) return;

        setLoading(true);
        try {
            // Adjust to match Service structure if needed, forcing any type for simplicity given previous usage
            await PantryService.add(pantryForm as any, token);
            setPantryForm({ item: "", qty: "", category: "Autre", expiry: "" });
            if (refresh) refresh();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            return false;
        } finally {
            setLoading(false);
        }
    }, [token, pantryForm, refresh]);

    const deletePantryItem = useCallback(async (id: number) => {
        if (!token) return;
        setLoading(true);
        try {
            await PantryService.delete(id, token);
            if (refresh) refresh();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            return false;
        } finally {
            setLoading(false);
        }
    }, [token, refresh]);

    const scanReceipt = useCallback(async (file: File) => {
        if (!token) return null;
        setLoading(true);
        // We can use a separate state for scanning if needed, or just rely on loading.
        // For distinct UI feedback (e.g. specifically for receipt), let's use loading for now or add scanning state.
        // The View uses 'scanning' prop.
        try {
            const result = await PantryService.scanReceipt(file, token);
            if (result && result.total_amount) {
                setScannedTotal(result.total_amount);
            }
            if (refresh) refresh();
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            return null;
        } finally {
            setLoading(false);
        }
    }, [token, refresh]);

    return {
        pantryForm,
        setPantryForm,
        addPantryItem,
        deletePantryItem,
        scanReceipt,
        loading,
        // Alias loading to scanning for now to satisfy interface, or better to add dedicated state
        scanning: loading,
        scannedTotal,
        setScannedTotal,
        error
    };
}
