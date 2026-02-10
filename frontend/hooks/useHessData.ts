import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '@/services/apiClient';

export function useHessData(token: string | null) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [statsYear, setStatsYear] = useState(new Date().getFullYear().toString());
    const [years, setYears] = useState<string[]>([]);
    const [statsData, setStatsData] = useState<any>(null);

    // Form States (kept for settings only — domain hooks handle the others)
    const [settingsForm, setSettingsForm] = useState({ supermarket: "", diet: "" });

    // Coach States
    const [groceryBudget, setGroceryBudget] = useState([30]);
    const [planDays, setPlanDays] = useState([3]);
    const [planMeals, setPlanMeals] = useState<string[]>(["lunch", "dinner"]);
    const [generatedPrompt, setGeneratedPrompt] = useState("");

    const refreshStats = useCallback(() => {
        if (!token) return;
        ApiService.get(`/dashboard/stats?year=${statsYear}`, token)
            .then(s => setStatsData(s))
            .catch(e => {
                if (e.message !== "Unauthorized") console.error("Stats error:", e);
            });
    }, [token, statsYear]);

    const refresh = useCallback(() => {
        if (!token) return;
        ApiService.get('/dashboard', token)
            .then(d => {
                setData(d);
                setLoading(false);
                if (d?.profile) setSettingsForm(d.profile);
            })
            .catch(e => {
                if (e.message !== "Unauthorized") console.error("Refresh error:", e);
            });

        ApiService.get('/dashboard/years', token)
            .then(y => setYears(y))
            .catch(e => {
                if (e.message !== "Unauthorized") console.error("Years error:", e);
            });

        refreshStats();
    }, [token, refreshStats]);

    useEffect(() => {
        if (token) {
            refresh();
        } else {
            setLoading(false);
        }
    }, [token, refresh]);

    useEffect(() => { refreshStats(); }, [statsYear, token, refreshStats]);

    // Settings action
    const updateSettings = async () => {
        if (!token) return;
        await ApiService.put('/profile', settingsForm, token);
        refresh();
    };

    // Coach prompt generation
    const generatePrompt = async (language: string, planMeals: string[], currentPlanJson?: string) => {
        if (!token) return;
        setGeneratedPrompt("");
        try {
            const json = await ApiService.post('/smart-prompt', {
                type: "meal_plan",
                budget: groceryBudget[0],
                days: planDays[0],
                meals: planMeals,
                language: language,
                current_plan: currentPlanJson
            }, token);

            if (json.error) {
                console.error("Coach Error:", json.error);
                return;
            }

            if (json.prompt) {
                const promptStr = typeof json.prompt === 'string' ? json.prompt : JSON.stringify(json.prompt);
                setGeneratedPrompt(promptStr);
            }
        } catch (e) {
            console.error("Generator Failed:", e);
        }
    };

    return {
        data, loading, refresh,
        statsYear, setStatsYear, years, statsData,
        settingsForm, setSettingsForm, updateSettings,
        groceryBudget, setGroceryBudget,
        planDays, setPlanDays,
        planMeals, setPlanMeals,
        generatedPrompt, setGeneratedPrompt, generatePrompt
    };
}
