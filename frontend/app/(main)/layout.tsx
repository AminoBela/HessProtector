"use client";

import { MainLayout } from "@/components/hess/common/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PrivacyProvider } from "@/context/PrivacyContext";
import { LoadingView } from "@/components/hess/common/LoadingView";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return <LoadingView />;
    }

    if (!user) return null;

    return (
        <PrivacyProvider>
            <MainLayout>{children}</MainLayout>
        </PrivacyProvider>
    );
}
