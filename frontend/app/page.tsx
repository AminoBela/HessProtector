"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RecurringView } from "@/components/hess/RecurringView"
import { PantryView } from "@/components/hess/PantryView"
import { DashboardView } from "@/components/hess/DashboardView"
import { GoalsView } from "@/components/hess/GoalsView"
import { CoachView } from "@/components/hess/CoachView"
import { SettingsView } from "@/components/hess/SettingsView"
import { HistoryView } from "@/components/hess/HistoryView"
import { SetupWizard } from "@/components/hess/SetupWizard"
import { MainLayout } from "@/components/hess/MainLayout"
import { useHessData } from "@/hooks/useHessData"

// --- CONFIGURATION DESIGN ---
const COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e'];

export default function Home() {
    const {
        data, loading, refresh,
        statsYear, setStatsYear, years, statsData,
        txForm, setTxForm, handleAddTx, handleDeleteTx,
        pantryForm, setPantryForm, handleAddPantry, handleDeletePantry,
        recForm, setRecForm, handleAddRec, handleDeleteRec,
        goalForm, setGoalForm, handleAddGoal, handleDeleteGoal,
        settingsForm, setSettingsForm, updateSettings,
        scanning, handleUploadReceipt,
        groceryBudget, setGroceryBudget,
        planDays, setPlanDays,
        planMeals, setPlanMeals,
        generatedPrompt, setGeneratedPrompt, generatePrompt
    } = useHessData();

    const [activeTab, setActiveTab] = useState("dashboard")
    const [language, setLanguage] = useState("fr"); // 'fr' | 'es'
    const [theme, setTheme] = useState("dark"); // 'dark' | 'light'
    const [openTx, setOpenTx] = useState(false)

    // -- TRANSLATIONS --
    const T: any = {
        fr: {
            sidebar: { dashboard: "Tableau de Bord", coach: "Coach IA", recurring: "Calendrier", pantry: "Frigo & Scan", goals: "Épargne", history: "Historique", settings: "Paramètres" },
            header: { recurring: "Charges Fixes", pantry: "Stocks & Scan", goals: "Stratégie Épargne", dashboard: "Tableau de Bord", coach: "Coach Cuisine", history: "Historique", settings: "Paramètres" },
            rank: "Rang Actuel",
            newTx: "Transaction",
            dashboard: {
                netBalance: "Solde Net",
                annual: "Annuel",
                incoming: "Entrées",
                outgoing: "Sorties",
                balance: "Bilan",
                surplus: "Excédent",
                deficit: "Déficit",
                perDay: "Reste / Jour",
                daysLeft: "j restants",
                target: "Cible",
                evolution: "Évolution",
                categories: "Dépenses par Catégorie",
                activities: "Dernières Activités",
                loading: "Chargement...",
                noData: "Aucune donnée",
                bank: "Banque",
                toPay: "À payer"
            }
        },
        es: {
            sidebar: { dashboard: "Panel Principal", coach: "Chef IA", recurring: "Calendario", pantry: "Despensa", goals: "Ahorros", history: "Historial", settings: "Ajustes" },
            header: { recurring: "Cargas Fijas", pantry: "Inventario & Escáner", goals: "Estrategia de Ahorro", dashboard: "Panel Financiero", coach: "Chef de Cocina", history: "Historial de Gastos", settings: "Configuración" },
            rank: "Rango Actual",
            newTx: "Nueva Transacción",
            dashboard: {
                netBalance: "Saldo Neto",
                annual: "Anual",
                incoming: "Entradas",
                outgoing: "Salidas",
                balance: "Balance",
                surplus: "Excedente",
                deficit: "Déficit",
                perDay: "Restante / Día",
                daysLeft: "d restantes",
                target: "Meta",
                evolution: "Evolución",
                categories: "Gastos por Categoría",
                activities: "Últimas Actividades",
                loading: "Cargando...",
                noData: "Sin datos",
                bank: "Banco",
                toPay: "A pagar"
            }
        }
    }
    const t = (language === 'es' ? T.es : T.fr);

    // -- THEME BACKGROUNDS --
    const isLight = theme === 'light';
    const bg = isLight ? (
        <div className="fixed inset-0 -z-10 bg-[#eef2ef]">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/50 to-emerald-100/20"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply"></div>
        </div>
    ) : (
        <div className="fixed inset-0 -z-10 bg-black">
            <style jsx global>{`input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {-webkit-appearance: none; margin: 0;} input[type=number] {-moz-appearance: textfield;} @keyframes fluid {0% {background-position: 0% 50%} 50% {background-position: 100% 50%} 100% {background-position: 0% 50%}} .animate-fluid {animation: fluid 20s ease infinite; background-size: 400% 400%;}`}</style>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-black animate-fluid"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>
    );

    if (loading) return <div className="flex h-screen items-center justify-center bg-black text-emerald-400 font-bold uppercase tracking-[0.5em] animate-pulse">HessProtector...</div>

    if (data && !data.is_setup) {
        return <SetupWizard bg={bg} onFinish={async (setupData) => {
            await fetch('http://127.0.0.1:8000/api/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(setupData) });
            refresh();
        }} />
    }

    const barData = data ? Object.keys(data.categories).map(k => ({ name: k, montant: data.categories[k] })) : [];

    return (
        <MainLayout
            activeTab={activeTab} setActiveTab={setActiveTab}
            t={t} data={data}
            theme={theme} setTheme={setTheme}
            language={language} setLanguage={setLanguage}
            bg={bg}
            openTx={openTx} setOpenTx={setOpenTx}
            txForm={txForm} setTxForm={setTxForm}
            handleAddTx={() => { handleAddTx(); setOpenTx(false); }}
        >
            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                    {activeTab === 'dashboard' && <DashboardView data={data} barData={barData} COLORS={COLORS} language={language} theme={theme} statsData={statsData} years={years} statsYear={statsYear} setStatsYear={setStatsYear} t={t.dashboard} />}
                    {activeTab === 'recurring' && <RecurringView data={data} recForm={recForm} setRecForm={setRecForm} handleAddRec={handleAddRec} handleDeleteRec={handleDeleteRec} language={language} theme={theme} />}
                    {activeTab === 'pantry' && <PantryView data={data} pantryForm={pantryForm} setPantryForm={setPantryForm} handleAddPantry={handleAddPantry} handleDeletePantry={handleDeletePantry} scanning={scanning} handleUploadReceipt={handleUploadReceipt} language={language} theme={theme} />}
                    {activeTab === 'goals' && <GoalsView data={data} goalForm={goalForm} setGoalForm={setGoalForm} handleAddGoal={handleAddGoal} handleDeleteGoal={handleDeleteGoal} language={language} theme={theme} />}
                    {activeTab === 'coach' && <CoachView data={data} groceryBudget={groceryBudget} setGroceryBudget={setGroceryBudget} generatePrompt={generatePrompt} generatedPrompt={generatedPrompt} planDays={planDays} setPlanDays={setPlanDays} planMeals={planMeals} setPlanMeals={setPlanMeals} language={language} onBack={() => { setGeneratedPrompt(""); }} theme={theme} />}
                    {activeTab === 'settings' && <SettingsView settingsForm={settingsForm} setSettingsForm={setSettingsForm} updateSettings={updateSettings} language={language} theme={theme} />}
                    {activeTab === 'history' && <HistoryView data={data} handleDeleteTx={handleDeleteTx} language={language} theme={theme} />}
                </motion.div>
            </AnimatePresence>
        </MainLayout>
    )
}