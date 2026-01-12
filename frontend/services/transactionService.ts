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
        return ApiService.post('/transaction', tx, token);
    },

    delete: async (id: number, token: string) => {
        return ApiService.delete(`/transaction/${id}`, token);
    },

    update: async (id: number, tx: Transaction, token: string) => {
        return ApiService.put(`/transaction/${id}`, tx, token);
    }
};
