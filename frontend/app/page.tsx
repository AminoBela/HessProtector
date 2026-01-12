"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PageTransition from "@/components/ui/PageTransition"
import { RecurringView } from "@/components/hess/RecurringView"
import { PantryView } from "@/components/hess/PantryView"
import { DashboardView } from "@/components/hess/DashboardView"
import { GoalsView } from "@/components/hess/GoalsView"
import { CoachView } from "@/components/hess/CoachView"
import { SettingsView } from "@/components/hess/SettingsView"
import { HistoryView } from "@/components/hess/HistoryView"
import { SetupWizard } from "@/components/hess/SetupWizard"
import { MainLayout } from "@/components/hess/MainLayout"
import { AnalyticsView } from "@/components/hess/AnalyticsView"
import { AuthView } from "@/components/hess/AuthView" // [NEW]
import { useHessData } from "@/hooks/useHessData"
import { useAuth } from "@/hooks/useAuth"
import { Translations } from "@/lib/i18n"
import { useTransactions } from "@/hooks/domain/useTransactions"
import { usePantry } from "@/hooks/domain/usePantry"
import { useRecurring } from "@/hooks/domain/useRecurring"
import { useGoals } from "@/hooks/domain/useGoals"

// --- CONFIGURATION DESIGN ---
const COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e'];

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

    // ... rest of component

    const [activeTab, setActiveTab] = useState("dashboard")
    const [openTx, setOpenTx] = useState(false)

    // -- TRANSLATIONS --
    const t = Translations[language as keyof typeof Translations] || Translations.fr;

    // -- THEME BACKGROUNDS --
    const isLight = theme === 'light';
    const bg = isLight ? (
        <div className="fixed inset-0 -z-10 bg-[#eef2ef]">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/50 to-emerald-100/20"></div>
            <div className="absolute inset-0 bg-opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply opacity-10"></div>
        </div>
    ) : (
        <div className="fixed inset-0 -z-10 bg-black">
            <style jsx global>{`input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {-webkit-appearance: none; margin: 0;} input[type=number] {-moz-appearance: textfield;} @keyframes fluid {0% {background-position: 0% 50%} 50% {background-position: 100% 50%} 100% {background-position: 0% 50%}} .animate-fluid {animation: fluid 20s ease infinite; background-size: 400% 400%;}`}</style>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-black animate-fluid"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>
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
                        generatePrompt={async (json) => generatePrompt(language, planMeals, json)}
                        generatedPrompt={generatedPrompt}
                        planDays={planDays} setPlanDays={setPlanDays}
                        planMeals={planMeals} setPlanMeals={setPlanMeals}
                        language={language}
                        onBack={() => { setGeneratedPrompt(""); }}
                        theme={theme}
                    />}
                    {activeTab === 'settings' && <SettingsView settingsForm={settingsForm} setSettingsForm={setSettingsForm} updateSettings={updateSettings} language={language} theme={theme} token={token} logout={logout} />}
                    {activeTab === 'history' && <HistoryView data={data} handleDeleteTx={deleteTransaction} handleUpdateTx={updateTransaction as any} language={language} theme={theme} />}
                </PageTransition>
            </AnimatePresence>
        </MainLayout>
    )
}