import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GoalItem, GoalsService } from '@/services/goalsService';

export function useGoals(token: string | null, refresh?: () => void) {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);
    const [goalForm, setGoalForm] = useState({ label: "", target: "", saved: "0", deadline: "", priority: "Moyenne" });

    const addMutation = useMutation({
        mutationFn: async () => {
            if (!token || !goalForm.label) throw new Error("Missing data");
            return await GoalsService.add({ ...goalForm, target: parseFloat(goalForm.target), saved: parseFloat(goalForm.saved) }, token);
        },
        onSuccess: () => {
            setGoalForm({ label: "", target: "", saved: "0", deadline: "", priority: "Moyenne" });
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
            return await GoalsService.delete(id, token);
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
        goalForm,
        setGoalForm,
        addGoal: async () => {
            try { await addMutation.mutateAsync(); return true; } catch { return false; }
        },
        deleteGoal: async (id: number) => {
            try { await deleteMutation.mutateAsync(id); return true; } catch { return false; }
        },
        loading: addMutation.isPending || deleteMutation.isPending,
        error
    };
}
