"use client";

import { MarketView } from "@/components/hess/features/market/MarketView";
import { useAuth } from "@/hooks/useAuth";
import { useHessData } from "@/hooks/useHessData";
import { useSettings } from "@/context/SettingsContext";
import { buyTheme, equipTheme } from "@/services/transactionService";
import { useState } from "react";

export default function MarketPage() {
    const { token } = useAuth();
    const { theme, language } = useSettings();
    const { data, refresh, loading } = useHessData(token);
    const [buying, setBuying] = useState(false);

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    const handleBuyTheme = async (item: any) => {
        if (!token || buying) return;
        setBuying(true);
        try {
            await buyTheme(item.id, item.price, token);
            refresh();
        } catch (e: any) {
            if (e?.message?.includes("Bad Request")) refresh();
        } finally {
            setBuying(false);
        }
    };

    const handleEquipTheme = async (item: any) => {
        if (!token) return;
        try {
            await equipTheme(item.id, 0, token);
            refresh();
        } catch (e) { }
    };

    return (
        <MarketView
            data={data}
            language={language}
            theme={theme}
            onBuy={handleBuyTheme}
            onEquip={handleEquipTheme}
        />
    );
}
