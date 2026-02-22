"use client";

import { SettingsView } from "@/components/hess/features/settings/SettingsView";
import { useAuth } from "@/hooks/useAuth";
import { useHessData } from "@/hooks/useHessData";
import { useSettings } from "@/context/SettingsContext";

export default function SettingsPage() {
    const { token, logout } = useAuth();
    const { theme, language } = useSettings();
    const { data, settingsForm, setSettingsForm, updateSettings, loading } = useHessData(token);

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <SettingsView
            settingsForm={settingsForm}
            setSettingsForm={setSettingsForm}
            updateSettings={updateSettings}
            language={language}
            theme={theme}
            token={token}
            logout={logout}
        />
    );
}
