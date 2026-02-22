"use client";

import { MainLayout } from "@/components/hess/common/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PrivacyProvider } from "@/context/PrivacyContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-emerald-400 font-bold uppercase tracking-[0.5em] animate-pulse">
                HessProtector...
            </div>
        );
    }

    if (!user) return null;

    return (
        <PrivacyProvider>
            <MainLayout>{children}</MainLayout>
        </PrivacyProvider>
    );
}
