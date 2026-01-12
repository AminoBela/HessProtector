import { ApiService } from "./apiClient";

const BASE_URL = "/account";

export const AccountService = {
    async exportData(token: string) {
        const headers: HeadersInit = {
            "Authorization": `Bearer ${token}`
        };
        try {
            let url = "http://127.0.0.1:8000/api/account/export";
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
            url = `${apiBase}/account/export`;

            const res = await fetch(url, { headers });
            if (!res.ok) throw new Error("Failed to export");
            return res.blob();
        } catch (e) {
            throw e;
        }
    },

    async changePassword(data: any, token: string) {
        return ApiService.put(`${BASE_URL}/password`, data, token);
    },

    async deleteAccount(token: string) {
        return ApiService.delete(`${BASE_URL}/me`, token);
    }
};
