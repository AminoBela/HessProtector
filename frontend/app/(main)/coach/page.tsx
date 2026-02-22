"use client";

import { CoachView } from "@/components/hess/features/coach/CoachView";
import { useAuth } from "@/hooks/useAuth";
import { useHessData } from "@/hooks/useHessData";
import { useSettings } from "@/context/SettingsContext";

export default function CoachPage() {
    const { token } = useAuth();
    const { theme, language } = useSettings();
    const { data, loading, groceryBudget, setGroceryBudget, generatePrompt, generatedPrompt, planDays, setPlanDays, planMeals, setPlanMeals, setGeneratedPrompt } = useHessData(token);

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

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
