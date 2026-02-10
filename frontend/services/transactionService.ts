import { ApiService } from "./apiClient";

export interface Transaction {
    id?: number;
    label: string;
    amount: number;
    type: 'depense' | 'revenu';
    category: string;
    date: string;
}

export const TransactionService = {
    getAll: async (token: string) => {

        return ApiService.get('/transactions', token);
    },

    add: async (tx: Transaction, token: string) => {
        return ApiService.post('/transactions', tx, token);
    },

    delete: async (id: number, token: string) => {
        return ApiService.delete(`/transactions/${id}`, token);
    },

    update: async (id: number, tx: Transaction, token: string) => {
        return ApiService.put(`/transactions/${id}`, tx, token);
    }
};

export const updateProfile = async (profile: any, token: string) => {
    return ApiService.put('/profile', profile, token);
}

export const getLimits = async (token: string) => {
    return ApiService.get('/budget-limits', token);
}

export const saveLimit = async (limit: { category: string, amount: number }, token: string) => {
    return ApiService.post('/budget-limits', limit, token);
}

export const buyTheme = async (itemId: string, price: number, token: string) => {
    return ApiService.post('/market/buy', { id: itemId, price }, token);
}

export const equipTheme = async (itemId: string, price: number, token: string) => {
    return ApiService.post('/market/equip', { id: itemId, price }, token);
}
