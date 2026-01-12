import { useState, useCallback } from 'react';
import { GoalItem, GoalsService } from '@/services/goalsService';

export function useGoals(token: string | null, refresh?: () => void) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [goalForm, setGoalForm] = useState({ label: "", target: "", saved: "0", deadline: "", priority: "Moyenne" });

    const addGoal = useCallback(async () => {
        if (!token) return;
        if (!goalForm.label) return;
        setLoading(true);
        try {
            await GoalsService.add({ ...goalForm, target: parseFloat(goalForm.target), saved: parseFloat(goalForm.saved) }, token);
            setGoalForm({ label: "", target: "", saved: "0", deadline: "", priority: "Moyenne" });
            if (refresh) refresh();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            return false;
        } finally {
            setLoading(false);
        }
    }, [token, goalForm, refresh]);

    const deleteGoal = useCallback(async (id: number) => {
        if (!token) return;
        setLoading(true);
        try {
            await GoalsService.delete(id, token);
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
        goalForm,
        setGoalForm,
        addGoal,
        deleteGoal,
        loading,
        error
    };
}
