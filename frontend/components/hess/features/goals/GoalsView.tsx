import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Target, Timer, Wallet, Plus } from "lucide-react";
import { differenceInDays, startOfDay } from "date-fns";
import { Translations } from "@/lib/i18n";
import { motion, Variants } from "framer-motion";
import { container, item } from "@/lib/animations";
import { PremiumDatePicker } from "@/components/ui/premium-date-picker";
import { usePrivacy } from "@/context/PrivacyContext";
import confetti from "canvas-confetti";

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
  handleUpdateGoal?: (id: number, data: Partial<Goal>) => void;
  language: string;
  theme: string;
}

export function GoalsView({
  data,
  goalForm,
  setGoalForm,
  handleAddGoal,
  handleDeleteGoal,
  handleUpdateGoal,
  language,
  theme,
}: GoalsViewProps) {
  const { isBlurred } = usePrivacy();
  const isLight = theme === "light";
  
  const [addingGoalId, setAddingGoalId] = useState<number | null>(null);
  const [addAmount, setAddAmount] = useState<string>("");
  const [isSubmittingAmount, setIsSubmittingAmount] = useState(false);

  const confirmAddMoney = async () => {
    if (!addingGoalId || !addAmount || !handleUpdateGoal) return;
    setIsSubmittingAmount(true);
    const goalToUpdate = data.goals.find(g => g.id === addingGoalId);
    if (goalToUpdate) {
        await handleUpdateGoal(addingGoalId, { saved: goalToUpdate.saved + parseFloat(addAmount) });
    }
    setIsSubmittingAmount(false);
    setAddingGoalId(null);
    setAddAmount("");
  };

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

  useEffect(() => {
    (data?.goals || []).forEach((g: Goal) => {
      if (g.saved >= g.target && g.target > 0) {
        const key = `confetti_goal_v1_${g.id}`;
        if (!localStorage.getItem(key)) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#34d399', '#10b981', '#059669', '#fbbf24', '#f59e0b']
          });
          localStorage.setItem(key, "true");
        }
      }
    });
  }, [data?.goals]);

  return (
    <motion.div
      key={language}
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
              placeholder={`${t.common.edit} (ex: PS5)`}
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
              <div className="space-y-4">
                <label className={`block mb-2 text-xs font-bold uppercase ${labelColor}`}>
                  {t.goals.deadline}
                </label>
                <PremiumDatePicker
                  date={goalForm.deadline ? new Date(goalForm.deadline) : undefined}
                  setDate={(date) => setGoalForm({ ...goalForm, deadline: date ? date.toISOString().split("T")[0] : "" })}
                  isLight={isLight}
                  language={language}
                  disabledDays={(date) => date < startOfDay(new Date())}
                />
              </div>
              <div className="space-y-4">
                <label className={`block mb-2 text-xs font-bold uppercase ${labelColor}`}>
                  {t.goals.priority}
                </label>
                <Select
                  value={goalForm.priority}
                  onValueChange={(val) =>
                    setGoalForm({ ...goalForm, priority: val })
                  }
                >
                  <SelectTrigger className={selectStyle}>
                    <SelectValue placeholder={t.goals.priority} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Haute">{t.goals.high}</SelectItem>
                    <SelectItem value="Moyenne">{t.goals.medium}</SelectItem>
                    <SelectItem value="Basse">{t.goals.low}</SelectItem>
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
                          {g.deadline ? `${t.goals.deadline} ${g.deadline}` : t.goals.noDate}{" "}
                          • {g.priority === "Haute" ? t.goals.high : g.priority === "Moyenne" ? t.goals.medium : t.goals.low}
                        </p>
                      </div>
                    </div>
                    <Trash2
                      className={`w-5 h-5 cursor-pointer ${trashColor}`}
                      onClick={() => handleDeleteGoal(g.id)}
                    />
                  </div>
                  <div className="mt-6 mb-2 flex justify-between items-end text-sm font-bold">
                    <div className="flex flex-col gap-1">
                        <span className={`${labelColor} text-xs uppercase tracking-widest`}>{t.goals.saved}</span>
                        <div className="flex items-center gap-2">
                           <span className={`text-xl ${bigTextColor} ${isBlurred ? "blur-md select-none transition-all duration-300" : ""}`}>{g.saved.toFixed(2)}€</span>
                           <Button 
                                variant="outline" 
                                size="icon" 
                                className={`h-6 w-6 rounded-full border-dashed ${isLight ? "border-emerald-500/50 text-emerald-600 hover:bg-emerald-50" : "border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10"}`}
                                onClick={() => setAddingGoalId(g.id)}
                           >
                               <Plus className="w-3 h-3" />
                           </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                        <span className={`${labelColor} text-xs uppercase tracking-widest`}>{t.goals.target}</span>
                        <span className={`text-xl ${labelColor} ${isBlurred ? "blur-sm select-none transition-all duration-300" : ""}`}>{g.target.toFixed(2)}€</span>
                    </div>
                  </div>
                  <div className="relative group overflow-hidden rounded-full shadow-inner">
                    <Progress
                      value={Math.min((g.saved / g.target) * 100, 100)}
                      className={`h-5 rounded-full ${progressBg}`}
                      indicatorColor={
                        g.priority === "Haute" ? "bg-rose-500" : "bg-indigo-500"
                      }
                    />
                    <motion.div 
                      className="absolute top-0 bottom-0 w-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[30deg]"
                      initial={{ left: "-100%" }}
                      animate={{ left: "200%" }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                    />
                  </div>
                  <div
                    className={`mt-4 flex gap-4 text-xs font-medium p-3 rounded-lg border ${infoBoxStyle}`}
                  >
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4" /> {(t.goals as any).daysRemaining?.replace?.("{n}", String(daysRemaining)) || `Reste ${daysRemaining} jours`}
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" /> {(t.goals as any).perMonth?.replace?.("{amount}", String(perMonth)) || `Mettre ${perMonth}€ / mois`}
                    </div>
                  </div>
                </CardContent>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Money Dialog */}
      <Dialog open={addingGoalId !== null} onOpenChange={(open) => !open && setAddingGoalId(null)}>
        <DialogContent className={isLight ? "bg-white/90 backdrop-blur-xl border-emerald-900/10" : "bg-black/90 backdrop-blur-xl border-white/10"}>
            <DialogHeader>
                <DialogTitle className={`text-xl font-black ${bigTextColor}`}>
                    {(t.goals as any).creditGoal || "Créditer cet objectif"}
                </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
                <Input 
                    type="number" 
                    placeholder={(t.goals as any).addAmount || "Montant à ajouter (€)"}
                    className={inputStyle}
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    autoFocus
                />
                <Button 
                    variant="premium" 
                    className="w-full h-14"
                    disabled={!addAmount || isSubmittingAmount}
                    onClick={confirmAddMoney}
                >
                    {isSubmittingAmount ? ((t.goals as any).addingInProgress || "En cours...") : ((t.goals as any).addToSavings || "Ajouter à l'épargne")}
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
