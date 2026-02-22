"use client";

import { RecurringView } from "@/components/hess/features/recurring/RecurringView";
import { useAuth } from "@/hooks/useAuth";
import { useHessData } from "@/hooks/useHessData";
import { useRecurring } from "@/hooks/domain/useRecurring";
import { useSettings } from "@/context/SettingsContext";

export default function RecurringPage() {
    const { token } = useAuth();
    const { theme, language } = useSettings();
    const { data } = useHessData(token);
    const { recForm, setRecForm, addRecurring, deleteRecurring } = useRecurring(token);

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
