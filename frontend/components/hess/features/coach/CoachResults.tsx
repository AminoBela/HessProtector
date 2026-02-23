import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Lightbulb,
  Loader2,
  ArrowLeft,
  Check,
  PenSquare,
  RefreshCw,
  Save,
  ShoppingCart,
  ChefHat,
  Receipt,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import { Translations } from "@/lib/i18n";
import { motion } from "framer-motion";
import { container, item } from "@/lib/animations";
import { RecipeModal } from "./RecipeModal";
import { ApiService } from "@/services/apiClient";

interface CoachResponse {
  analysis: string;
  meals: { day: string; lunch: string; dinner: string }[];
  shopping_list: { item: string; price: string }[];
  total_estimated_cost?: string;
  tips: string[];
}

export interface Recipe {
  title: string;
  time: string;
  difficulty: string;
  calories: string;
  ingredients: { item: string; qty: string; substitution?: string }[];
  steps: string[];
  chef_tip?: string;
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
  token?: string;
}

export function CoachResults({
  parsedData,
  setParsedData,
  onBack,
  onUpdateAI,
  onSavePlan,
  updating,
  saving,
  language,
  theme,
  isEditing,
  setIsEditing,
  planMeals,
  token,
}: CoachResultsProps) {
  const isLight = theme === "light";

  const glassCard = isLight
    ? "bg-white/80 backdrop-blur-xl border-emerald-900/5 shadow-xl"
    : "bg-black/40 backdrop-blur-xl border-white/10 shadow-xl";

  const receiptBg = isLight
    ? "bg-white shadow-[0_0_15px_rgba(0,0,0,0.05)] border-zinc-100"
    : "bg-zinc-900 shadow-[0_0_15px_rgba(0,0,0,0.3)] border-white/5";

  const t =
    Translations[language as keyof typeof Translations]?.coach ||
    Translations.fr.coach;
  const common =
    Translations[language as keyof typeof Translations]?.common ||
    Translations.fr.common;

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const toggleCheck = (index: number) => {
    setCheckedItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleSaveConfirm = async () => {
    await onSavePlan(newPlanName);
    setIsSaveDialogOpen(false);
    setNewPlanName("");
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const updateMeal = (
    index: number,
    type: "lunch" | "dinner",
    value: string,
  ) => {
    if (!parsedData) return;
    const newMeals = [...parsedData.meals];
    newMeals[index] = { ...newMeals[index], [type]: value };
    setParsedData({ ...parsedData, meals: newMeals });
  };

  const shouldShowMeal = (meal: string, type: string) => {
    if (isEditing) return planMeals.includes(type);
    return meal && meal.trim().length > 0;
  };

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [recipeCache, setRecipeCache] = useState<Record<string, Recipe>>({});

  const handleRecipeClick = async (dish: string) => {
    if (!dish || isEditing) return;

    setIsRecipeOpen(true);

    if (recipeCache[dish]) {
      setRecipe(recipeCache[dish]);
      return;
    }

    setRecipe(null);
    setRecipeLoading(true);

    try {
      const data = await ApiService.post(
        "/smart-prompt",
        {
          type: "recipe",
          budget: 0,
          days: 1,
          meals: [dish],
          language: language,
        },
        token || "",
      );
      if (data.prompt) {
        setRecipe(data.prompt);
        setRecipeCache((prev) => ({ ...prev, [dish]: data.prompt }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRecipeLoading(false);
    }
  };

  return (
    <motion.div
      key={language}
      variants={container}
      initial="hidden"
      animate="show"
      className="pb-20 space-y-8"
    >
      <RecipeModal
        isOpen={isRecipeOpen}
        onClose={() => setIsRecipeOpen(false)}
        recipe={recipe}
        loading={recipeLoading}
        language={language}
        theme={theme}
      />

      { }
      <motion.div variants={item} className="flex justify-between items-center bg-transparent">
        <Button
          variant="ghost"
          className="text-zinc-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-full px-6"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> {common.back}
        </Button>

        <div className="flex gap-2 items-center bg-transparent">
          {showSaveSuccess && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-emerald-500 text-xs font-bold mr-2 flex gap-1 items-center"
            >
              <Check className="w-3 h-3" /> {t.successSave}
            </motion.span>
          )}

          <Button
            variant="outline"
            size="sm"
            className={`border-white/10 rounded-full px-4 ${isEditing ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : isLight ? "bg-white/50 text-slate-600" : "bg-white/5 text-zinc-400"}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            <PenSquare className="w-4 h-4 mr-2" />
            {isEditing ? common.finish : common.edit}
          </Button>

          {isEditing && (
            <Button
              size="sm"
              onClick={onUpdateAI}
              disabled={updating}
              className="bg-purple-600 hover:bg-purple-500 rounded-full px-4 shadow-lg shadow-purple-500/20"
            >
              {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              {t.recalc}
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => setIsSaveDialogOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 rounded-full px-4 shadow-lg shadow-emerald-500/20"
          >
            <Save className="w-4 h-4 mr-2" /> {common.save}
          </Button>
        </div>
      </motion.div>

      { }
      <motion.div variants={item} className={`p-8 rounded-[2rem] relative overflow-hidden ${glassCard} border md:border-0`}>
        {updating && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 transition-all duration-300">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        )}

        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Lightbulb className={`w-32 h-32 ${isLight ? "text-emerald-900" : "text-white"}`} />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Lightbulb className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Analysis & Strategy</span>
          </div>
          <p className={`text-lg md:text-xl font-medium leading-relaxed ${isLight ? "text-slate-700" : "text-zinc-200"}`}>
            "{parsedData.analysis}"
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        { }
        <div className="lg:col-span-2 space-y-6">
          <h3 className={`text-xl font-black uppercase tracking-tight flex items-center gap-3 ${isLight ? "text-slate-800" : "text-white"}`}>
            <UtensilsCrossed className="w-5 h-5 text-emerald-500" />
            {t.mealsTitle || "Meal Plan"}
          </h3>

          <div className="space-y-4 relative">
            {updating && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-3xl" />
            )}
            {parsedData.meals.map((day, idx) => (
              <motion.div
                variants={item}
                key={idx}
                className={`group relative overflow-hidden rounded-3xl border transition-[box-shadow,background-color,border-color] duration-300 hover:shadow-2xl ${isLight ? "bg-white border-emerald-900/5 shadow-lg" : "bg-zinc-900/50 border-white/10 shadow-lg backdrop-blur-md"}`}
              >
                <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black shadow-lg ring-1 ring-inset ${isLight ? "bg-emerald-100 text-emerald-600 ring-emerald-200" : "bg-white/10 text-white ring-white/10"}`}>
                      {idx + 1}
                    </span>
                  </div>

                  <div className="flex-1 w-full space-y-4">
                    <h4 className={`text-2xl font-black tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                      {day.day}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      { }
                      {shouldShowMeal(day.lunch, "lunch") && (
                        <div
                          onClick={() => handleRecipeClick(day.lunch)}
                          className={`relative p-4 rounded-2xl border transition-[box-shadow,background-color,border-color] duration-300 cursor-pointer group/meal ${isLight ? "bg-slate-50 border-slate-200 hover:border-orange-300 hover:bg-orange-50/50" : "bg-black/20 border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5"}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest">{t.lunch}</span>
                            {!isEditing && <ChefHat className="w-3.5 h-3.5 text-orange-400 opacity-0 group-hover/meal:opacity-100 transition-all transform group-hover/meal:translate-x-0 translate-x-2" />}
                          </div>

                          {isEditing ? (
                            <div onClick={e => e.stopPropagation()}>
                              <Input
                                value={day.lunch}
                                onChange={e => updateMeal(idx, "lunch", e.target.value)}
                                className="h-9 text-sm bg-transparent border-0 p-0 focus-visible:ring-0 font-bold"
                              />
                            </div>
                          ) : (
                            <p className={`font-bold leading-tight ${isLight ? "text-slate-700" : "text-zinc-200"}`}>{day.lunch}</p>
                          )}
                        </div>
                      )}

                      { }
                      {shouldShowMeal(day.dinner, "dinner") && (
                        <div
                          onClick={() => handleRecipeClick(day.dinner)}
                          className={`relative p-4 rounded-2xl border transition-[box-shadow,background-color,border-color] duration-300 cursor-pointer group/meal ${isLight ? "bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50" : "bg-black/20 border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5"}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">{t.dinner}</span>
                            {!isEditing && <ChefHat className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover/meal:opacity-100 transition-all transform group-hover/meal:translate-x-0 translate-x-2" />}
                          </div>

                          {isEditing ? (
                            <div onClick={e => e.stopPropagation()}>
                              <Input
                                value={day.dinner}
                                onChange={e => updateMeal(idx, "dinner", e.target.value)}
                                className="h-9 text-sm bg-transparent border-0 p-0 focus-visible:ring-0 font-bold"
                              />
                            </div>
                          ) : (
                            <p className={`font-bold leading-tight ${isLight ? "text-slate-700" : "text-zinc-200"}`}>{day.dinner}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        { }
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <motion.div variants={item} className={`rounded-[2rem] overflow-hidden border ${isLight ? "bg-white/80 border-emerald-900/10 shadow-xl" : "bg-black/40 border-white/10 shadow-xl"}`}>
            { }
            <div className={`p-6 border-b relative overflow-hidden ${isLight ? "bg-emerald-50/50 border-emerald-900/10" : "bg-zinc-950/50 border-white/10"}`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600" />
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
              <div className="flex items-center gap-4 relative z-10">
                <div className={`p-3 rounded-xl ${isLight ? "bg-emerald-100 text-emerald-600" : "bg-emerald-500/20 text-emerald-400"}`}>
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-black text-xl tracking-tight ${isLight ? "text-slate-800" : "text-white"}`}>{t.shopping}</h3>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-zinc-500"}`}>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            { }
            <ScrollArea className="h-[calc(100vh-350px)] max-h-[600px] relative">
              <div className="p-6 space-y-3">
                {parsedData.shopping_list.map((item, i) => {
                  const isChecked = checkedItems.includes(i);
                  return (
                    <div
                      key={i}
                      onClick={() => toggleCheck(i)}
                      className={`flex justify-between items-center gap-4 group p-3 rounded-2xl transition-[background-color,transform] cursor-pointer hover:scale-[1.02] ${isLight ? "hover:bg-slate-50" : "hover:bg-white/5"}`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${isChecked ? 'bg-emerald-500 border-emerald-500 scale-110' : isLight ? 'border-slate-300 group-hover:border-emerald-400' : 'border-zinc-700 group-hover:border-emerald-500'}`}>
                          <Check className={`w-3.5 h-3.5 text-white transition-opacity duration-300 ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                        <p className={`text-sm font-bold leading-tight transition-all duration-300 ${isChecked ? 'line-through text-zinc-500/50' : isLight ? "text-slate-700 group-hover:text-emerald-600" : "text-zinc-200 group-hover:text-emerald-400"}`}>
                          {item.item}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className={`text-sm font-black tracking-tight transition-colors duration-300 ${isChecked ? 'text-zinc-500/50' : isLight ? 'text-slate-900' : 'text-white'}`}>{item.price}</p>
                      </div>
                    </div>
                  )
                })}

                <div className={`border-t-2 border-dashed my-6 ${isLight ? "border-slate-200" : "border-white/10"}`} />

                <div className={`flex justify-between items-center p-4 rounded-2xl ${isLight ? "bg-slate-50" : "bg-black/20"}`}>
                  <div className="flex items-center gap-2">
                    <Receipt className={`w-5 h-5 ${isLight ? "text-slate-400" : "text-zinc-500"}`} />
                    <span className={`font-black tracking-tight ${isLight ? "text-slate-800" : "text-white"}`}>TOTAL</span>
                  </div>
                  <span className="text-xl font-black text-emerald-500">{parsedData.total_estimated_cost || "?"}</span>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </div >
      </div >

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent
          className={
            isLight
              ? "bg-white/95 backdrop-blur-xl border-emerald-900/10 text-slate-800"
              : "bg-zinc-950 border-white/10 text-white"
          }
        >
          <DialogHeader>
            <DialogTitle>{t.saveDialogTitle}</DialogTitle>
            <DialogDescription>{t.saveDialogDesc}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
              placeholder={t.placeholderName}
              className={
                isLight
                  ? "bg-white border-emerald-900/10 text-slate-800"
                  : "bg-zinc-900 border-white/10 text-white"
              }
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsSaveDialogOpen(false)}
            >
              {common.cancel}
            </Button>
            <Button
              onClick={handleSaveConfirm}
              disabled={saving || !newPlanName.trim()}
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                common.save
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div >
  );
}
