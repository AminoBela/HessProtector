import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const AUTH_BASE_URL = API_BASE_URL.replace('/api', '');

export function useAuth() {
    const [user, setUser] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Auto-login from localStorage
        const storedToken = localStorage.getItem('hess_token');
        const storedUser = localStorage.getItem('hess_user');
        if (storedToken && storedUser) {
            setToken(storedToken);
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
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                const newToken = data.access_token;
                localStorage.setItem('hess_token', newToken);
                localStorage.setItem('hess_user', username);
                setToken(newToken);
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
                body: JSON.stringify({ username, password, email })
            });

            if (res.ok) {
                const data = await res.json();
                const newToken = data.access_token;
                localStorage.setItem('hess_token', newToken);
                localStorage.setItem('hess_user', username);
                setToken(newToken);
                setUser(username);
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('hess_token');
        localStorage.removeItem('hess_user');
        setToken(null);
        setUser(null);
    };

    return { user, token, loading, login, register, logout };
}
