import { useState, useEffect } from 'react';

export function useHessData() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [statsYear, setStatsYear] = useState(new Date().getFullYear().toString());
    const [years, setYears] = useState<string[]>([]);
    const [statsData, setStatsData] = useState<any>(null);

    // Form States
    const [txForm, setTxForm] = useState({ label: "", amount: "", type: "depense", category: "Alimentation" });
    const [pantryForm, setPantryForm] = useState({ item: "", qty: "", category: "Autre", expiry: "" });
    const [recForm, setRecForm] = useState({ label: "", amount: "", day: "1", type: "Fixe" });
    const [goalForm, setGoalForm] = useState({ label: "", target: "", saved: "0", deadline: "", priority: "Moyenne" });
    const [settingsForm, setSettingsForm] = useState({ supermarket: "", diet: "" });

    // Other States
    const [groceryBudget, setGroceryBudget] = useState([30]);
    const [planDays, setPlanDays] = useState([3]);
    const [planMeals, setPlanMeals] = useState<string[]>(["lunch", "dinner"]);
    const [generatedPrompt, setGeneratedPrompt] = useState("");
    const [scanning, setScanning] = useState(false);

    const refresh = () => {
        fetch('http://127.0.0.1:8000/api/dashboard')
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
                if (d.profile) setSettingsForm(d.profile);
            });
        fetch('http://127.0.0.1:8000/api/dashboard/years')
            .then(res => res.json())
            .then(y => setYears(y));
        refreshStats();
    };

    const refreshStats = () => {
        fetch(`http://127.0.0.1:8000/api/dashboard/stats?year=${statsYear}`)
            .then(res => res.json())
            .then(s => setStatsData(s));
    };

    useEffect(() => { refresh(); }, []);
    useEffect(() => { refreshStats(); }, [statsYear]);

    // Actions
    const handleAddTx = async () => { if (!txForm.amount) return; await fetch('http://127.0.0.1:8000/api/transaction', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...txForm, amount: parseFloat(txForm.amount) }) }); refresh(); };
    const handleDeleteTx = async (id: number) => { if (confirm("Supprimer ?")) await fetch(`http://127.0.0.1:8000/api/transaction/${id}`, { method: 'DELETE' }); refresh(); };

    const handleAddPantry = async () => { if (!pantryForm.item) return; await fetch('http://127.0.0.1:8000/api/pantry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pantryForm) }); setPantryForm({ item: "", qty: "", category: "Autre", expiry: "" }); refresh(); };
    const handleDeletePantry = async (id: number) => { await fetch(`http://127.0.0.1:8000/api/pantry/${id}`, { method: 'DELETE' }); refresh(); };

    const handleAddRec = async () => { if (!recForm.label) return; await fetch('http://127.0.0.1:8000/api/recurring', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...recForm, amount: parseFloat(recForm.amount), day: parseInt(recForm.day) }) }); setRecForm({ label: "", amount: "", day: "1", type: "Fixe" }); refresh(); };
    const handleDeleteRec = async (id: number) => { await fetch(`http://127.0.0.1:8000/api/recurring/${id}`, { method: 'DELETE' }); refresh(); };

    const handleAddGoal = async () => { if (!goalForm.label) return; await fetch('http://127.0.0.1:8000/api/goals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...goalForm, target: parseFloat(goalForm.target), saved: parseFloat(goalForm.saved) }) }); setGoalForm({ label: "", target: "", saved: "0", deadline: "", priority: "Moyenne" }); refresh(); };
    const handleDeleteGoal = async (id: number) => { await fetch(`http://127.0.0.1:8000/api/goals/${id}`, { method: 'DELETE' }); refresh(); };

    const updateSettings = async () => { await fetch('http://127.0.0.1:8000/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settingsForm) }); alert("Profil mis à jour !"); refresh(); };

    const handleUploadReceipt = async (e: any) => {
        if (!e.target.files[0]) return;
        setScanning(true);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        await fetch('http://127.0.0.1:8000/api/scan-receipt', { method: 'POST', body: formData });
        setScanning(false);
        refresh();
    };

    const generatePrompt = async (language: string, planMeals: string[], currentPlanJson?: string) => {
        setGeneratedPrompt("");
        const res = await fetch('http://127.0.0.1:8000/api/smart-prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: "shopping",
                budget: groceryBudget[0],
                days: planDays[0],
                meals: planMeals,
                language: language,
                current_plan: currentPlanJson
            })
        });
        const json = await res.json();
        setGeneratedPrompt(json.prompt);
    };

    return {
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
    };
}
