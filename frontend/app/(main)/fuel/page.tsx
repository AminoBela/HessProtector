"use client";

import FuelView from "@/components/hess/features/fuel/FuelView";
import { useSettings } from "@/context/SettingsContext";
import { usePrivacy } from "@/context/PrivacyContext";

export default function FuelPage() {
    const { theme } = useSettings();
    const { isBlurred } = usePrivacy();
    const isLight = theme === "light";

    return <FuelView isLight={isLight} isBlurred={isBlurred} />;
}
