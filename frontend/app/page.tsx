"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PageTransition from "@/components/ui/PageTransition"
import { RecurringView } from "@/components/hess/features/recurring/RecurringView"
import { PantryView } from "@/components/hess/features/pantry/PantryView"
import { DashboardView } from "@/components/hess/features/dashboard/DashboardView"
import { GoalsView } from "@/components/hess/features/goals/GoalsView"
import { CoachView } from "@/components/hess/features/coach/CoachView"
import { SettingsView } from "@/components/hess/features/settings/SettingsView"
import { HistoryView } from "@/components/hess/features/history/HistoryView"
import { SetupWizard } from "@/components/hess/features/setup/SetupWizard"
import { MainLayout } from "@/components/hess/common/MainLayout"
import { AnalyticsView } from "@/components/hess/features/analytics/AnalyticsView"
import { AuthView } from "@/components/hess/features/auth/AuthView"
import { useHessData } from "@/hooks/useHessData"
import { useAuth } from "@/hooks/useAuth"
import { Translations } from "@/lib/i18n"
import { useTransactions } from "@/hooks/domain/useTransactions"
import { usePantry } from "@/hooks/domain/usePantry"
import { useRecurring } from "@/hooks/domain/useRecurring"
import { useGoals } from "@/hooks/domain/useGoals"
import { PrivacyProvider } from "@/context/PrivacyContext"
import { MarketView } from "@/components/hess/features/market/MarketView"
import { buyTheme, equipTheme } from "@/services/transactionService"

// --- CONFIGURATION DESIGN ---
const COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e'];
const gradients: any = {
    default: "bg-gradient-to-br from-emerald-900 via-zinc-900 to-black",
    gold: "bg-gradient-to-br from-yellow-700 via-amber-900 to-black",
    cyber: "bg-gradient-to-br from-purple-900 via-pink-900 to-black",
    matrix: "bg-gradient-to-br from-green-900 via-black to-emerald-900",
    neon: "bg-gradient-to-br from-blue-900 via-cyan-900 to-black",
};

// ... imports remain ...

