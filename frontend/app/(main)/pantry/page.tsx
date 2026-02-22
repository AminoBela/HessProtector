"use client";

import { PantryView } from "@/components/hess/features/pantry/PantryView";
import { useAuth } from "@/hooks/useAuth";
import { useHessData } from "@/hooks/useHessData";
import { usePantry } from "@/hooks/domain/usePantry";
import { useTransactions } from "@/hooks/domain/useTransactions";
import { useSettings } from "@/context/SettingsContext";

export default function PantryPage() {
    const { token } = useAuth();
    const { theme, language } = useSettings();
    const { data, loading } = useHessData(token);
    const { pantryForm, setPantryForm, addPantryItem, deletePantryItem, scanReceipt, scanning, scannedTotal, setScannedTotal } = usePantry(token);
    const { addTransaction } = useTransactions(token);

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    const handleUploadReceipt = async (e: any) => {
        if (!e.target.files[0]) return;
        await scanReceipt(e.target.files[0]);
    };

    return (
        <PantryView
            data={data}
            pantryForm={pantryForm}
            setPantryForm={setPantryForm}
            handleAddPantry={addPantryItem}
            handleDeletePantry={deletePantryItem}
            scanning={scanning}
            handleUploadReceipt={handleUploadReceipt}
            language={language}
            theme={theme}
            scannedTotal={scannedTotal}
            setScannedTotal={setScannedTotal}
            handleAddTx={(form: any) => addTransaction(form)}
        />
    );
}
