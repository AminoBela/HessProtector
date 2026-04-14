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
  Cpu,
  Leaf
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
      className="w-full max-w-6xl mx-auto px-4 md:px-8 py-4 relative z-10"
    >
      {/* Dynamic Background */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-zinc-900/0 to-transparent blur-3xl rounded-full -z-10 pointer-events-none" />

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-8">

        {/* Bento 1: Budget (Massive Card) */}
        <motion.div variants={item} className={`md:col-span-6 lg:col-span-3 rounded-[3rem] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between border hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 group ${panelStyle}`}>
          {/* Decorative Icon */}
          <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-[0.05] group-hover:-rotate-6 transition-all duration-700 pointer-events-none">
            <Wallet className="w-64 h-64" />
          </div>

          <div className="space-y-2 mb-16 relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${isLight ? "bg-emerald-100 text-emerald-600" : "bg-emerald-500/20 text-emerald-400"}`}>
              <Wallet className="w-6 h-6" />
            </div>
            <h2 className={`text-xl font-black uppercase tracking-widest ${isLight ? "text-slate-800" : "text-white"}`}>
              {t.budget}
            </h2>
            <p className={`text-sm font-medium ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              {language === 'es' ? "Define el límite de gasto total." : "Définis la limite de dépense totale."}
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex items-baseline gap-2 mb-6">
              <span className={`text-6xl md:text-8xl font-black tracking-tighter ${isLight ? "text-emerald-600" : "text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]"}`}>
                {groceryBudget[0]}
              </span>
              <span className={`text-2xl md:text-3xl font-bold ${isLight ? "text-slate-400" : "text-zinc-500"}`}>€</span>
            </div>
            <div className={`p-4 md:p-6 rounded-[2rem] border ${inputGroupStyle}`}>
              <PremiumSlider value={groceryBudget} onValueChange={setGroceryBudget} max={150} step={5} variant="emerald" />
            </div>
          </div>
        </motion.div>

        {/* Column for Days & Meals */}
        <div className="md:col-span-6 lg:col-span-3 flex flex-col gap-6 md:gap-8">
          
          {/* Bento 2: Days */}
          <motion.div variants={item} className={`flex-1 rounded-[3rem] p-8 md:p-10 relative overflow-hidden border hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group ${panelStyle}`}>
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.05] group-hover:rotate-6 transition-all duration-700 pointer-events-none">
              <Calendar className="w-48 h-48" />
            </div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${isLight ? "bg-indigo-100 text-indigo-600" : "bg-indigo-500/20 text-indigo-400"}`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <h2 className={`text-xl font-black uppercase tracking-widest ${isLight ? "text-slate-800" : "text-white"}`}>
                  {t.days}
                </h2>
              </div>
              <div className="text-right">
                <span className={`text-5xl font-black tracking-tighter ${isLight ? "text-indigo-600" : "text-indigo-400"}`}>
                  {planDays[0]}
                </span>
                <span className={`text-lg font-bold block -mt-1 ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                  {common.days.toLowerCase()}
                </span>
              </div>
            </div>

            <div className={`px-6 rounded-[2rem] border flex items-center h-[80px] ${inputGroupStyle} relative z-10`}>
              <PremiumSlider value={planDays} onValueChange={setPlanDays} min={1} max={7} step={1} variant="indigo" />
            </div>
          </motion.div>

          {/* Bento 3: Meals */}
          <motion.div variants={item} className={`flex-1 rounded-[3rem] p-8 md:p-10 relative overflow-hidden border hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 group ${panelStyle}`}>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] group-hover:-rotate-12 transition-all duration-700 pointer-events-none">
              <Utensils className="w-48 h-48" />
            </div>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${isLight ? "bg-orange-100 text-orange-600" : "bg-orange-500/20 text-orange-400"}`}>
                <Utensils className="w-6 h-6" />
              </div>
              <h2 className={`text-xl font-black uppercase tracking-widest ${isLight ? "text-slate-800" : "text-white"}`}>
                Repas
              </h2>
            </div>

            <div className={`p-2 rounded-[2rem] border flex gap-2 items-center h-[90px] ${inputGroupStyle} relative z-10`}>
              <button
                onClick={() => toggleMeal("lunch")}
                className={`flex-1 h-full flex flex-col items-center justify-center rounded-3xl text-sm font-bold transition-all duration-300 ${planMeals.includes("lunch")
                  ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-xl shadow-orange-500/30 scale-[1.02]"
                  : "text-zinc-400 hover:text-zinc-600 hover:bg-black/5"
                }`}
              >
                <span className="text-[10px] opacity-80 font-black uppercase tracking-widest mb-1">{language === 'es' ? 'Almuerzo' : 'Midi'}</span>
                {t.lunch}
              </button>
              <div className="w-px h-12 bg-zinc-500/10" />
              <button
                onClick={() => toggleMeal("dinner")}
                className={`flex-1 h-full flex flex-col items-center justify-center rounded-3xl text-sm font-bold transition-all duration-300 ${planMeals.includes("dinner")
                  ? "bg-gradient-to-br from-indigo-400 to-purple-600 text-white shadow-xl shadow-indigo-500/30 scale-[1.02]"
                  : "text-zinc-400 hover:text-zinc-600 hover:bg-black/5"
                }`}
              >
                <span className="text-[10px] opacity-80 font-black uppercase tracking-widest mb-1">{language === 'es' ? 'Cena' : 'Soir'}</span>
                {t.dinner}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bento Bottom Row: Info & Actions */}
        <motion.div variants={item} className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 mt-2">
          
          {/* Bento 4: Diet Info */}
          <div className={`sm:col-span-1 lg:col-span-4 rounded-[2.5rem] p-6 relative overflow-hidden flex items-center justify-between border hover:shadow-xl transition-all duration-300 ${panelStyle}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg relative z-10 ${isLight ? "bg-emerald-100 text-emerald-600" : "bg-emerald-500/20 text-emerald-400"}`}>
               <Leaf className="w-6 h-6" />
            </div>
            <div className="text-right relative z-10">
                <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                    {language === 'es' ? 'Dieta' : 'Régime'}
                </span>
                <p className={`text-base md:text-lg font-black leading-none ${isLight ? "text-slate-800" : "text-white"}`}>
                    {diet || 'Standard'}
                </p>
            </div>
            <div className="absolute -left-4 -bottom-4 opacity-5 pointer-events-none">
              <Leaf className="w-32 h-32" />
            </div>
          </div>

          {/* Bento 5: Actions */}
          <div className="sm:col-span-1 lg:col-span-8 flex gap-4">
            <Button
              variant="outline"
              onClick={onShowSaved}
              className={`h-full min-h-[80px] w-full md:w-24 rounded-[2.5rem] border-2 p-0 shrink-0 transition-transform active:scale-95 flex items-center justify-center shadow-xl ${isLight
                ? "border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 hover:bg-white"
                : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white hover:bg-zinc-900/50"}`}
            >
              <History className="w-7 h-7" />
            </Button>

            <Button
              onClick={onGenerate}
              disabled={updating}
              className={`flex-1 h-full min-h-[80px] text-lg md:text-2xl font-black uppercase tracking-[0.15em] md:tracking-[0.2em] rounded-[2.5rem] shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group ${isLight
                ? "bg-gradient-to-r from-zinc-800 to-zinc-950 text-white shadow-zinc-900/30"
                : "bg-gradient-to-r from-white to-zinc-200 text-black shadow-white/10"
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              
              {updating ? (
                <>
                  <div className="w-6 h-6 md:w-8 md:h-8 border-[3px] md:border-[4px] border-current border-t-transparent rounded-full animate-spin mr-3 md:mr-4" />
                  <span className="text-sm md:text-2xl">{common.generating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 mr-3 md:mr-4 animate-pulse" />
                  <span className="text-base md:text-2xl">{t.generate}</span>
                </>
              )}
            </Button>
          </div>

        </motion.div>

      </div>
    </motion.div>
  );
}
