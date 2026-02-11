import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Translations } from "@/lib/i18n";
import { motion } from "framer-motion";
import { container } from "@/lib/animations";

interface SavedPlan {
  id: number;
  name: string;
  content_json: string;
  created_at: string;
}

interface CoachSavedPlansProps {
  savedPlans: SavedPlan[];
  onBack: () => void;
  onLoad: (plan: SavedPlan) => void;
  onDelete: (id: number) => void;
  language: string;
  theme: string;
}

export function CoachSavedPlans({
  savedPlans,
  onBack,
  onLoad,
  onDelete,
  language,
  theme,
}: CoachSavedPlansProps) {
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

  const [deletePlanId, setDeletePlanId] = useState<number | null>(null);

  const safeSavedPlans = Array.isArray(savedPlans) ? savedPlans : [];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="h-[calc(100vh-180px)]"
    >
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-zinc-400 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> {common.back}
        </Button>
        <h2
          className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-white"}`}
        >
          {t.savedTitle}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeSavedPlans.map((plan) => (
          <div
            key={plan.id}
            className={`${cardGlass} p-5 group relative flex flex-col`}
          >
            <div className="flex-1">
              <h3
                className={`font-bold text-lg mb-1 ${isLight ? "text-slate-800" : "text-white"}`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-xs mb-4 ${isLight ? "text-slate-500" : "text-zinc-500"}`}
              >
                {new Date(plan.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => onLoad(plan)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 h-9 text-xs font-bold"
              >
                {t.load}
              </Button>
              <Button
                onClick={() => setDeletePlanId(plan.id)}
                variant="destructive"
                className="h-9 w-9 p-0 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {safeSavedPlans.length === 0 && (
          <p className="text-zinc-500 italic">{t.noPlans}</p>
        )}
      </div>

      <Dialog
        open={deletePlanId !== null}
        onOpenChange={(open) => !open && setDeletePlanId(null)}
      >
        <DialogContent
          className={
            isLight
              ? "bg-white/95 backdrop-blur-xl border-emerald-900/10 text-slate-800"
              : "bg-zinc-950 border-white/10 text-white"
          }
        >
          <DialogHeader>
            <DialogTitle>{t.deleteTitle}</DialogTitle>
            <DialogDescription>{t.deleteDesc}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeletePlanId(null)}>
              {common.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deletePlanId) onDelete(deletePlanId);
                setDeletePlanId(null);
              }}
            >
              {common.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
