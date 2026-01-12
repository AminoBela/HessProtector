import { ApiService } from "./apiClient";

export interface PantryItem {
    id?: number;
    item: string;
    qty: string;
    category: string;
    expiry: string;
    added_date?: string;
}

export const PantryService = {
    add: async (item: PantryItem, token: string) => {
        return ApiService.post('/pantry', item, token);
    },

    delete: async (id: number, token: string) => {
        return ApiService.delete(`/pantry/${id}`, token);
    },

    scanReceipt: async (file: File, token: string) => {
        const formData = new FormData();
        formData.append('file', file);
        return ApiService.upload('/scan-receipt', formData, token);
    }
};
