"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/ui/PageTransition";
import { RecurringView } from "@/components/hess/features/recurring/RecurringView";
import { PantryView } from "@/components/hess/features/pantry/PantryView";
import { DashboardView } from "@/components/hess/features/dashboard/DashboardView";
import { GoalsView } from "@/components/hess/features/goals/GoalsView";
import { CoachView } from "@/components/hess/features/coach/CoachView";
import { SettingsView } from "@/components/hess/features/settings/SettingsView";
import { HistoryView } from "@/components/hess/features/history/HistoryView";
import { SetupWizard } from "@/components/hess/features/setup/SetupWizard";
import { MainLayout } from "@/components/hess/common/MainLayout";
import { AnalyticsView } from "@/components/hess/features/analytics/AnalyticsView";
import { AuthView } from "@/components/hess/features/auth/AuthView";
import { useHessData } from "@/hooks/useHessData";
import { useAuth } from "@/hooks/useAuth";
import { Translations } from "@/lib/i18n";
import { useTransactions } from "@/hooks/domain/useTransactions";
import { usePantry } from "@/hooks/domain/usePantry";
import { useRecurring } from "@/hooks/domain/useRecurring";
import { useGoals } from "@/hooks/domain/useGoals";
import { PrivacyProvider } from "@/context/PrivacyContext";
import { MarketView } from "@/components/hess/features/market/MarketView";
import { buyTheme, equipTheme } from "@/services/transactionService";
import { ApiService } from "@/services/apiClient";

// --- CONFIGURATION DESIGN ---
const COLORS = [
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
];
const gradients: any = {
  default: "bg-gradient-to-br from-slate-950 via-zinc-900 to-emerald-950/80",
  gold: "bg-gradient-to-br from-stone-950 via-neutral-900 to-amber-950/60",
  cyber: "bg-gradient-to-br from-zinc-950 via-slate-900 to-fuchsia-950/50",
  matrix: "bg-gradient-to-br from-neutral-950 via-zinc-950 to-emerald-950/70",
  neon: "bg-gradient-to-br from-zinc-950 via-blue-950/80 to-cyan-950/50",
};
const lightGradients: any = {
  default: "bg-gradient-to-br from-stone-50 via-emerald-50/40 to-slate-100",
  gold: "bg-gradient-to-br from-amber-50/80 via-stone-50 to-orange-50/60",
  cyber: "bg-gradient-to-br from-slate-50 via-fuchsia-50/30 to-rose-50/40",
  matrix: "bg-gradient-to-br from-stone-50 via-emerald-50/30 to-zinc-100",
  neon: "bg-gradient-to-br from-slate-50 via-blue-50/50 to-cyan-50/30",
};

