import { Button } from "@/components/ui/button";
import { PremiumSlider } from "@/components/ui/premium-slider";
import { Card } from "@/components/ui/card";
import {
  Wallet,
  Calendar,
  Utensils,
  Sparkles,
  History,
  ChefHat,
  Info,
} from "lucide-react";
import { Translations } from "@/lib/i18n";
import { motion } from "framer-motion";
import { container, item } from "@/lib/animations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CoachGeneratorProps {
  groceryBudget: number[];
  setGroceryBudget: (val: number[]) => void;
  planDays: number[];
  setPlanDays: (val: number[]) => void;
  planMeals: string[];
  setPlanMeals: (val: string[]) => void;
  onGenerate: () => void;
  onShowSaved: () => void;
  updating: boolean;
  language: string;
  theme: string;
  diet: string;
}

export function CoachGenerator({
  groceryBudget,
  setGroceryBudget,
  planDays,
  setPlanDays,
  planMeals,
  setPlanMeals,
  onGenerate,
  onShowSaved,
  updating,
  language,
  theme,
  diet,
}: CoachGeneratorProps) {
  const isLight = theme === "light";

  // Enhanced glassmorphism for container
  const panelStyle = isLight
    ? "bg-white/80 backdrop-blur-2xl border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] ring-1 ring-white/50"
    : "bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/5";

  // Enhanced visual style for input groups
  const inputGroupStyle = isLight
    ? "bg-gradient-to-br from-white/90 to-white/50 border-white/60 shadow-sm"
    : "bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 border-white/5 shadow-inner shadow-black/20";

  const t =
    Translations[language as keyof typeof Translations]?.coach ||
    Translations.fr.coach;
  const common =
    Translations[language as keyof typeof Translations]?.common ||
    Translations.fr.common;

  const toggleMeal = (meal: string) => {
    if (planMeals.includes(meal)) {
      setPlanMeals(planMeals.filter((m) => m !== meal));
    } else {
      setPlanMeals([...planMeals, meal]);
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-2xl mx-auto px-4 relative z-10"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-500/5 via-indigo-500/5 to-purple-500/5 blur-3xl rounded-full -z-10" />

      {/* Header Section */}
      <motion.div className="text-center mb-8 space-y-3">
        <div className={`inline-flex items-center justify-center p-4 rounded-3xl mb-2 shadow-lg backdrop-blur-sm ${isLight ? "bg-gradient-to-tr from-emerald-100 to-teal-50 text-emerald-600 border border-emerald-100" : "bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/20"}`}>
          <ChefHat className="w-10 h-10 drop-shadow-sm" />
        </div>
        <h1 className={`text-5xl font-extrabold tracking-tight ${isLight ? "text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-600" : "text-white"}`}>
          {t.title}
        </h1>
        <p className={`text-base font-medium flex items-center justify-center gap-2 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
          <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${isLight ? "bg-zinc-100 text-zinc-600" : "bg-white/10 text-zinc-300"}`}>
            IA v2.5
          </span>
          {t.subtitle(diet)}
        </p>
      </motion.div>

      {/* Main Control Panel */}
      <motion.div className={`w-full rounded-[2.5rem] p-8 md:p-10 border transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] ${panelStyle}`}>
        <div className="space-y-10">

          {/* Budget Control */}
          <div className="space-y-5">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Wallet className={`w-5 h-5 ${isLight ? "text-emerald-500" : "text-emerald-400"}`} />
                  <span className={`text-sm font-bold uppercase tracking-wider ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>{t.budget}</span>
                </div>
                <p className={`text-xs ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>Budget total pour les courses</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-black tracking-tighter ${isLight ? "text-emerald-600" : "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]"}`}>
                  {groceryBudget[0]}
                </span>
                <span className={`text-lg font-bold ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>€</span>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border ${inputGroupStyle}`}>
              <PremiumSlider
                value={groceryBudget}
                onValueChange={setGroceryBudget}
                max={150}
                step={5}
                variant="emerald"
                className="py-2"
              />
              <div className="flex justify-between mt-3 px-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400">0€</span>
                <span className="text-[10px] uppercase font-bold text-zinc-400">150€ (Rich)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Days Control */}
            <div className="space-y-4 flex flex-col">
              <div className="flex justify-between items-end px-1 h-12">
                <div className="flex items-center gap-2">
                  <Calendar className={`w-5 h-5 ${isLight ? "text-indigo-500" : "text-indigo-400"}`} />
                  <span className={`text-sm font-bold uppercase tracking-wider ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>{t.days}</span>
                </div>
                <span className={`text-2xl font-black ${isLight ? "text-indigo-600" : "text-indigo-400"}`}>
                  {planDays[0]} <span className="text-sm font-bold text-zinc-400">{common.days}</span>
                </span>
              </div>
              <div className={`px-5 rounded-3xl border flex items-center h-[88px] ${inputGroupStyle}`}>
                <PremiumSlider
                  value={planDays}
                  onValueChange={setPlanDays}
                  min={1}
                  max={7}
                  step={1}
                  variant="indigo"
                />
              </div>
            </div>

            {/* Meal Type Toggle */}
            <div className="space-y-4 flex flex-col">
              <div className="flex justify-between items-end px-1 h-12">
                <div className="flex items-center gap-2">
                  <Utensils className={`w-5 h-5 ${isLight ? "text-orange-500" : "text-orange-400"}`} />
                  <span className={`text-sm font-bold uppercase tracking-wider ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>Repas</span>
                </div>
              </div>

              <div className={`p-1.5 rounded-3xl border flex h-[88px] ${inputGroupStyle}`}>
                <button
                  onClick={() => toggleMeal("lunch")}
                  className={`flex-1 flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all duration-300 ${planMeals.includes("lunch")
                    ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg shadow-orange-500/25 scale-[1.02]"
                    : "text-zinc-400 hover:text-zinc-600 hover:bg-black/5"
                    }`}
                >
                  <span className="text-[10px] opacity-80 font-medium uppercase tracking-wider mb-0.5">Midi</span>
                  {t.lunch}
                </button>
                <div className="w-px bg-zinc-500/10 my-3 mx-1.5" />
                <button
                  onClick={() => toggleMeal("dinner")}
                  className={`flex-1 flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all duration-300 ${planMeals.includes("dinner")
                    ? "bg-gradient-to-br from-indigo-400 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]"
                    : "text-zinc-400 hover:text-zinc-600 hover:bg-black/5"
                    }`}
                >
                  <span className="text-[10px] opacity-80 font-medium uppercase tracking-wider mb-0.5">Soir</span>
                  {t.dinner}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex gap-4">
            <Button
              variant="outline"
              onClick={onShowSaved}
              className={`h-14 w-14 rounded-2xl border-2 p-0 shrink-0 transition-transform active:scale-95 ${isLight
                ? "border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 hover:bg-zinc-50"
                : "border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300 hover:bg-white/5"}`}
            >
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <History className="w-6 h-6" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-bold">
                    <p>{t.savedTitle}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Button>

            <Button
              onClick={onGenerate}
              disabled={updating}
              className={`flex-1 h-14 text-base font-bold uppercase tracking-wider rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${isLight
                ? "bg-gradient-to-r from-zinc-800 to-zinc-950 text-white hover:shadow-zinc-900/20"
                : "bg-gradient-to-r from-white to-zinc-200 text-black hover:shadow-white/10"
                }`}
            >
              {updating ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-3" />
                  {common.generating}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-3 animate-pulse" />
                  {t.generate}
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.p className="mt-8 text-xs font-medium text-zinc-400 text-center max-w-sm opacity-60 hover:opacity-100 transition-opacity">
        <Info className="w-3 h-3 inline mr-1.5 -mt-0.5" />
        L'IA s'adapte à ton profil et crée une liste de courses optimisée pour ton budget.
      </motion.p>
    </motion.div>
  );
}
