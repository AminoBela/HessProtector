"use client";

import { SettingsView } from "@/components/hess/features/settings/SettingsView";
import { useAuth } from "@/hooks/useAuth";
import { useHessData } from "@/hooks/useHessData";
import { useSettings } from "@/context/SettingsContext";

export default function SettingsPage() {
    const { token, logout } = useAuth();
    const { theme, language } = useSettings();
    const { settingsForm, setSettingsForm, updateSettings } = useHessData(token);

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
