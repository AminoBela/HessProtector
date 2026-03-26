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

    // Settings form state
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

    return {
        data: dashboardData,
        loading: isDashboardLoading,
        refresh: refreshDashboard,
        statsYear, setStatsYear,
        years, statsData,
        settingsForm, setSettingsForm, updateSettings,
    };
}
