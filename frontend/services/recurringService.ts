import { ApiService } from "./apiClient";

export interface RecurringItem {
    id?: number;
    label: string;
    amount: number;
    day: number;
    type: string;
}

export const RecurringService = {
    add: async (rec: RecurringItem, token: string) => {
        return ApiService.post('/recurring', rec, token);
    },

    delete: async (id: number, token: string) => {
        return ApiService.delete(`/recurring/${id}`, token);
    }
};
