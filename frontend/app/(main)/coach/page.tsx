"use client";

import { CoachView } from "@/components/hess/features/coach/CoachView";
import { useAuth } from "@/hooks/useAuth";
import { useHessData } from "@/hooks/useHessData";
import { useSettings } from "@/context/SettingsContext";

export default function CoachPage() {
    const { token } = useAuth();
    const { theme, language } = useSettings();
    const { data, groceryBudget, setGroceryBudget, generatePrompt, generatedPrompt, planDays, setPlanDays, planMeals, setPlanMeals, setGeneratedPrompt } = useHessData(token);

    return (
        <CoachView
            data={data}
            groceryBudget={groceryBudget}
            setGroceryBudget={setGroceryBudget}
            generatePrompt={generatePrompt}
            generatedPrompt={generatedPrompt}
            planDays={planDays}
            setPlanDays={setPlanDays}
            planMeals={planMeals}
            setPlanMeals={setPlanMeals}
            language={language}
            onBack={() => setGeneratedPrompt("")}
            theme={theme}
            token={token || ""}
        />
    );
}
