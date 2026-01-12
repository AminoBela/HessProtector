import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Lightbulb, Loader2, ArrowLeft, Check, PenSquare, RefreshCw, Save, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { Translations } from "@/lib/i18n";

interface CoachResponse {
    analysis: string;
    meals: { day: string; lunch: string; dinner: string }[];
    shopping_list: { item: string; price: string }[];
    total_estimated_cost?: string;
    tips: string[];
}

interface CoachResultsProps {
    parsedData: CoachResponse;
    setParsedData: (data: CoachResponse | null) => void;
    generatedPrompt?: string;
    onBack: () => void;
    onUpdateAI: () => void;
    onSavePlan: (name: string) => Promise<void>;
    updating: boolean;
    saving: boolean;
    language: string;
    theme: string;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    planMeals: string[];
}

export function CoachResults({
    parsedData, setParsedData,
    onBack, onUpdateAI, onSavePlan,
    updating, saving, language, theme,
    isEditing, setIsEditing, planMeals
}: CoachResultsProps) {
    const isLight = theme === 'light';
    const cardGlass = isLight
        ? "bg-white/70 backdrop-blur-xl border-emerald-900/5 shadow-xl text-slate-800 rounded-3xl overflow-hidden hover:bg-white/80 transition-colors duration-500"
        : "bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-2xl text-white rounded-3xl overflow-hidden hover:bg-zinc-900/50 transition-colors duration-500";
    const cardGlassHeavy = isLight
        ? "bg-white/90 backdrop-blur-xl border-emerald-900/10 shadow-xl text-slate-800 rounded-3xl p-6"
        : "bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl text-white rounded-3xl p-6";

    const t = Translations[language as keyof typeof Translations]?.coach || Translations.fr.coach;
    const common = Translations[language as keyof typeof Translations]?.common || Translations.fr.common;

    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [newPlanName, setNewPlanName] = useState("");
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);

    const handleSaveConfirm = async () => {
        await onSavePlan(newPlanName);
        setIsSaveDialogOpen(false);
        setNewPlanName("");
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
    }


    if (!parsedData) return null;

    const updateMeal = (index: number, type: 'lunch' | 'dinner', val: string) => {
        const newMeals = [...parsedData.meals];
        newMeals[index][type] = val;
        setParsedData({ ...parsedData, meals: newMeals });
    }

    const shouldShowMeal = (mealContent: string | undefined, type: 'lunch' | 'dinner') => {
        if (!planMeals.includes(type)) return false;
        if (isEditing) return true;
        if (!mealContent || mealContent.trim() === "" || mealContent.toLowerCase() === "n/a" || mealContent.toLowerCase() === "none") return false;
        return true;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

            <div className="lg:col-span-2 space-y-6">

                <div className={`flex justify-between items-center p-3 rounded-2xl border backdrop-blur-md sticky top-0 z-30 shadow-2xl ${isLight ? 'bg-white/80 border-emerald-900/10' : 'bg-zinc-950/80 border-white/10'}`}>
                    <Button variant="ghost" className="text-zinc-400 hover:text-emerald-500" onClick={onBack}>
                        <ArrowLeft className="w-5 h-5 mr-2" /> {common.back}
                    </Button>
                    <div className="flex gap-2 items-center">
                        {showSaveSuccess && <span className="text-emerald-400 text-xs font-bold mr-2 animate-in fade-in slide-in-from-right-2 flex gap-1 items-center"><Check className="w-3 h-3" /> {t.successSave}</span>}

                        <Button variant="outline" size="sm" className={`border-white/10 ${isEditing ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : (isLight ? 'bg-slate-100 text-slate-500' : 'bg-zinc-900 text-zinc-400')}`} onClick={() => setIsEditing(!isEditing)}><PenSquare className="w-4 h-4 mr-2" /> {isEditing ? common.finish : common.edit}</Button>

                        {isEditing && (
                            <Button size="sm" onClick={onUpdateAI} disabled={updating} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50">
                                {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />} {t.recalc}
                            </Button>
                        )}

                        <Button size="sm" onClick={() => setIsSaveDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-500">
                            <Save className="w-4 h-4 mr-2" /> {common.save}
                        </Button>
                    </div>
                </div>


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
                            <Button variant="ghost" onClick={() => setIsSaveDialogOpen(false)}>{common.cancel}</Button>
                            <Button onClick={handleSaveConfirm} disabled={saving || !newPlanName.trim()} className="bg-emerald-600 hover:bg-emerald-500">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : common.save}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>


                <div className={`${isLight ? 'bg-emerald-100 border-emerald-200' : 'bg-emerald-900/20 border-emerald-500/20'} border p-5 rounded-3xl backdrop-blur-md relative overflow-hidden`}>
                    {updating && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>}
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-emerald-500/20 rounded-full shrink-0"><Lightbulb className="w-5 h-5 text-emerald-400" /></div>
                        <p className={`text-sm leading-relaxed mt-1 ${isLight ? 'text-emerald-800' : 'text-emerald-100'}`}>{parsedData.analysis}</p>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    {updating && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl"><span className="text-white font-bold animate-pulse">{common.update}</span></div>}
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
            </div>


            <div className="lg:col-span-1">
                <div className={`sticky top-24 ${cardGlass} p-0 flex flex-col max-h-[calc(100vh-100px)] relative`}>
                    {updating && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 rounded-3xl" />}

                    <div className={`p-5 border-b flex justify-between items-center ${isLight ? 'bg-emerald-50/50 border-emerald-900/10' : 'bg-zinc-950/30 border-white/5'}`}>
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="w-5 h-5 text-emerald-400" />
                            <h3 className={`font-black text-lg uppercase ${isLight ? 'text-slate-700' : 'text-white'}`}>{t.shopping}</h3>
                        </div>
                        {parsedData.total_estimated_cost && <span className="text-emerald-400 font-bold font-mono bg-emerald-900/30 px-2 py-1 rounded text-sm">{parsedData.total_estimated_cost}</span>}
                    </div>
                    <ScrollArea className="flex-1 px-4 py-2">
                        <div className="space-y-1">
                            {parsedData.shopping_list.map((item, i) => (
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