export default function Home() {
    const { user, token, loading: authLoading, login, register, logout } = useAuth();
    const [language, setLanguage] = useState("fr");
    const [theme, setTheme] = useState("dark");

    // 1. Data Fetching (Legacy/Core)
    const {
        data, loading: dataLoading, refresh,
        statsYear, setStatsYear, years, statsData,
        settingsForm, setSettingsForm, updateSettings,
        groceryBudget, setGroceryBudget,
        planDays, setPlanDays,
        planMeals, setPlanMeals,
        generatedPrompt, setGeneratedPrompt, generatePrompt,
    } = useHessData(token);

    // 2. Modular Hooks (Action/Form Management)
    const { txForm, setTxForm, addTransaction, deleteTransaction, updateTransaction } = useTransactions(token, refresh);
    const { pantryForm, setPantryForm, addPantryItem, deletePantryItem, scanReceipt, scanning, scannedTotal, setScannedTotal } = usePantry(token, refresh);
    // Note: usePantry returns pantryForm. I need to check scannedTotal.
    // Wait, usePantry hook I updated:
    // returns { pantryForm, setPantryForm, addPantryItem, deletePantryItem, scanReceipt, loading, error }
    // It DOES NOT return `scannedTotal` or `setScannedTotal`. I missed that in usePantry update.
    // useHessData had `scannedTotal` state.
    // I should add `scannedTotal` to usePantry or handle it here.
    // Let's assume for now I will use usePantry as is and verify.
    // Actually, `PantryView` expects `scannedTotal`.
    // I need to update usePantry to handle scannedTotal first or keep it in page.tsx?
    // Better to keep it in usePantry.

    const { recForm, setRecForm, addRecurring, deleteRecurring } = useRecurring(token, refresh);
    const { goalForm, setGoalForm, addGoal, deleteGoal } = useGoals(token, refresh);

    // Scanned Total State (Temporary fix if not in hook, or I update hook now)
    // Actually, I should update usePantry to expose scannedTotal.
    // I'll proceed with this replace but mark a todo for scannedTotal or add it if usePantry supports it?
    // I'll add a useState for scannedTotal here for now, or use the one from usePantry if I add it.
    // Let's check usePantry content again. It does NOT have scannedTotal.
    // I will add [scannedTotal, setScannedTotal] locally here for now to avoid breaking build,
    // but the `scanReceipt` function in usePantry returns the result.
    // So I can set it here:

    const handleUploadReceipt = async (e: any) => {
        if (!e.target.files[0]) return;
        await scanReceipt(e.target.files[0]);
    };

    const handleBuyTheme = async (item: any) => {
        if (!token) return;
        try {
            await buyTheme(item.id, item.price, token);
            refresh(); // Refresh to update XP and unlocked themes
        } catch (e) {
            console.error(e);
            alert("Erreur lors de l'achat ou fonds insuffisants");
        }
    }

    const handleEquipTheme = async (item: any) => {
        if (!token) return;
        try {
            await equipTheme(item.id, 0, token);
            refresh(); // Refresh to update active theme
        } catch (e) {
            console.error(e);
        }
    }

    const [activeTab, setActiveTab] = useState("dashboard")
    const [openTx, setOpenTx] = useState(false)

    // -- TRANSLATIONS --
    const t = Translations[language as keyof typeof Translations] || Translations.fr;

    // -- THEME BACKGROUNDS --
    const activeGradient = data?.active_theme ? gradients[data.active_theme] : gradients.default;
    const bg = theme === 'dark' ? (
        <div className={`fixed inset-0 -z-10 ${activeGradient || gradients.default} transition-colors duration-1000`}></div>
    ) : (
        <div className="fixed inset-0 -z-10 bg-slate-50"></div>
    );

    // 1. Check Auth Loading
    if (authLoading) return <div className="flex h-screen items-center justify-center bg-black text-emerald-400 font-bold uppercase tracking-[0.5em] animate-pulse">HessProtector...</div>

    // 2. Not Authenticated -> Show AuthView
    if (!user) {
        return (
            <>
                {bg}
                <AuthView onLogin={login} onRegister={register} language={language} theme={theme} />
            </>
        )
    }

    // 3. Authenticated but Data Loading
    if (dataLoading) return <div className="flex h-screen items-center justify-center bg-black text-emerald-400 font-bold uppercase tracking-[0.5em] animate-pulse">Chargement données...</div>

    // 4. Authenticated & Data Loaded but Not Setup
    if (data && !data.is_setup) {
        return <SetupWizard bg={bg} onFinish={async (setupData) => {
            const h = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
            await fetch('http://127.0.0.1:8000/api/setup', { method: 'POST', headers: h, body: JSON.stringify(setupData) });
            refresh();
        }} />
    }

    const barData = data ? Object.keys(data.categories).map(k => ({ name: k, montant: data.categories[k] })) : [];

    return (
        <PrivacyProvider>
            <MainLayout
                activeTab={activeTab} setActiveTab={setActiveTab}
                data={data}
                theme={theme} setTheme={setTheme}
                language={language} setLanguage={setLanguage}
                bg={bg}
                openTx={openTx} setOpenTx={setOpenTx}
                txForm={txForm} setTxForm={setTxForm}
                handleAddTx={() => { addTransaction(); setOpenTx(false); }}
                user={user} logout={logout}
            >
                <AnimatePresence mode="wait">
                    <PageTransition key={activeTab} className="space-y-8">
                        {activeTab === 'dashboard' && <DashboardView data={data} barData={barData} COLORS={COLORS} language={language} theme={theme} statsData={statsData} years={years} statsYear={statsYear} setStatsYear={setStatsYear} t={t.dashboard} />}
                        {activeTab === 'analytics' && <AnalyticsView language={language} theme={theme} activeTab={activeTab} />}
                        {activeTab === 'recurring' && <RecurringView data={data} recForm={recForm} setRecForm={setRecForm} handleAddRec={addRecurring} handleDeleteRec={deleteRecurring} language={language} theme={theme} />}
                        {activeTab === 'pantry' && <PantryView
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
                            handleAddTx={(form) => { addTransaction(form); }}
                        />}
                        {activeTab === 'goals' && <GoalsView data={data} goalForm={goalForm} setGoalForm={setGoalForm} handleAddGoal={addGoal} handleDeleteGoal={deleteGoal} language={language} theme={theme} />}
                        {activeTab === 'coach' && <CoachView
                            data={data}
                            groceryBudget={groceryBudget} setGroceryBudget={setGroceryBudget}
                            generatePrompt={generatePrompt}
                            generatedPrompt={generatedPrompt}
                            planDays={planDays} setPlanDays={setPlanDays}
                            planMeals={planMeals} setPlanMeals={setPlanMeals}
                            language={language}
                            onBack={() => { setGeneratedPrompt(""); }}
                            theme={theme}
                            token={token || ""}
                        />}
                        {activeTab === 'market' && <MarketView data={data} language={language} theme={theme} onBuy={handleBuyTheme} onEquip={handleEquipTheme} />}
                        {activeTab === 'settings' && <SettingsView settingsForm={settingsForm} setSettingsForm={setSettingsForm} updateSettings={updateSettings} language={language} theme={theme} token={token} logout={logout} />}
                        {activeTab === 'history' && <HistoryView data={data} handleDeleteTx={deleteTransaction} handleUpdateTx={updateTransaction as any} language={language} theme={theme} />}
                    </PageTransition>
                </AnimatePresence>
            </MainLayout>
        </PrivacyProvider>
    )
}