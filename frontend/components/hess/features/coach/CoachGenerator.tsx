import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { ChefHat, Sparkles, History, Bot, Loader2 } from "lucide-react";
import { Translations } from "@/lib/i18n";
import { motion } from "framer-motion";
import { container } from "@/lib/animations";

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
  const cardGlass = isLight
    ? "card-glass card-glass-light"
    : "card-glass card-glass-dark";

  const t =
    Translations[language as keyof typeof Translations]?.coach ||
    Translations.fr.coach;
  const common =
    Translations[language as keyof typeof Translations]?.common ||
    Translations.fr.common;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[calc(100vh-180px)] items-center"
    >
      <Card
        className={`border-0 ${cardGlass} flex flex-col justify-center p-12 h-full relative`}
      >
        <Button
          variant="ghost"
          onClick={onShowSaved}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 p-0 md:w-auto md:px-4 md:h-10"
        >
          <History className="w-5 h-5 md:mr-2" />{" "}
          <span className="hidden md:inline">{t.savedTitle}</span>
        </Button>

        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChefHat className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">
            {t.title}
          </h3>
          <p
            className={`text-lg ${isLight ? "text-slate-500" : "text-zinc-400"}`}
          >
            {t.subtitle(diet)}
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span
                className={`font-bold uppercase tracking-widest text-xs ${isLight ? "text-slate-400" : "text-zinc-300"}`}
              >
                {t.budget}
              </span>
              <span
                className={`font-mono text-2xl font-bold ${isLight ? "text-emerald-600" : "text-white"}`}
              >
                {groceryBudget[0]}€
              </span>
            </div>
            <Slider
              value={groceryBudget}
              onValueChange={setGroceryBudget}
              max={150}
              step={5}
              className="py-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span
                className={`font-bold uppercase tracking-widest text-xs ${isLight ? "text-slate-400" : "text-zinc-300"}`}
              >
                {t.days}
              </span>
              <span
                className={`font-mono text-xl font-bold ${isLight ? "text-slate-700" : "text-white"}`}
              >
                {planDays[0]} {common.days}
              </span>
            </div>
            <Slider
              value={planDays}
              onValueChange={setPlanDays}
              min={1}
              max={7}
              step={1}
              className="py-2"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() =>
                setPlanMeals(
                  planMeals.includes("lunch")
                    ? planMeals.filter((m) => m !== "lunch")
                    : [...planMeals, "lunch"],
                )
              }
              variant="outline"
              className={`flex-1 h-12 text-sm border-white/10 ${planMeals.includes("lunch") ? "bg-orange-500 text-white border-transparent" : "bg-black/20 text-zinc-500"}`}
            >
              {t.lunch}
            </Button>
            <Button
              onClick={() =>
                setPlanMeals(
                  planMeals.includes("dinner")
                    ? planMeals.filter((m) => m !== "dinner")
                    : [...planMeals, "dinner"],
                )
              }
              variant="outline"
              className={`flex-1 h-12 text-sm border-white/10 ${planMeals.includes("dinner") ? "bg-indigo-500 text-white border-transparent" : "bg-black/20 text-zinc-500"}`}
            >
              {t.dinner}
            </Button>
          </div>

          <Button
            onClick={onGenerate}
            disabled={updating}
            className={`w-full h-16 text-xl font-bold rounded-2xl shadow-xl transition-all ${isLight ? "bg-white text-black hover:bg-zinc-200 border border-zinc-200" : "bg-emerald-600 text-white hover:bg-emerald-500"}`}
          >
            {updating ? (
              <Loader2 className="w-6 h-6 animate-spin mr-2 text-emerald-600" />
            ) : (
              <Sparkles className="mr-2 w-5 h-5 text-emerald-600" />
            )}{" "}
            {updating ? common.generating : t.generate}
          </Button>
        </div>
      </Card>
      <div className="hidden md:flex flex-col items-center justify-center p-10 text-center opacity-40">
        <Bot
          className={`w-32 h-32 mb-6 animate-pulse ${isLight ? "text-emerald-700" : "text-white"}`}
        />
        <p
          className={`text-lg font-light max-w-xs ${isLight ? "text-slate-500" : "text-zinc-400"}`}
        >
          {t.accessSaved}
        </p>
      </div>
    </motion.div>
  );
}
