import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PantryItem, PantryService } from '@/services/pantryService';

export function usePantry(token: string | null, refresh?: () => void) {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);
    const [pantryForm, setPantryForm] = useState({ item: "", qty: "", category: "Autre", expiry: "" });
    const [scannedTotal, setScannedTotal] = useState<number | null>(null);

    const addMutation = useMutation({
        mutationFn: async () => {
            if (!token || !pantryForm.item) throw new Error("Missing data");
            return await PantryService.add(pantryForm as any, token);
        },
        onSuccess: () => {
            setPantryForm({ item: "", qty: "", category: "Autre", expiry: "" });
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
            return await PantryService.delete(id, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            if (refresh) refresh();
        },
        onError: (err) => {
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    });

    const scanMutation = useMutation({
        mutationFn: async (file: File) => {
            if (!token) throw new Error("Missing token");
            return await PantryService.scanReceipt(file, token);
        },
        onSuccess: (result) => {
            if (result && result.total_amount) {
                setScannedTotal(result.total_amount);
            }
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            if (refresh) refresh();
        },
        onError: (err) => {
            console.error("Scan error:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    });

    return {
        pantryForm,
        setPantryForm,
        addPantryItem: async () => {
            try { await addMutation.mutateAsync(); return true; } catch { return false; }
        },
        deletePantryItem: async (id: number) => {
            try { await deleteMutation.mutateAsync(id); return true; } catch { return false; }
        },
        scanReceipt: async (file: File) => {
            try { return await scanMutation.mutateAsync(file); } catch { return null; }
        },
        loading: addMutation.isPending || deleteMutation.isPending || scanMutation.isPending,
        scanning: scanMutation.isPending,
        scannedTotal,
        setScannedTotal,
        error
    };
}
