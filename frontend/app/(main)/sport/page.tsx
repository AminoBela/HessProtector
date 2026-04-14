"use client";

import { useAuth } from "@/hooks/useAuth";
import { useHessData } from "@/hooks/useHessData";
import { SportController } from "@/components/hess/features/sport/SportController";

export default function SportPage() {
    const { token } = useAuth();
    const { data, loading } = useHessData(token);

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return <SportController />;
}
