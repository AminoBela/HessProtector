export class ApiService {
    private static baseUrl = "http://localhost:8000/api";

    static async request<T>(endpoint: string, method: string = "GET", body?: any, token?: string): Promise<T> {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            method,
            headers,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);

        if (response.status === 401) {
            window.dispatchEvent(new Event('hess:logout'));
            throw new Error("Unauthorized");
        }

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }
}
