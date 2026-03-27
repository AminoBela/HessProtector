import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/apiClient';

export interface FuelEntry {
    id?: number;
    date: string;
    liters: number;
    total_cost: number;
    odometer: number;
    fuel_type: string;
    station?: string;
    is_full_tank: boolean;
    note?: string;
}

export interface FuelStats {
    total_cost: number;
    total_liters: number;
    total_distance: number;
    avg_consumption: number;
    cost_per_km: number;
    avg_price_per_liter: number;
    entry_count: number;
}

export function useFuel(token: string | null) {
    const queryClient = useQueryClient();

    // Queries
    const {
        data: fuelLog = [],
        isLoading: isLoadingLog,
    } = useQuery<FuelEntry[]>({
        queryKey: ['fuelLog', token],
        queryFn: () => ApiService.get('/fuel', token as string),
        enabled: !!token,
    });

    const {
        data: fuelStats = {
            total_cost: 0,
            total_liters: 0,
            total_distance: 0,
            avg_consumption: 0,
            cost_per_km: 0,
            avg_price_per_liter: 0,
            entry_count: 0
        } as FuelStats,
        isLoading: isLoadingStats,
    } = useQuery<FuelStats>({
        queryKey: ['fuelStats', token],
        queryFn: () => ApiService.get('/fuel/stats', token as string),
        enabled: !!token,
    });

    // Mutations
    const addFuelMutation = useMutation({
        mutationFn: (newEntry: FuelEntry) => ApiService.post('/fuel', newEntry, token as string),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fuelLog'] });
            queryClient.invalidateQueries({ queryKey: ['fuelStats'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] }); // Maybe impact on budget
        }
    });

    const deleteFuelMutation = useMutation({
        mutationFn: (id: number) => ApiService.delete(`/fuel/${id}`, token as string),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fuelLog'] });
            queryClient.invalidateQueries({ queryKey: ['fuelStats'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        }
    });

    const updateFuelMutation = useMutation({
        mutationFn: ({ id, entry }: { id: number, entry: FuelEntry }) => ApiService.put(`/fuel/${id}`, entry, token as string),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fuelLog'] });
            queryClient.invalidateQueries({ queryKey: ['fuelStats'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        }
    });

    const addFuel = async (entry: FuelEntry) => {
        if (!token) return;
        return await addFuelMutation.mutateAsync(entry);
    };

    const deleteFuel = async (id: number) => {
        if (!token) return;
        return await deleteFuelMutation.mutateAsync(id);
    };

    const updateFuel = async (id: number, entry: FuelEntry) => {
        if (!token) return;
        return await updateFuelMutation.mutateAsync({ id, entry });
    };

    return {
        fuelLog,
        fuelStats,
        isLoading: isLoadingLog || isLoadingStats,
        addFuel,
        deleteFuel,
        updateFuel,
        isAdding: addFuelMutation.isPending,
        isDeleting: deleteFuelMutation.isPending,
        isUpdating: updateFuelMutation.isPending,
    };
}
