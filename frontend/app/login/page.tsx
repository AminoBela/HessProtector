"use client";

import { AuthView } from "@/components/hess/features/auth/AuthView";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/context/SettingsContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const gradients: any = {
    default: "bg-gradient-to-br from-slate-950 via-zinc-900 to-emerald-950/80",
};
const lightGradients: any = {
    default: "bg-gradient-to-br from-stone-50 via-emerald-50/40 to-slate-100",
};

export default function LoginPage() {
    const { login, register, user, loading } = useAuth();
    const { theme, language } = useSettings();
    const router = useRouter();

    useEffect(() => {
        if (user && !loading) {
            router.push("/dashboard");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-emerald-400 font-bold uppercase tracking-[0.5em] animate-pulse">
                HessProtector...
            </div>
        );
    }

    if (user) return null;

    const bg =
        theme === "dark" ? (
            <div className={`fixed inset-0 -z-10 ${gradients.default} transition-colors duration-1000`}></div>
        ) : (
            <div className={`fixed inset-0 -z-10 ${lightGradients.default} transition-colors duration-1000`}></div>
        );

    return (
        <>
            {bg}
            <AuthView
                onLogin={login}
                onRegister={register}
                language={language}
                theme={theme}
            />
        </>
    );
}
