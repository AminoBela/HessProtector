import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Target, Timer, Wallet } from "lucide-react";
import { differenceInDays, startOfDay } from "date-fns";
import { Translations } from "@/lib/i18n";
import { motion, Variants } from "framer-motion";
import { container, item } from "@/lib/animations";
import { PremiumDatePicker } from "@/components/ui/premium-date-picker";

interface Goal {
  id: number;
  label: string;
  target: number;
  saved: number;
  deadline: string;
  priority: string;
}

interface GoalForm {
  label: string;
  target: string;
  saved: string;
  deadline: string;
  priority: string;
}

interface GoalsViewProps {
  data: { goals: Goal[] };
  goalForm: GoalForm;
  setGoalForm: (form: GoalForm) => void;
  handleAddGoal: () => void;
  handleDeleteGoal: (id: number) => void;
  language: string;
  theme: string;
}

export function GoalsView({
  data,
  goalForm,
  setGoalForm,
  handleAddGoal,
  handleDeleteGoal,
  language,
  theme,
}: GoalsViewProps) {
  const isLight = theme === "light";

  const cardGlass = isLight
    ? "card-glass card-glass-light"
    : "card-glass card-glass-dark";

  const cardTitleColor = isLight ? "text-emerald-900/50" : "text-zinc-400";

  const inputStyle = isLight
    ? "bg-white border-emerald-900/10 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-[border-color,box-shadow] !h-14 rounded-xl px-4 font-medium shadow-inner"
    : "bg-zinc-950/60 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-[border-color,box-shadow] !h-14 rounded-xl px-4 font-medium shadow-inner";

  const selectStyle = isLight
    ? "w-full !h-14 px-4 rounded-xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50 cursor-pointer transition-[border-color,box-shadow] shadow-inner font-medium"
    : "w-full !h-14 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50 cursor-pointer transition-[border-color,box-shadow] shadow-inner font-medium";

  const labelColor = isLight ? "text-slate-500" : "text-zinc-400";
  const bigTextColor = isLight ? "text-slate-800" : "text-white";
  const trashColor = isLight
    ? "text-slate-400 hover:text-rose-500"
    : "text-zinc-600 hover:text-rose-400";
  const progressBg = isLight ? "bg-slate-200" : "bg-white/10";
  const infoBoxStyle = isLight
    ? "bg-indigo-50 border-indigo-100 text-indigo-700"
    : "bg-indigo-900/20 border-indigo-500/20 text-indigo-300";

  const t =
    Translations[language as keyof typeof Translations] || Translations.fr;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-12 gap-8"
    >
      <div className="md:col-span-4">
        <Card className={`h-fit border-0 ${cardGlass}`}>
          <CardHeader>
            <CardTitle
              className={`text-sm uppercase tracking-widest ${cardTitleColor}`}
            >
              {t.goals.newGoal}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Nom (ex: PS5)"
              className={inputStyle}
              value={goalForm.label}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGoalForm({ ...goalForm, label: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder={`${t.goals.target} (€)`}
              className={inputStyle}
              value={goalForm.target}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGoalForm({ ...goalForm, target: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder={`${t.goals.saved} (€)`}
              className={inputStyle}
              value={goalForm.saved}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGoalForm({ ...goalForm, saved: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className={`text-xs font-bold uppercase ${labelColor}`}>
                  Date Limite
                </label>
                <PremiumDatePicker
                  date={goalForm.deadline ? new Date(goalForm.deadline) : undefined}
                  setDate={(date) => setGoalForm({ ...goalForm, deadline: date ? date.toISOString().split("T")[0] : "" })}
                  isLight={isLight}
                  disabledDays={(date) => date < startOfDay(new Date())}
                />
              </div>
              <div className="space-y-3">
                <label className={`text-xs font-bold uppercase ${labelColor}`}>
                  Priorité
                </label>
                <Select
                  value={goalForm.priority}
                  onValueChange={(val) =>
                    setGoalForm({ ...goalForm, priority: val })
                  }
                >
                  <SelectTrigger className={selectStyle}>
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Haute">Haute</SelectItem>
                    <SelectItem value="Moyenne">Moyenne</SelectItem>
                    <SelectItem value="Basse">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              variant="premium"
              size="xl"
              onClick={handleAddGoal}
              disabled={!goalForm.label || !goalForm.target}
              className={`w-full mt-4 ${(!goalForm.label || !goalForm.target) ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {t.goals.add}
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-8 space-y-4">
        {(data?.goals || []).map((g: Goal) => {
          const daysRemaining = g.deadline
            ? differenceInDays(new Date(g.deadline), new Date())
            : 999;
          const needed = g.target - g.saved;
          const perMonth =
            daysRemaining > 0 ? (needed / (daysRemaining / 30)).toFixed(2) : 0;

          return (
            <motion.div variants={item} key={g.id} className="relative">
              <div className={`absolute inset-0 border-0 ${cardGlass} z-0`} />
              <div className="relative z-10 p-2">
                <CardContent className="p-6">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${g.priority === "Haute" ? "bg-rose-500/20 text-rose-400" : "bg-indigo-500/20 text-indigo-400"}`}
                      >
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-black text-xl ${bigTextColor}`}>
                          {g.label}
                        </h3>
                        <p
                          className={`text-xs uppercase font-bold tracking-widest ${labelColor}`}
                        >
                          {g.deadline ? `Pour le ${g.deadline}` : "Pas de date"}{" "}
                          • {g.priority}
                        </p>
                      </div>
                    </div>
                    <Trash2
                      className={`w-5 h-5 cursor-pointer ${trashColor}`}
                      onClick={() => handleDeleteGoal(g.id)}
                    />
                  </div>
                  <div className="mt-6 mb-2 flex justify-between text-sm font-bold">
                    <span className={bigTextColor}>{g.saved.toFixed(2)}€</span>
                    <span className={labelColor}>{g.target.toFixed(2)}€</span>
                  </div>
                  <Progress
                    value={(g.saved / g.target) * 100}
                    className={`h-4 rounded-full ${progressBg}`}
                    indicatorColor={
                      g.priority === "Haute" ? "bg-rose-500" : "bg-indigo-500"
                    }
                  />
                  <div
                    className={`mt-4 flex gap-4 text-xs font-medium p-3 rounded-lg border ${infoBoxStyle}`}
                  >
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4" /> Reste {daysRemaining} jours
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" /> Mettre {perMonth}€ / mois
                    </div>
                  </div>
                </CardContent>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
