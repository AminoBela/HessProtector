import { useState, useEffect, useCallback } from 'react';

export function useHessData(token: string | null) {
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

    const [scannedTotal, setScannedTotal] = useState<number | null>(null);

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const refreshStats = useCallback(() => {
        if (!token) return;
        fetch(`http://127.0.0.1:8000/api/dashboard/stats?year=${statsYear}`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => {
                if (res.status === 401) return Promise.reject("Unauthorized");
                return res.json();
            })
            .then(s => setStatsData(s))
            .catch(e => {
                if (e !== "Unauthorized") console.error("Stats error:", e);
            });
    }, [token, statsYear]);

    const refresh = useCallback(() => {
        if (!token) return;
        fetch('http://127.0.0.1:8000/api/dashboard', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => {
                if (res.status === 401) {
                    window.dispatchEvent(new Event('hess:logout'));
                    return Promise.reject("Unauthorized"); // Reject to skip next .then
                }
                return res.json();
            })
            .then(d => {
                setData(d);
                setLoading(false);
                if (d?.profile) setSettingsForm(d.profile);
            })
            .catch(e => {
                if (e !== "Unauthorized") console.error("Refresh error:", e);
            });

        fetch('http://127.0.0.1:8000/api/dashboard/years', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => {
                if (res.status === 401) return Promise.reject("Unauthorized");
                return res.json();
            })
            .then(y => setYears(y))
            .catch(e => {
                if (e !== "Unauthorized") console.error("Years error:", e);
            });

        refreshStats();
    }, [token, refreshStats]);

    useEffect(() => {
        if (token) {
            refresh();
        } else {
            setLoading(false); // Stop loading if no token
        }
    }, [token, refresh]);

    useEffect(() => { refreshStats(); }, [statsYear, token, refreshStats]);

    // Actions
    const handleAddTx = async (overrideForm?: any) => {
        const form = overrideForm || txForm;
        if (!form.amount) return;
        await fetch('http://127.0.0.1:8000/api/transaction', { method: 'POST', headers: authHeaders, body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }) });
        refresh();
    };
    const handleDeleteTx = async (id: number) => { await fetch(`http://127.0.0.1:8000/api/transaction/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); refresh(); };
    const handleUpdateTx = async (id: number, form: any) => { await fetch(`http://127.0.0.1:8000/api/transaction/${id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }) }); refresh(); };

    const handleAddPantry = async () => { if (!pantryForm.item) return; await fetch('http://127.0.0.1:8000/api/pantry', { method: 'POST', headers: authHeaders, body: JSON.stringify(pantryForm) }); setPantryForm({ item: "", qty: "", category: "Autre", expiry: "" }); refresh(); };
    const handleDeletePantry = async (id: number) => { await fetch(`http://127.0.0.1:8000/api/pantry/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); refresh(); };

    const handleAddRec = async () => { if (!recForm.label) return; await fetch('http://127.0.0.1:8000/api/recurring', { method: 'POST', headers: authHeaders, body: JSON.stringify({ ...recForm, amount: parseFloat(recForm.amount), day: parseInt(recForm.day) }) }); setRecForm({ label: "", amount: "", day: "1", type: "Fixe" }); refresh(); };
    const handleDeleteRec = async (id: number) => { await fetch(`http://127.0.0.1:8000/api/recurring/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); refresh(); };

    const handleAddGoal = async () => { if (!goalForm.label) return; await fetch('http://127.0.0.1:8000/api/goals', { method: 'POST', headers: authHeaders, body: JSON.stringify({ ...goalForm, target: parseFloat(goalForm.target), saved: parseFloat(goalForm.saved) }) }); setGoalForm({ label: "", target: "", saved: "0", deadline: "", priority: "Moyenne" }); refresh(); };
    const handleDeleteGoal = async (id: number) => { await fetch(`http://127.0.0.1:8000/api/goals/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); refresh(); };

    const updateSettings = async () => { await fetch('http://127.0.0.1:8000/api/profile', { method: 'PUT', headers: authHeaders, body: JSON.stringify(settingsForm) }); refresh(); };

    const handleUploadReceipt = async (e: any) => {
        if (!e.target.files[0]) return;
        setScanning(true);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        // Note: FormData does not need Content-Type header, it sets it automatically with boundary.
        // But we DO need Auth header. 
        const res = await fetch('http://127.0.0.1:8000/api/scan-receipt', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const json = await res.json();

        if (json.total_amount) {
            setScannedTotal(json.total_amount);
        }

        setScanning(false);
        refresh();
    };

    const generatePrompt = async (language: string, planMeals: string[], currentPlanJson?: string) => {
        setGeneratedPrompt("");
        try {
            const res = await fetch('http://127.0.0.1:8000/api/smart-prompt', {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({
                    type: "meal_plan",
                    budget: groceryBudget[0],
                    days: planDays[0],
                    meals: planMeals,
                    language: language,
                    current_plan: currentPlanJson
                })
            });
            const json = await res.json();

            if (json.error) {
                console.error("Coach Error:", json.error);
                // Optionally let the UI know about the error?
                // For now, at least log it so user can see it in console.
                return;
            }

            if (json.prompt) {
                // If it's already an object, stringify it for the View which expects string
                const promptStr = typeof json.prompt === 'string' ? json.prompt : JSON.stringify(json.prompt);
                setGeneratedPrompt(promptStr);
            }
        } catch (e) {
            console.error("Generator Failed:", e);
        }
    };

    return {
        data, loading, refresh,
        statsYear, setStatsYear, years, statsData,
        txForm, setTxForm, handleAddTx, handleDeleteTx, handleUpdateTx,
        pantryForm, setPantryForm, handleAddPantry, handleDeletePantry,
        recForm, setRecForm, handleAddRec, handleDeleteRec,
        goalForm, setGoalForm, handleAddGoal, handleDeleteGoal,
        settingsForm, setSettingsForm, updateSettings,
        scanning, handleUploadReceipt, scannedTotal, setScannedTotal,
        groceryBudget, setGroceryBudget,
        planDays, setPlanDays,
        planMeals, setPlanMeals,
        generatedPrompt, setGeneratedPrompt, generatePrompt
    };
}
