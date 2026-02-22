"use client";

import { DashboardView } from "@/components/hess/features/dashboard/DashboardView";
import { useHessData } from "@/hooks/useHessData";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/context/SettingsContext";
import { Translations } from "@/lib/i18n";
import { SetupWizard } from "@/components/hess/features/setup/SetupWizard";
import { ApiService } from "@/services/apiClient";

const COLORS = [
    "#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e",
];

export default function DashboardPage() {
    const { token } = useAuth();
    const { theme, language } = useSettings();
    const {
        data,
        statsYear, setStatsYear,
        years,
        statsData,
        refresh
    } = useHessData(token);

    if (data && !data.is_setup) {
        return (
            <SetupWizard
                bg={null}
                onFinish={async (setupData) => {
                    await ApiService.post("/setup", setupData, token);
                    refresh();
                }}
            />
        );
    }

    const t = Translations[language as keyof typeof Translations] || Translations.fr;
    const barData = data
        ? Object.keys(data.categories).map((k) => ({
            name: k,
            montant: data.categories[k],
        }))
        : [];

    return (
        <DashboardView
            data={data}
            barData={barData}
            COLORS={COLORS}
            language={language}
            theme={theme}
            statsData={statsData}
            years={years}
            statsYear={statsYear}
            setStatsYear={setStatsYear}
            t={t.dashboard}
        />
    );
}
