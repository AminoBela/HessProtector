import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/apiClient';

export function useHessData(token: string | null) {
    const queryClient = useQueryClient();
    const [statsYear, setStatsYear] = useState(new Date().getFullYear().toString());

    // Dashboard Data Query
    const {
        data: dashboardData,
        isLoading: isDashboardLoading,
        refetch: refreshDashboard
    } = useQuery({
        queryKey: ['dashboard', token],
        queryFn: () => ApiService.get('/dashboard', token as string),
        enabled: !!token,
    });

    // Years Query
    const { data: years = [] } = useQuery({
        queryKey: ['years', token],
        queryFn: () => ApiService.get('/dashboard/years', token as string),
        enabled: !!token,
    });

    // Stats Query
    const { data: statsData } = useQuery({
        queryKey: ['stats', statsYear, token],
        queryFn: () => ApiService.get(`/dashboard/stats?year=${statsYear}`, token as string),
        enabled: !!token && !!statsYear,
    });

    // Form States (kept for settings only)
    const [settingsForm, setSettingsForm] = useState({ supermarket: "", diet: "" });

    // Sync settings form with fetched profile
    useEffect(() => {
        if (dashboardData?.profile) {
            setSettingsForm({
                supermarket: dashboardData.profile.supermarket || "",
                diet: dashboardData.profile.diet || ""
            });
        }
    }, [dashboardData]);

    const updateSettingsMutation = useMutation({
        mutationFn: (newSettings: any) => ApiService.put('/profile', newSettings, token as string),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        }
    });

    const updateSettings = async () => {
        if (!token) return;
        await updateSettingsMutation.mutateAsync(settingsForm);
    };

    // Coach States
    const [groceryBudget, setGroceryBudget] = useState([30]);
    const [planDays, setPlanDays] = useState([3]);
    const [planMeals, setPlanMeals] = useState<string[]>(["lunch", "dinner"]);
    const [generatedPrompt, setGeneratedPrompt] = useState("");

    const generatePromptMutation = useMutation({
        mutationFn: (args: { language: string, meals: string[], currentPlanJson?: string }) =>
            ApiService.post('/smart-prompt', {
                type: "meal_plan",
                budget: groceryBudget[0],
                days: planDays[0],
                meals: args.meals,
                language: args.language,
                current_plan: args.currentPlanJson
            }, token as string),
        onSuccess: (json) => {
            if (json.error) {
                console.error("Coach Error:", json.error);
                return;
            }
            if (json.prompt) {
                const promptStr = typeof json.prompt === 'string' ? json.prompt : JSON.stringify(json.prompt);
                setGeneratedPrompt(promptStr);
            }
        },
        onError: (e) => {
            console.error("Generator Failed:", e);
        }
    });

    const generatePrompt = async (language: string, planMeals: string[], currentPlanJson?: string) => {
        if (!token) return;
        setGeneratedPrompt("");
        await generatePromptMutation.mutateAsync({ language, meals: planMeals, currentPlanJson });
    };

    return {
        data: dashboardData,
        loading: isDashboardLoading,
        refresh: refreshDashboard,
        statsYear, setStatsYear,
        years, statsData,
        settingsForm, setSettingsForm, updateSettings,
        groceryBudget, setGroceryBudget,
        planDays, setPlanDays,
        planMeals, setPlanMeals,
        generatedPrompt, setGeneratedPrompt, generatePrompt
    };
}
