"use client";

import { HistoryView } from "@/components/hess/features/history/HistoryView";
import { useAuth } from "@/hooks/useAuth";
import { useHessData } from "@/hooks/useHessData";
import { useTransactions } from "@/hooks/domain/useTransactions";
import { useSettings } from "@/context/SettingsContext";

export default function HistoryPage() {
    const { token } = useAuth();
    const { theme, language } = useSettings();
    const { data, loading } = useHessData(token);
    const { deleteTransaction, updateTransaction } = useTransactions(token);

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <HistoryView
            data={data}
            handleDeleteTx={deleteTransaction}
            handleUpdateTx={updateTransaction as any}
            language={language}
            theme={theme}
        />
    );
}
