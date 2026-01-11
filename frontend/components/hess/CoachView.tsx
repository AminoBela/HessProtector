import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog" // Assuming these exist
import { ChefHat, Sparkles, Bot, ShoppingCart, Lightbulb, Save, RefreshCw, PenSquare, ArrowLeft, Trash2, History, Loader2, Check } from "lucide-react"

const cardGlassDark = "bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-2xl text-white rounded-3xl overflow-hidden hover:bg-zinc-900/50 transition-colors duration-500";
const cardGlassHeavyDark = "bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl text-white rounded-3xl p-6";

interface CoachViewProps {
    data: any;
    groceryBudget: number[];
    setGroceryBudget: (value: number[]) => void;
    generatePrompt: (currentPlanJson?: string) => Promise<void>;
    generatedPrompt: string;
    planDays: number[];
    setPlanDays: (value: number[]) => void;
    planMeals: string[];
    setPlanMeals: (value: string[]) => void;
    language: string; // 'fr' | 'es'
    onBack: () => void;
    theme: string;
}

interface CoachResponse {
    analysis: string;
    meals: { day: string; lunch: string; dinner: string }[];
    shopping_list: { item: string; price: string }[];
    total_estimated_cost?: string;
    tips: string[];
}

interface SavedPlan {
    id: number;
    name: string;
    content_json: string;
    created_at: string;
}

