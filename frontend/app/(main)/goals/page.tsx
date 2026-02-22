"use client";

import { GoalsView } from "@/components/hess/features/goals/GoalsView";
import { useAuth } from "@/hooks/useAuth";
import { useHessData } from "@/hooks/useHessData";
import { useGoals } from "@/hooks/domain/useGoals";
import { useSettings } from "@/context/SettingsContext";

export default function GoalsPage() {
    const { token } = useAuth();
    const { theme, language } = useSettings();
    const { data, loading } = useHessData(token);
    const { goalForm, setGoalForm, addGoal, deleteGoal } = useGoals(token);

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <GoalsView
            data={data}
            goalForm={goalForm}
            setGoalForm={setGoalForm}
            handleAddGoal={addGoal}
            handleDeleteGoal={deleteGoal}
            language={language}
            theme={theme}
        />
    );
}
