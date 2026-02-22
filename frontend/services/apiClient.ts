const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export const ApiService = {
    async get(endpoint: string, token: string | null) {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`; // Keeping as a fallback
        }
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers,
            credentials: 'include'
        });
        if (!res.ok) {
            if (res.status === 401) {
                // Dispatch logout event or handle globally
                window.dispatchEvent(new Event('hess:logout'));
                throw new Error("Unauthorized");
            }
            throw new Error(`API Error: ${res.statusText} (${res.status}) - ${endpoint}`);
        }
        return res.json();
    },

    async post(endpoint: string, data: any, token: string | null) {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers,
            credentials: 'include',
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            if (res.status === 401) {
                window.dispatchEvent(new Event('hess:logout'));
                throw new Error("Unauthorized");
            }
            throw new Error(`API Error: ${res.statusText}`);
        }
        return res.json();
    },

    async put(endpoint: string, data: any, token: string | null) {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PUT",
            headers,
            credentials: 'include',
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            if (res.status === 401) {
                window.dispatchEvent(new Event('hess:logout'));
                throw new Error("Unauthorized");
            }
            throw new Error(`API Error: ${res.statusText}`);
        }
        return res.json();
    },

    async delete(endpoint: string, token: string | null) {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "DELETE",
            headers,
            credentials: 'include'
        });
        if (!res.ok) {
            if (res.status === 401) {
                window.dispatchEvent(new Event('hess:logout'));
                throw new Error("Unauthorized");
            }
            throw new Error(`API Error: ${res.statusText}`);
        }
        return res.json();
    },

    // Special method for file uploads (no JSON content-type)
    async upload(endpoint: string, formData: FormData, token: string | null) {
        const headers: HeadersInit = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers,
            credentials: 'include',
            body: formData,
        });
        if (!res.ok) {
            if (res.status === 401) {
                window.dispatchEvent(new Event('hess:logout'));
                throw new Error("Unauthorized");
            }
            throw new Error(`API Error: ${res.statusText}`);
        }
        return res.json();
    }
};