export function CoachView({ data, groceryBudget, setGroceryBudget, generatePrompt, generatedPrompt, planDays, setPlanDays, planMeals, setPlanMeals, language, onBack, theme }: CoachViewProps) {
    const isLight = theme === 'light';
    const cardGlass = isLight
        ? "bg-white/70 backdrop-blur-xl border-emerald-900/5 shadow-xl text-slate-800 rounded-3xl overflow-hidden hover:bg-white/80 transition-colors duration-500"
        : cardGlassDark;

    const cardGlassHeavy = isLight
        ? "bg-white/90 backdrop-blur-xl border-emerald-900/10 shadow-xl text-slate-800 rounded-3xl p-6"
        : cardGlassHeavyDark;

    const [parsedData, setParsedData] = useState<CoachResponse | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
    const [showSaved, setShowSaved] = useState(false);

    // Dialog States
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [newPlanName, setNewPlanName] = useState("");
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [deletePlanId, setDeletePlanId] = useState<number | null>(null); // If null, dialog closed

    // Effect to handle AI response and stop loading
    useEffect(() => {
        if (generatedPrompt) {
            try {
                const json = JSON.parse(generatedPrompt);
                if (json.shopping_list && typeof json.shopping_list[0] === 'string') {
                    json.shopping_list = json.shopping_list.map((s: string) => ({ item: s, price: "?" }));
                }
                setParsedData(json);
                setUpdating(false); // Stop loading indicator
            } catch (e) {
                console.error("Failed to parse JSON", e);
                setUpdating(false);
            }
        }
    }, [generatedPrompt]);

    const fetchSavedPlans = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/plans');
            const json = await res.json();
            setSavedPlans(json);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (showSaved) fetchSavedPlans();
    }, [showSaved]);

    const handleSavePlan = async () => {
        if (!newPlanName.trim() || !parsedData) return;
        setSaving(true);
        try {
            await fetch('http://127.0.0.1:8000/api/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newPlanName, content: JSON.stringify(parsedData) })
            });
            setIsSaveDialogOpen(false);
            setNewPlanName("");
            setShowSaveSuccess(true);
            setTimeout(() => setShowSaveSuccess(false), 3000); // Hide success after 3s
        } catch (e) { console.error("Error saving", e); }
        setSaving(false);
    }

    const handleDeletePlan = async () => {
        if (deletePlanId === null) return;
        try {
            await fetch(`http://127.0.0.1:8000/api/plans/${deletePlanId}`, { method: 'DELETE' });
            fetchSavedPlans();
            setDeletePlanId(null);
        } catch (e) { console.error("Error deleting", e); }
    }

    const loadPlan = (plan: SavedPlan) => {
        try {
            const content = JSON.parse(plan.content_json);
            setParsedData(content);
            setShowSaved(false);
        } catch (e) { console.error("Error loading plan", e); }
    }

    const handleUpdateAI = () => {
        if (!parsedData) return;
        setUpdating(true); // Start loading
        // We clear parsedData briefly or just keep showing it with a loader overlay?
        // Let's keep showing it but with a loader on the button or overlay
        // NOTE: generating prompt clears 'generatedPrompt' in parent usually, but we need to wait for it to come back.
        generatePrompt(JSON.stringify(parsedData));
    }

    const updateMeal = (index: number, type: 'lunch' | 'dinner', val: string) => {
        if (!parsedData) return;
        const newMeals = [...parsedData.meals];
        newMeals[index][type] = val;
        setParsedData({ ...parsedData, meals: newMeals });
    }

    // Helper to check if we should show a meal slot
    const shouldShowMeal = (mealContent: string | undefined, type: 'lunch' | 'dinner') => {
        // Strict check: if the user didn't request this meal type in the plan, hide it.
        // We use planMeals prop which contains ["lunch", "dinner"] etc.
        if (!planMeals.includes(type)) return false;

        // If editing, always show to allow input (if it's in the planMeals)
        if (isEditing) return true;

        // Strict check: if content is strictly empty or "N/A" or "None", hide it
        if (!mealContent || mealContent.trim() === "" || mealContent.toLowerCase() === "n/a" || mealContent.toLowerCase() === "none") return false;

        return true;
    }

    // --- TEXT LABELS ---
    const T = {
        fr: {
            back: "Retour",
            myPlans: "Mes Plans",
            coachTitle: "Coach Cuisine",
            coachSubtitle: (diet: string) => `Basé sur ton régime ${diet}`,
            budget: "Budget Courses",
            days: "Durée",
            daysUnit: "Jours",
            lunch: "Midi",
            dinner: "Soir",
            generate: "Générer",
            savedAccess: "Tes plans sauvegardés sont accessibles via l'icône historique.",
            edit: "Éditer",
            finish: "Fin",
            recalc: "Recalculer",
            save: "Sauvegarder",
            analysis: "Analyse",
            shopping: "Courses",
            powered: "Propulsé par Gemini 2.0",
            savedTitle: "Mes Plans Sauvegardés",
            load: "Charger",
            noPlans: "Aucun plan sauvegardé.",
            saveDialogTitle: "Sauvegarder ce plan",
            saveDialogDesc: "Donne un nom à ce planning pour le retrouver plus tard.",
            placeholderName: "Ex: Semaine Healthy #1",
            cancel: "Annuler",
            deleteTitle: "Supprimer le plan ?",
            deleteDesc: "Cette action est irréversible.",
            confirmDelete: "Supprimer",
            successSave: "Plan enregistré !",
            updateLoading: "Mise à jour...",
            generating: "Génération..."
        },
        es: {
            back: "Atrás",
            myPlans: "Historial",
            coachTitle: "Chef de Cocina",
            coachSubtitle: (diet: string) => `Basado en tu dieta ${diet}`,
            budget: "Presupuesto",
            days: "Duración",
            daysUnit: "Días",
            lunch: "Almuerzo",
            dinner: "Cena",
            generate: "Generar",
            savedAccess: "Accede a tus planes guardados con el icono de historial.",
            edit: "Editar",
            finish: "Listo",
            recalc: "Recalcular",
            save: "Guardar",
            analysis: "Análisis",
            shopping: "Lista de Compras",
            powered: "Potenciado por Gemini 2.0",
            savedTitle: "Mis Planes",
            load: "Cargar",
            noPlans: "No hay planes guardados.",
            saveDialogTitle: "Guardar este plan",
            saveDialogDesc: "Ponle un nombre para encontrarlo después.",
            placeholderName: "Ej: Semana Sana #1",
            cancel: "Cancelar",
            deleteTitle: "¿Borrar plan?",
            deleteDesc: "Esta acción no se puede deshacer.",
            confirmDelete: "Borrar",
            successSave: "¡Plan guardado!",
            updateLoading: "Actualizando...",
            generating: "Generando..."
        }
    };

    // Fallback to FR if language not supported (though type ensures it)
    const t = (language === 'es' ? T.es : T.fr);

    if (showSaved) {
        return (
            <div className="h-[calc(100vh-180px)]">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="ghost" onClick={() => setShowSaved(false)} className="text-zinc-400 hover:text-white hover:bg-white/10">
                        <ArrowLeft className="w-5 h-5 mr-2" /> {t.back}
                    </Button>
                    <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{t.savedTitle}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedPlans.map(plan => (
                        <div key={plan.id} className={`${cardGlassHeavy} p-5 group relative flex flex-col`}>
                            <div className="flex-1">
                                <h3 className={`font-bold text-lg mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>{plan.name}</h3>
                                <p className={`text-xs mb-4 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>{new Date(plan.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Button onClick={() => loadPlan(plan)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 h-9 text-xs font-bold">{t.load}</Button>
                                <Button onClick={() => setDeletePlanId(plan.id)} variant="destructive" className="h-9 w-9 p-0 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    ))}
                    {savedPlans.length === 0 && <p className="text-zinc-500 italic">{t.noPlans}</p>}
                </div>

                {/* DELETE CONFIRMATION DIALOG */}
                <Dialog open={deletePlanId !== null} onOpenChange={(open) => !open && setDeletePlanId(null)}>
                    <DialogContent className="bg-zinc-950 border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>{t.deleteTitle}</DialogTitle>
                            <DialogDescription>{t.deleteDesc}</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setDeletePlanId(null)}>{t.cancel}</Button>
                            <Button variant="destructive" onClick={handleDeletePlan}>{t.confirmDelete}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    if (!parsedData && !generatedPrompt) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[calc(100vh-180px)] items-center">
                <Card className={`border-0 ${cardGlass} flex flex-col justify-center p-12 h-full relative`}>
                    <Button variant="ghost" onClick={() => setShowSaved(true)} className="absolute top-6 right-6 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 p-0 md:w-auto md:px-4 md:h-10">
                        <History className="w-5 h-5 md:mr-2" /> <span className="hidden md:inline">{t.myPlans}</span>
                    </Button>

                    <div className="mb-8 text-center">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ChefHat className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">{t.coachTitle}</h3>
                        <p className={`text-lg ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{t.coachSubtitle(data.profile?.diet || 'Standard')}</p>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className={`font-bold uppercase tracking-widest text-xs ${isLight ? 'text-slate-400' : 'text-zinc-300'}`}>{t.budget}</span>
                                <span className={`font-mono text-2xl font-bold ${isLight ? 'text-emerald-600' : 'text-white'}`}>{groceryBudget[0]}€</span>
                            </div>
                            <Slider value={groceryBudget} onValueChange={setGroceryBudget} max={150} step={5} className="py-2" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className={`font-bold uppercase tracking-widest text-xs ${isLight ? 'text-slate-400' : 'text-zinc-300'}`}>{t.days}</span>
                                <span className={`font-mono text-xl font-bold ${isLight ? 'text-slate-700' : 'text-white'}`}>{planDays[0]} {t.daysUnit}</span>
                            </div>
                            <Slider value={planDays} onValueChange={setPlanDays} min={1} max={7} step={1} className="py-2" />
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={() => setPlanMeals(planMeals.includes('lunch') ? planMeals.filter(m => m !== 'lunch') : [...planMeals, 'lunch'])} variant="outline" className={`flex-1 h-12 text-sm border-white/10 ${planMeals.includes('lunch') ? 'bg-orange-500 text-white border-transparent' : 'bg-black/20 text-zinc-500'}`}>{t.lunch}</Button>
                            <Button onClick={() => setPlanMeals(planMeals.includes('dinner') ? planMeals.filter(m => m !== 'dinner') : [...planMeals, 'dinner'])} variant="outline" className={`flex-1 h-12 text-sm border-white/10 ${planMeals.includes('dinner') ? 'bg-indigo-500 text-white border-transparent' : 'bg-black/20 text-zinc-500'}`}>{t.dinner}</Button>
                        </div>

                        <Button onClick={() => { setUpdating(true); generatePrompt(); }} disabled={updating} className={`w-full h-16 text-xl bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl shadow-xl transition-all ${isLight ? 'border border-zinc-200' : ''}`}>
                            {updating ? <Loader2 className="w-6 h-6 animate-spin mr-2 text-emerald-600" /> : <Sparkles className="mr-2 w-5 h-5 text-emerald-600" />} {updating ? t.generating : t.generate}
                        </Button>
                    </div>
                </Card>
                <div className="hidden md:flex flex-col items-center justify-center p-10 text-center opacity-40">
                    <Bot className={`w-32 h-32 mb-6 animate-pulse ${isLight ? 'text-emerald-700' : 'text-white'}`} />
                    <p className={`text-lg font-light max-w-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{t.savedAccess}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            {/* LEFT COLUMN: MEALS */}
            <div className="lg:col-span-2 space-y-6">
                {/* TOOLBAR */}
                <div className={`flex justify-between items-center p-3 rounded-2xl border backdrop-blur-md sticky top-0 z-30 shadow-2xl ${isLight ? 'bg-white/80 border-emerald-900/10' : 'bg-zinc-950/80 border-white/10'}`}>
                    <Button variant="ghost" className="text-zinc-400 hover:text-emerald-500" onClick={() => { setParsedData(null); onBack(); }}>
                        <ArrowLeft className="w-5 h-5 mr-2" /> {t.back}
                    </Button>
                    <div className="flex gap-2 items-center">
                        {showSaveSuccess && <span className="text-emerald-400 text-xs font-bold mr-2 animate-in fade-in slide-in-from-right-2 flex gap-1 items-center"><Check className="w-3 h-3" /> {t.successSave}</span>}

                        <Button variant="outline" size="sm" className={`border-white/10 ${isEditing ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : (isLight ? 'bg-slate-100 text-slate-500' : 'bg-zinc-900 text-zinc-400')}`} onClick={() => setIsEditing(!isEditing)}><PenSquare className="w-4 h-4 mr-2" /> {isEditing ? t.finish : t.edit}</Button>

                        {isEditing && (
                            <Button size="sm" onClick={handleUpdateAI} disabled={updating} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50">
                                {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />} {t.recalc}
                            </Button>
                        )}

                        <Button size="sm" onClick={() => setIsSaveDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-500">
                            <Save className="w-4 h-4 mr-2" /> {t.save}
                        </Button>
                    </div>
                </div>

                {/* SAVE DIALOG */}
                <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                    <DialogContent className="bg-zinc-950 border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>{t.saveDialogTitle}</DialogTitle>
                            <DialogDescription>{t.saveDialogDesc}</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Input
                                value={newPlanName}
                                onChange={(e) => setNewPlanName(e.target.value)}
                                placeholder={t.placeholderName}
                                className="bg-zinc-900 border-white/10 text-white"
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsSaveDialogOpen(false)}>{t.cancel}</Button>
                            <Button onClick={handleSavePlan} disabled={saving || !newPlanName.trim()} className="bg-emerald-600 hover:bg-emerald-500">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t.save}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {parsedData && (
                    <>
                        {/* ANALYSIS CARD */}
                        <div className={`${isLight ? 'bg-emerald-100 border-emerald-200' : 'bg-emerald-900/20 border-emerald-500/20'} border p-5 rounded-3xl backdrop-blur-md relative overflow-hidden`}>
                            {updating && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>}
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-emerald-500/20 rounded-full shrink-0"><Lightbulb className="w-5 h-5 text-emerald-400" /></div>
                                <p className={`text-sm leading-relaxed mt-1 ${isLight ? 'text-emerald-800' : 'text-emerald-100'}`}>{parsedData.analysis}</p>
                            </div>
                        </div>

                        {/* MEALS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                            {updating && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl"><span className="text-white font-bold animate-pulse">{t.updateLoading}</span></div>}
                            {parsedData.meals.map((day, idx) => (
                                <div key={idx} className={cardGlassHeavy}>
                                    <div className={`flex items-center gap-3 mb-4 border-b pb-3 ${isLight ? 'border-emerald-900/10' : 'border-white/5'}`}>
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-white/10 text-zinc-300'}`}>{idx + 1}</span>
                                        <span className={`font-bold text-lg ${isLight ? 'text-slate-800' : 'text-white'}`}>{day.day}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {shouldShowMeal(day.lunch, 'lunch') && (
                                            <div className={`${isLight ? 'bg-orange-50/50 border-orange-100' : 'bg-white/5 border-white/5'} p-3 rounded-xl border`}>
                                                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block mb-2">{t.lunch}</span>
                                                {isEditing ? (
                                                    <Input
                                                        className={`h-8 text-sm focus-visible:ring-emerald-500 ${isLight ? 'bg-white border-orange-200 text-slate-800' : 'bg-black/50 border-white/10 text-white'}`}
                                                        value={day.lunch}
                                                        onChange={e => updateMeal(idx, 'lunch', e.target.value)}
                                                    />
                                                ) : (
                                                    <p className={`font-medium text-sm ${isLight ? 'text-slate-700' : 'text-zinc-200'}`}>{day.lunch}</p>
                                                )}
                                            </div>
                                        )}
                                        {shouldShowMeal(day.dinner, 'dinner') && (
                                            <div className={`${isLight ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white/5 border-white/5'} p-3 rounded-xl border`}>
                                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-2">{t.dinner}</span>
                                                {isEditing ? (
                                                    <Input
                                                        className={`h-8 text-sm focus-visible:ring-emerald-500 ${isLight ? 'bg-white border-indigo-200 text-slate-800' : 'bg-black/50 border-white/10 text-white'}`}
                                                        value={day.dinner}
                                                        onChange={e => updateMeal(idx, 'dinner', e.target.value)}
                                                    />
                                                ) : (
                                                    <p className={`font-medium text-sm ${isLight ? 'text-slate-700' : 'text-zinc-200'}`}>{day.dinner}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* RIGHT COLUMN: SHOPPING */}
            <div className="lg:col-span-1">
                <div className={`sticky top-24 ${cardGlass} p-0 flex flex-col max-h-[calc(100vh-100px)] relative`}>
                    {updating && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 rounded-3xl" />}

                    <div className={`p-5 border-b flex justify-between items-center ${isLight ? 'bg-emerald-50/50 border-emerald-900/10' : 'bg-zinc-950/30 border-white/5'}`}>
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="w-5 h-5 text-emerald-400" />
                            <h3 className={`font-black text-lg uppercase ${isLight ? 'text-slate-700' : 'text-white'}`}>{t.shopping}</h3>
                        </div>
                        {parsedData?.total_estimated_cost && <span className="text-emerald-400 font-bold font-mono bg-emerald-900/30 px-2 py-1 rounded text-sm">{parsedData.total_estimated_cost}</span>}
                    </div>
                    <ScrollArea className="flex-1 px-4 py-2">
                        <div className="space-y-1">
                            {parsedData?.shopping_list.map((item, i) => (
                                <div key={i} className={`flex items-center justify-between p-3 rounded-lg transition-colors group border-b last:border-0 ${isLight ? 'hover:bg-black/5 border-black/5' : 'hover:bg-white/5 border-white/5'}`}>
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-emerald-500 transition-colors shrink-0" />
                                        <span className={`text-sm truncate ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>{item.item}</span>
                                    </div>
                                    <span className="text-xs text-zinc-500 font-mono shrink-0 ml-2">{item.price}</span>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className={`p-4 border-t ${isLight ? 'bg-slate-50 border-emerald-900/5' : 'bg-zinc-950/50 border-white/5'}`}>
                        <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest">{t.powered}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
