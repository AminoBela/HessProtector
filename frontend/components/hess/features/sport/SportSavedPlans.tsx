import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Calendar, Activity, ChevronRight, Clock } from "lucide-react";
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
import { container, item } from "@/lib/animations";

export function SportSavedPlans({
  savedPlans,
  onBack,
  onLoad,
  onDelete,
  language,
  theme,
}: any) {
  const isLight = theme === "light";
  const glassCard = isLight
    ? "bg-white/80 backdrop-blur-xl border-blue-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
    : "bg-black/40 backdrop-blur-xl border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:bg-white/5";

  const t = Translations[language as keyof typeof Translations]?.sport || Translations.fr.sport;
  const common = Translations[language as keyof typeof Translations]?.common || Translations.fr.common;

  const [deletePlanId, setDeletePlanId] = useState<number | null>(null);
  const safeSavedPlans = Array.isArray(savedPlans) ? savedPlans : [];

  const getPlanStats = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      const days = data.workouts?.length || 0;
      return { days };
    } catch {
      return { days: 0 };
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="h-[calc(100vh-180px)]">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} className="text-zinc-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full px-6">
          <ArrowLeft className="w-5 h-5 mr-2" /> {common.back}
        </Button>
        <h2 className={`text-3xl font-black tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
          {t.accessSaved}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
        {safeSavedPlans.map((plan: any) => {
          const stats = getPlanStats(plan.content_json);

          return (
            <motion.div variants={item} layout key={plan.id} className={`group relative flex flex-col p-6 rounded-[2rem] border transition-[box-shadow,background-color,border-color] duration-300 ${glassCard}`}>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-2xl ${isLight ? "bg-blue-100/50 text-blue-600" : "bg-blue-500/10 text-blue-400"}`}>
                    <Activity className="w-6 h-6" />
                  </div>
                  <Button onClick={(e) => { e.stopPropagation(); setDeletePlanId(plan.id); }} variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl h-8 w-8">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <h3 className={`font-bold text-xl mb-1 line-clamp-1 group-hover:text-blue-500 transition-colors ${isLight ? "text-slate-800" : "text-white"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs font-medium uppercase tracking-wider ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                    {new Date(plan.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-4 py-4 border-t border-b border-dashed border-zinc-500/20">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span className={`text-sm font-bold ${isLight ? "text-slate-600" : "text-zinc-300"}`}>
                      {stats.days} Jours
                    </span>
                  </div>
                </div>
              </div>

              <Button onClick={() => onLoad(plan)} className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl h-12 shadow-lg shadow-blue-500/20 group-hover:scale-[1.02] transition-[transform,background-color] duration-300">
                Ouvrir <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )
        })}

        {safeSavedPlans.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-50">
            <div className="mx-auto w-24 h-24 bg-zinc-500/10 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-10 h-10 text-zinc-500" />
            </div>
            <p className="text-zinc-500 text-lg font-medium">{t.emptyState}</p>
          </div>
        )}
      </div>

      <Dialog open={deletePlanId !== null} onOpenChange={(open) => !open && setDeletePlanId(null)}>
        <DialogContent className={isLight ? "bg-white/95 backdrop-blur-xl border-blue-900/10 text-slate-800" : "bg-zinc-950 border-white/10 text-white"}>
          <DialogHeader>
            <DialogTitle>Supprimer Confirmer</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir supprimer ce programme ?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeletePlanId(null)}>{common.cancel}</Button>
            <Button variant="destructive" onClick={() => { if (deletePlanId) onDelete(deletePlanId); setDeletePlanId(null); }}>{common.delete}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
