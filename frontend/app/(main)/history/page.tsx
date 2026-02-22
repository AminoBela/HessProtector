"use client";

import { HistoryView } from "@/components/hess/features/history/HistoryView";
import { useAuth } from "@/hooks/useAuth";
import { useHessData } from "@/hooks/useHessData";
import { useTransactions } from "@/hooks/domain/useTransactions";
import { useSettings } from "@/context/SettingsContext";

export default function HistoryPage() {
    const { token } = useAuth();
    const { theme, language } = useSettings();
    const { data } = useHessData(token);
    const { deleteTransaction, updateTransaction } = useTransactions(token);

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
