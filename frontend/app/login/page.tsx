"use client";

import { AuthView } from "@/components/hess/features/auth/AuthView";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/context/SettingsContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AnimatedBackground } from "@/components/hess/common/AnimatedBackground";

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

    const isLight = theme === "light";
    const bg = <AnimatedBackground themeId="default" isLight={isLight} />;

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
