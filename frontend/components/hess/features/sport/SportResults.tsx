import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PremiumSlider } from "@/components/ui/premium-slider";
import { Loader2, ArrowLeft, Check, Save, Activity, HeartPulse, Clock, FileText, RefreshCw, Weight } from "lucide-react";
import { useState } from "react";
import { Translations } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { container, item as animItem } from "@/lib/animations";

export function SportResults({
  parsedData,
  onBack,
  onSavePlan,
  saving,
  isGenerating,
  onReadapt,
  language,
  theme,
}: any) {
  const isLight = theme === "light";
  const glassCard = isLight
    ? "bg-white/80 backdrop-blur-xl border-emerald-900/5 shadow-xl"
    : "bg-black/40 backdrop-blur-xl border-white/10 shadow-xl";

  const t = Translations[language as keyof typeof Translations]?.sport || Translations.fr.sport;
  const common = Translations[language as keyof typeof Translations]?.common || Translations.fr.common;

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const [isReadaptDialogOpen, setIsReadaptDialogOpen] = useState(false);
  const [checkinNotes, setCheckinNotes] = useState("");
  const [checkinWeight, setCheckinWeight] = useState("");
  const [checkinFatigue, setCheckinFatigue] = useState<number[]>([5]);

  const [activeWeekIndex, setActiveWeekIndex] = useState(0);

  const currentWeeks = parsedData.weeks || [];
  const currentWeek = currentWeeks[activeWeekIndex];

  const handleSaveConfirm = async () => {
    await onSavePlan(newPlanName);
    setIsSaveDialogOpen(false);
    setNewPlanName("");
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleReadaptConfirm = async () => {
    setIsReadaptDialogOpen(false);
    await onReadapt(checkinNotes, parseFloat(checkinWeight) || 0, checkinFatigue[0]);
    setCheckinNotes("");
    setCheckinWeight("");
  };

  return (
    <motion.div key={language} variants={container} initial="hidden" animate="show" className="pb-24 space-y-12 max-w-[1600px] mx-auto px-4 md:px-12 lg:px-20">
      <motion.div variants={animItem} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <Button variant="ghost" className="text-zinc-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-[2rem] px-10 h-14 transition-all duration-300" onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-3" /> {common.back}
        </Button>

        <div className="flex gap-4 items-center flex-wrap">
          {showSaveSuccess && (
            <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mr-4 flex gap-2 items-center bg-emerald-500/10 px-6 py-3 rounded-full border border-emerald-500/20">
              <Check className="w-4 h-4" /> Objectif accompli!
            </motion.span>
          )}

          <Button size="lg" onClick={() => setIsReadaptDialogOpen(true)} className="bg-purple-600 hover:bg-purple-500 rounded-[2rem] px-10 h-14 shadow-2xl shadow-purple-500/30 text-white border-0 transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center">
              {isGenerating ? <Loader2 className="w-6 h-6 mr-3 animate-spin" /> : <RefreshCw className="w-6 h-6 mr-3 group-hover:rotate-180 transition-transform duration-700" />} 
              <span className="font-black uppercase tracking-widest text-xs">{t.readapt}</span>
            </div>
          </Button>

          <Button size="lg" onClick={() => setIsSaveDialogOpen(true)} className="bg-blue-600 hover:bg-blue-500 rounded-[2rem] px-10 h-14 shadow-2xl shadow-blue-500/30 text-white border-0 transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center">
              <Save className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" /> 
              <span className="font-black uppercase tracking-widest text-xs">{common.save}</span>
            </div>
          </Button>
        </div>
      </motion.div>

      {/* Hero Analysis Card */}
      <motion.div variants={animItem} className={`p-12 md:p-16 rounded-[4rem] relative overflow-hidden border group transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] ${glassCard}`}>
        <div className="absolute top-0 right-0 p-20 opacity-[0.03] group-hover:opacity-[0.08] group-hover:-rotate-12 group-hover:scale-125 transition-all duration-1000 pointer-events-none">
          <Activity className={`w-96 h-96 ${isLight ? "text-blue-900" : "text-white"}`} />
        </div>

        <div className="relative z-10 max-w-5xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-500/20 rounded-[1.5rem] shadow-inner">
                <HeartPulse className="w-8 h-8 text-blue-500" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-500/80">{t.analysis}</span>
            </div>
            <div className="hidden md:block w-px h-10 bg-blue-500/20" />
            <span className={`text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none ${isLight ? "text-slate-800" : "text-white"}`}>
              {parsedData.title}
            </span>
          </div>
          <p className={`text-xl md:text-3xl font-medium leading-relaxed italic opacity-90 ${isLight ? "text-slate-600" : "text-zinc-200"}`}>
            "{parsedData.analysis}"
          </p>
        </div>
      </motion.div>

      {/* Legacy support for old non-weekly structure */}
      {!parsedData.weeks && parsedData.workouts && (
         <div className="p-10 bg-rose-500/10 text-rose-500 rounded-[3rem] border border-rose-500/20 font-black uppercase tracking-widest text-xs flex items-center gap-6 animate-pulse">
             <Activity className="w-8 h-8" />
             Ancien format de plan détecté ! Veuillez regénérer un plan pour profiter des Macro-cycles.
         </div>
      )}

      {currentWeeks.length > 0 && (
         <div className="space-y-16">
            {/* WEEK NAVIGATION Overhaul - WIDENED */}
            <div className="flex flex-col items-center gap-10 relative">
               <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -z-10" />
               
               <div className={`p-2.5 rounded-[3.5rem] flex gap-3 w-full border relative z-10 ${isLight ? "bg-white/40 backdrop-blur-md border-slate-200/50 shadow-inner" : "bg-zinc-950/40 backdrop-blur-md border-white/5 shadow-inner shadow-black/40"}`}>
                  {currentWeeks.map((week: any, idx: number) => {
                    const isActive = activeWeekIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveWeekIndex(idx)}
                        className={`relative flex-1 group transition-all duration-500 outline-none`}
                      >
                         <div className={`px-8 py-8 rounded-[3rem] relative z-10 flex flex-col items-center justify-center gap-1.5 transition-all duration-500
                           ${isActive 
                             ? (isLight ? "bg-white text-blue-600 shadow-2xl shadow-blue-500/30" : "bg-zinc-800 text-white shadow-2xl shadow-black/80 translate-y-[-6px]") 
                             : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                           }`}
                         >
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Semana</span>
                            <span className="text-2xl md:text-4xl font-black tabular-nums">{week.week_number}</span>
                            
                            {isActive && (
                              <motion.div layoutId="active-week-indicator" className="absolute -bottom-1.5 left-4 right-4 h-1.5 bg-blue-500 rounded-full" />
                            )}
                         </div>
                      </button>
                    );
                  })}
               </div>
               
               <motion.div 
                 key={activeWeekIndex + "-header"}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="text-center space-y-2"
               >
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60">Macro-cycle Focus</span>
                  <h3 className={`text-2xl md:text-4xl font-black uppercase tracking-tight ${isLight ? "text-slate-800" : "text-white"}`}>
                    {currentWeek.focus}
                  </h3>
               </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeWeekIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10"
              >
                {currentWeek.workouts?.map((day: any, idx: number) => (
                  <motion.div variants={animItem} key={idx} className={`group relative overflow-hidden rounded-[3.5rem] border transition-all duration-700 hover:shadow-[0_32px_80px_-20px_rgba(0,0,0,0.2)] flex flex-col h-full ${isLight ? "bg-white border-slate-200/60" : "bg-zinc-900/40 border-white/5 backdrop-blur-xl"}`}>
                    <div className={`p-10 border-b flex justify-between items-center transition-colors duration-500 ${isLight ? "bg-slate-50/50 group-hover:bg-blue-50/50 border-slate-100" : "bg-black/20 group-hover:bg-blue-500/5 border-white/5"}`}>
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40 text-blue-500">Scheduled</span>
                          <h4 className={`text-3xl font-black tracking-tighter ${isLight ? "text-slate-900" : "text-white"}`}>{day.day}</h4>
                        </div>
                        <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-[1.5rem] border transition-all duration-500 ${isLight ? "bg-white border-slate-200 group-hover:border-blue-500/30" : "bg-zinc-950 border-white/5 group-hover:border-blue-500/30"}`}>
                            <Clock className="w-6 h-6 text-blue-500 mb-0.5 opacity-60"/> 
                            <span className="text-xs font-black">{day.duration}</span>
                        </div>
                    </div>

                    <div className={`px-10 py-5 font-black text-xs tracking-[0.2em] uppercase border-b transition-all duration-500 ${isLight ? "text-blue-600 bg-blue-50 group-hover:bg-blue-100/50" : "text-blue-400 bg-blue-500/10 border-white/5 group-hover:bg-blue-500/20"}`}>
                        {day.focus}
                    </div>

                    <div className="p-10 space-y-8 flex-1">
                      {day.exercises?.map((ex: any, i: number) => (
                        <div key={i} className="group/ex relative">
                            <div className="flex justify-between items-start mb-4">
                                <h5 className={`font-black text-lg md:text-xl leading-tight transition-colors duration-300 ${isLight ? "text-slate-800 group-hover/ex:text-blue-600" : "text-zinc-100 group-hover/ex:text-blue-400"}`}>{ex.name}</h5>
                                <div className={`flex items-center justify-center w-7 h-7 rounded-full border text-[10px] font-black ${isLight ? "border-slate-200 bg-slate-50" : "border-white/5 bg-zinc-950"}`}>
                                  {i + 1}
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-6 text-xs font-black uppercase tracking-widest opacity-60">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                                  <span>{ex.sets} {t.sets}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span>{ex.reps} {t.reps}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                                  <span>{ex.rest} {t.rest}</span>
                                </div>
                            </div>

                            {ex.notes && (
                                <div className={`mt-5 p-5 rounded-[1.5rem] text-sm font-bold leading-relaxed transition-all duration-500 ${isLight ? "bg-amber-50/50 border border-amber-500/10 text-amber-800" : "bg-amber-500/10 border border-amber-500/20 text-amber-400"}`}>
                                    <div className="flex items-center gap-2 mb-2 opacity-60 uppercase tracking-widest text-[9px]">
                                      <FileText className="w-3.5 h-3.5"/> {t.notes}
                                    </div>
                                    {ex.notes}
                                </div>
                            )}
                            
                            {i < day.exercises.length - 1 && (
                              <div className="h-px bg-gradient-to-r from-transparent via-zinc-500/10 to-transparent mt-8 mb-8" />
                            )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
         </div>
      )}

      {/* CHECK-IN DIALOG - WIDENED */}
      <Dialog open={isReadaptDialogOpen} onOpenChange={setIsReadaptDialogOpen}>
        <DialogContent className={`sm:max-w-2xl border-0 p-10 overflow-hidden rounded-[3.5rem] ${isLight ? "bg-white/95 backdrop-blur-2xl" : "bg-zinc-950/95 backdrop-blur-2xl text-white"}`}>
          <div className="absolute top-0 right-0 p-16 opacity-[0.05] pointer-events-none -mr-20 -mt-20">
            <RefreshCw className="w-64 h-64 animate-spin-slow rotate-12" />
          </div>
          
          <DialogHeader className="relative z-10 space-y-4">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-4 ${isLight ? "bg-purple-100 text-purple-600" : "bg-purple-500/20 text-purple-400"}`}>
               <RefreshCw className="w-8 h-8" />
            </div>
            <DialogTitle className="text-4xl font-black uppercase tracking-tight">Check-In</DialogTitle>
            <DialogDescription className="text-base font-medium opacity-60 leading-relaxed">
              Fais le point avec ton Coach IA. Indique tes progrès ou tes difficultés pour un programme parfaitement ajusté.
            </DialogDescription>
          </DialogHeader>

          <div className="py-10 space-y-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <label className="text-xs font-black uppercase tracking-[0.2em] opacity-50">Nouveau Poids</label>
                    {checkinWeight && <span className="text-3xl font-black text-purple-500">{checkinWeight}kg</span>}
                 </div>
                 <div className={`flex items-center gap-4 px-8 rounded-2xl border h-16 transition-all ${isLight ? "bg-white" : "bg-zinc-900 border-white/5 focus-within:border-purple-500/50"}`}>
                    <Weight className="w-6 h-6 opacity-40" />
                    <Input type="number" step="0.1" value={checkinWeight} onChange={(e) => setCheckinWeight(e.target.value)} placeholder="0.0" className="border-0 ring-0 focus-visible:ring-0 bg-transparent font-black text-xl p-0" />
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <label className="text-xs font-black uppercase tracking-[0.2em] opacity-50">Niveau de fatigue</label>
                    <span className={`text-3xl font-black ${checkinFatigue[0] > 7 ? "text-rose-500" : "text-emerald-500"}`}>{checkinFatigue[0]}<span className="text-sm opacity-40 ml-1">/10</span></span>
                 </div>
                 <div className="px-2">
                   <PremiumSlider value={checkinFatigue} onValueChange={setCheckinFatigue} min={1} max={10} step={1} variant="purple" />
                 </div>
              </div>
            </div>

            <div className="space-y-4">
               <label className="text-xs font-black uppercase tracking-[0.2em] opacity-50">Ressenti détaillé</label>
               <div className={`p-6 rounded-3xl border h-40 transition-all ${isLight ? "bg-white" : "bg-zinc-900 border-white/5 focus-within:border-purple-500/50"}`}>
                  <textarea 
                    value={checkinNotes} 
                    onChange={(e) => setCheckinNotes(e.target.value)} 
                    placeholder="Ex: Douleurs aux genoux, séances trop longues..." 
                    className="w-full h-full bg-transparent border-0 ring-0 focus:ring-0 focus:outline-none font-bold text-base resize-none py-1"
                  />
               </div>
            </div>
          </div>

          <DialogFooter className="relative z-10 gap-5">
            <Button variant="ghost" onClick={() => setIsReadaptDialogOpen(false)} className="rounded-2xl h-16 px-10 font-black uppercase tracking-widest text-xs">Annuler</Button>
            <Button onClick={handleReadaptConfirm} className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-16 px-12 font-black uppercase tracking-widest text-xs border-0 flex-1 shadow-2xl shadow-purple-500/30">
               Réadapter le Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SAVE DIALOG - WIDENED */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className={`sm:max-w-2xl border-0 p-10 overflow-hidden rounded-[3.5rem] ${isLight ? "bg-white/95 backdrop-blur-2xl" : "bg-zinc-950/95 backdrop-blur-2xl text-white"}`}>
          <DialogHeader className="space-y-4">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-4 ${isLight ? "bg-blue-100 text-blue-600" : "bg-blue-500/20 text-blue-400"}`}>
               <Save className="w-8 h-8" />
            </div>
            <DialogTitle className="text-3xl font-black uppercase tracking-tight">Sauvegarder le Plan</DialogTitle>
            <DialogDescription className="text-sm font-medium opacity-60">Donnez un titre mémorable à ce cycle d'entraînement.</DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <div className={`flex items-center gap-4 px-6 rounded-2xl border h-16 transition-all ${isLight ? "bg-white border-slate-200" : "bg-zinc-900 border-white/5 focus-within:border-blue-500/50"}`}>
               <FileText className="w-5 h-5 opacity-40" />
               <Input value={newPlanName} onChange={(e) => setNewPlanName(e.target.value)} placeholder="Ex: Powerbuilding Winter 2026" className="border-0 ring-0 focus-visible:ring-0 bg-transparent font-black p-0" />
            </div>
          </div>
          <DialogFooter className="gap-5">
            <Button variant="ghost" onClick={() => setIsSaveDialogOpen(false)} className="rounded-2xl h-16 px-10 font-black uppercase tracking-widest text-xs">{common.cancel}</Button>
            <Button onClick={handleSaveConfirm} disabled={saving || !newPlanName.trim()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-16 px-12 font-black uppercase tracking-widest text-xs flex-1 shadow-2xl shadow-blue-500/30 border-0">
              {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : common.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
