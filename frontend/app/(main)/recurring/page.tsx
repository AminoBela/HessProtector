"use client";

import { RecurringView } from "@/components/hess/features/recurring/RecurringView";
import { useAuth } from "@/hooks/useAuth";
import { useHessData } from "@/hooks/useHessData";
import { useRecurring } from "@/hooks/domain/useRecurring";
import { useSettings } from "@/context/SettingsContext";

export default function RecurringPage() {
    const { token } = useAuth();
    const { theme, language } = useSettings();
    const { data, loading } = useHessData(token);
    const { recForm, setRecForm, addRecurring, deleteRecurring } = useRecurring(token);

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <RecurringView
            data={data}
            recForm={recForm}
            setRecForm={setRecForm}
            handleAddRec={addRecurring}
            handleDeleteRec={deleteRecurring}
            language={language}
            theme={theme}
        />
    );
}
