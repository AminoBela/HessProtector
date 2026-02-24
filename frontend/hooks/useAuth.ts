import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = "http://34.78.42.145/api";
const AUTH_BASE_URL = API_BASE_URL;

export function useAuth() {
    const [user, setUser] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        // Since JWT is in HttpOnly cookie, we just rely on the stored username to know if we are logged in
        // A robust implementation would hit a /api/me endpoint here.
        const storedUser = localStorage.getItem('hess_user');
        if (storedUser) {
            setToken("cookie_token"); // Dummy token to bypass frontend checks, real token is in cookie
            setUser(storedUser);
        }
        setLoading(false);

        // Listen for 401 logout events
        const handleLogout = () => logout();
        window.addEventListener('hess:logout', handleLogout);
        return () => window.removeEventListener('hess:logout', handleLogout);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const res = await fetch(`${AUTH_BASE_URL}/auth/login`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (res.ok) {
                localStorage.setItem('hess_user', username);
                setToken("cookie_token");
                setUser(username);
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const register = async (username: string, password: string, email: string) => {
        try {
            const res = await fetch(`${AUTH_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password, email })
            });

            if (res.ok) {
                localStorage.setItem('hess_user', username);
                setToken("cookie_token");
                setUser(username);
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const logout = async () => {
        try {
            // Hit backend to clear HttpOnly cookie
            await fetch(`${AUTH_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (e) {
            console.error(e);
        }

        // We clean up localStorage as well (legacy tokens if they existed)
        localStorage.removeItem('hess_token');
        localStorage.removeItem('hess_user');
        setToken(null);
        setUser(null);
        queryClient.clear(); // Clear all cached user data

        // Force navigate to login page
        window.location.href = '/login';
    };

    return { user, token, loading, login, register, logout };
}