export default function Home() {
  const {
    user,
    token,
    loading: authLoading,
    login,
    register,
    logout,
  } = useAuth();
  const [language, setLanguage] = useState("fr");
  const [theme, setTheme] = useState("dark");

  // Data Fetching (core dashboard, stats, coach, settings)
  const {
    data,
    loading: dataLoading,
    refresh,
    statsYear,
    setStatsYear,
    years,
    statsData,
    settingsForm,
    setSettingsForm,
    updateSettings,
    groceryBudget,
    setGroceryBudget,
    planDays,
    setPlanDays,
    planMeals,
    setPlanMeals,
    generatedPrompt,
    setGeneratedPrompt,
    generatePrompt,
  } = useHessData(token);

  // Modular Domain Hooks
  const {
    txForm,
    setTxForm,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  } = useTransactions(token, refresh);
  const {
    pantryForm,
    setPantryForm,
    addPantryItem,
    deletePantryItem,
    scanReceipt,
    scanning,
    scannedTotal,
    setScannedTotal,
  } = usePantry(token, refresh);
  const { recForm, setRecForm, addRecurring, deleteRecurring } = useRecurring(
    token,
    refresh,
  );
  const { goalForm, setGoalForm, addGoal, deleteGoal } = useGoals(
    token,
    refresh,
  );

  const handleUploadReceipt = async (e: any) => {
    if (!e.target.files[0]) return;
    await scanReceipt(e.target.files[0]);
  };

  const [buying, setBuying] = useState(false);
  const handleBuyTheme = async (item: any) => {
    if (!token || buying) return;
    setBuying(true);
    try {
      await buyTheme(item.id, item.price, token);
      refresh();
    } catch (e: any) {
      const msg = e?.message || "";
      if (msg.includes("Bad Request")) {
        // Could be "Already owned" or "Insufficient XP" — refresh to sync UI
        refresh();
      } else {
        console.error(e);
      }
    } finally {
      setBuying(false);
    }
  };

  const handleEquipTheme = async (item: any) => {
    if (!token) return;
    try {
      await equipTheme(item.id, 0, token);
      refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const [activeTab, setActiveTab] = useState("dashboard");
  const [openTx, setOpenTx] = useState(false);

  // Translations
  const t =
    Translations[language as keyof typeof Translations] || Translations.fr;

  // Theme Backgrounds
  const currentTheme = data?.profile?.active_theme || "default";
  const activeGradient = gradients[currentTheme] || gradients.default;
  const activeLightGradient =
    lightGradients[currentTheme] || lightGradients.default;
  const bg =
    theme === "dark" ? (
      <div
        className={`fixed inset-0 -z-10 ${activeGradient} transition-colors duration-1000`}
      ></div>
    ) : (
      <div
        className={`fixed inset-0 -z-10 ${activeLightGradient} transition-colors duration-1000`}
      ></div>
    );

  // 1. Check Auth Loading
  if (authLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-black text-emerald-400 font-bold uppercase tracking-[0.5em] animate-pulse">
        HessProtector...
      </div>
    );

  // 2. Not Authenticated -> Show AuthView
  if (!user) {
    return (
      <>
        {bg}
        <AuthView
          onLogin={login}
          onRegister={register}
          language={language}
          theme={theme}
        />
      </>
    );
  }

  // 3. Authenticated but Data Loading
  if (dataLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-black text-emerald-400 font-bold uppercase tracking-[0.5em] animate-pulse">
        Chargement données...
      </div>
    );

  // 4. Authenticated & Data Loaded but Not Setup
  if (data && !data.is_setup) {
    return (
      <SetupWizard
        bg={bg}
        onFinish={async (setupData) => {
          await ApiService.post("/setup", setupData, token);
          refresh();
        }}
      />
    );
  }

  const barData = data
    ? Object.keys(data.categories).map((k) => ({
        name: k,
        montant: data.categories[k],
      }))
    : [];

  return (
    <PrivacyProvider>
      <MainLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={data}
        theme={theme}
        setTheme={setTheme}
        activeColorTheme={currentTheme}
        language={language}
        setLanguage={setLanguage}
        bg={bg}
        openTx={openTx}
        setOpenTx={setOpenTx}
        txForm={txForm}
        setTxForm={setTxForm}
        handleAddTx={() => {
          addTransaction();
          setOpenTx(false);
        }}
        user={user}
        logout={logout}
      >
        <AnimatePresence mode="wait">
          <PageTransition key={activeTab} className="space-y-8">
            {activeTab === "dashboard" && (
              <DashboardView
                data={data}
                barData={barData}
                COLORS={COLORS}
                language={language}
                theme={theme}
                statsData={statsData}
                years={years}
                statsYear={statsYear}
                setStatsYear={setStatsYear}
                t={t.dashboard}
              />
            )}
            {activeTab === "analytics" && (
              <AnalyticsView
                language={language}
                theme={theme}
                activeTab={activeTab}
              />
            )}
            {activeTab === "recurring" && (
              <RecurringView
                data={data}
                recForm={recForm}
                setRecForm={setRecForm}
                handleAddRec={addRecurring}
                handleDeleteRec={deleteRecurring}
                language={language}
                theme={theme}
              />
            )}
            {activeTab === "pantry" && (
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
                handleAddTx={(form) => {
                  addTransaction(form);
                }}
              />
            )}
            {activeTab === "goals" && (
              <GoalsView
                data={data}
                goalForm={goalForm}
                setGoalForm={setGoalForm}
                handleAddGoal={addGoal}
                handleDeleteGoal={deleteGoal}
                language={language}
                theme={theme}
              />
            )}
            {activeTab === "coach" && (
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
                onBack={() => {
                  setGeneratedPrompt("");
                }}
                theme={theme}
                token={token || ""}
              />
            )}
            {activeTab === "market" && (
              <MarketView
                data={data}
                language={language}
                theme={theme}
                onBuy={handleBuyTheme}
                onEquip={handleEquipTheme}
              />
            )}
            {activeTab === "settings" && (
              <SettingsView
                settingsForm={settingsForm}
                setSettingsForm={setSettingsForm}
                updateSettings={updateSettings}
                language={language}
                theme={theme}
                token={token}
                logout={logout}
              />
            )}
            {activeTab === "history" && (
              <HistoryView
                data={data}
                handleDeleteTx={deleteTransaction}
                handleUpdateTx={updateTransaction as any}
                language={language}
                theme={theme}
              />
            )}
          </PageTransition>
        </AnimatePresence>
      </MainLayout>
    </PrivacyProvider>
  );
}
