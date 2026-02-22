"use client";

import { AnalyticsView } from "@/components/hess/features/analytics/AnalyticsView";
import { useSettings } from "@/context/SettingsContext";

export default function AnalyticsPage() {
    const { theme, language } = useSettings();
    return <AnalyticsView language={language} theme={theme} activeTab="analytics" />;
}
