"use client";

import { GoalsView } from "@/components/hess/features/goals/GoalsView";
import { useAuth } from "@/hooks/useAuth";
import { useHessData } from "@/hooks/useHessData";
import { useGoals } from "@/hooks/domain/useGoals";
import { useSettings } from "@/context/SettingsContext";

export default function GoalsPage() {
    const { token } = useAuth();
    const { theme, language } = useSettings();
    const { data } = useHessData(token);
    const { goalForm, setGoalForm, addGoal, deleteGoal } = useGoals(token);

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
