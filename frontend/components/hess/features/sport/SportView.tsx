import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PremiumSlider } from "@/components/ui/premium-slider";
import { Activity, Dumbbell, Ruler, Weight, Target, Save, Sparkles, Plus, CheckCircle2, Waves, HeartPulse, History, Clock, Loader2 } from "lucide-react";
import { Translations } from "@/lib/i18n";
import { container, item } from "@/lib/animations";
import { ApiService } from "@/services/apiClient";

interface SportViewProps {
  language: string;
  theme: string;
  token: string;
  onShowSaved: () => void;
  onGenerate: (generateReq: any, profileParams: any) => void;
  isGenerating: boolean;
}

export function SportView({
  language,
  theme,
  token,
  onShowSaved,
  onGenerate,
  isGenerating,
}: SportViewProps) {
  const isLight = theme === "light";
  const panelStyle = isLight
    ? "bg-white/80 backdrop-blur-2xl border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] ring-1 ring-white/50"
    : "bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/5";

  const inputGroupStyle = isLight
    ? "bg-gradient-to-br from-white/90 to-white/50 border-white/60 shadow-sm"
    : "bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 border-white/5 shadow-inner shadow-black/20";

  const inputStyle = isLight
    ? "bg-white border-emerald-900/10 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
    : "bg-zinc-950/60 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50";

  const t = Translations[language as keyof typeof Translations]?.sport || Translations.fr.sport;

  const [height, setHeight] = useState<number>(180);
  const [weight, setWeight] = useState<number>(75);
  const [planWeeks, setPlanWeeks] = useState<number[]>([4]);
  const [fitnessGoal, setFitnessGoal] = useState<string>("maintain");
  const [preferred_sports, setPreferredSports] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("intermediaire");
  const [injuries, setInjuries] = useState<string>("");
  const [equipment, setEquipment] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await ApiService.get("/sport/profile", token);
      if (data) {
        if (data.height_cm) setHeight(data.height_cm);
        if (data.weight_kg) setWeight(data.weight_kg);
        if (data.fitness_goal) setFitnessGoal(data.fitness_goal);
        if (data.preferred_sports) setPreferredSports(data.preferred_sports);
        if (data.experience_level) setExperienceLevel(data.experience_level);
        if (data.injuries) setInjuries(data.injuries);
        if (data.equipment) setEquipment(data.equipment);
      }
    } catch {}
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const saveProfile = async () => {
    setIsUpdating(true);
    try {
      await ApiService.post("/sport/profile", {
        height_cm: height,
        weight_kg: weight,
        fitness_goal: fitnessGoal,
        preferred_sports: preferred_sports,
        experience_level: experienceLevel,
        injuries: injuries,
        equipment: equipment
      }, token);
    } catch {}
    setIsUpdating(false);
  };

  const handleGenerate = async () => {
    await saveProfile();
    onGenerate(
      { mode: "new", weeks_duration: planWeeks[0] },
      { height, weight, fitnessGoal, preferred_sports, experienceLevel, injuries, equipment }
    );
  };

  const goals = [
    { id: "lose_weight", label: t.goalLoseWeight, icon: Activity, color: "rose" },
    { id: "build_muscle", label: t.goalMuscle, icon: Dumbbell, color: "blue" },
    { id: "endurance", label: t.goalEndurance, icon: Waves, color: "cyan" },
    { id: "maintain", label: t.goalMaintain, icon: HeartPulse, color: "emerald" },
  ];

  const experienceLevels = [
    { id: "debutant", label: t.levelBeginner },
    { id: "intermediaire", label: t.levelIntermediate },
    { id: "avance", label: t.levelAdvanced },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-[1600px] mx-auto px-4 md:px-12 lg:px-20 py-10 relative z-10"
    >
      {/* Dynamic Background */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-zinc-900/0 to-transparent blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Header section can be removed if there is a global one, but let's keep it compact */}
      <div className="mb-14 text-center space-y-3">
        <motion.h1 variants={item} className={`text-4xl md:text-6xl font-black uppercase tracking-tighter ${isLight ? "text-slate-900" : "text-white"}`}>
          {t.title}
        </motion.h1>
        <motion.p variants={item} className={`text-base md:text-lg font-medium opacity-60 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
          {t.subtitle}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-14">
        
        {/* PHYSICAL METRICS - Bento Card (4 cols) */}
        <motion.div variants={item} className={`md:col-span-12 lg:col-span-4 rounded-[4rem] p-10 md:p-12 relative overflow-hidden flex flex-col border transition-all duration-700 group hover:shadow-[0_20px_80px_-15px_rgba(0,0,0,0.15)] ${panelStyle}`}>
          <div className="absolute -right-12 -top-12 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-1000 pointer-events-none">
            <Activity className="w-80 h-80" />
          </div>

          <div className="space-y-2 mb-10 relative z-10">
            <div className={`w-14 h-14 rounded-3xl flex items-center justify-center mb-6 shadow-xl ${isLight ? "bg-blue-100 text-blue-600" : "bg-blue-500/20 text-blue-400 shadow-blue-500/10"}`}>
              <Activity className="w-7 h-7" />
            </div>
            <h2 className={`text-2xl font-black uppercase tracking-tight ${isLight ? "text-slate-800" : "text-white"}`}>
              {t.profile}
            </h2>
          </div>

          <div className="space-y-10 relative z-10 flex-1 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-50 flex items-center gap-2 ${isLight ? "text-slate-800" : "text-white"}`}>
                    <Ruler className="w-3.5 h-3.5" /> {t.height}
                  </label>
                  <span className={`text-3xl font-black tabular-nums ${isLight ? "text-blue-600" : "text-blue-400 font-outline-2"}`}>{height}<span className="text-xs ml-1 opacity-50">cm</span></span>
                </div>
                <div className="px-1">
                    <PremiumSlider value={[height]} onValueChange={(val) => setHeight(val[0])} min={100} max={250} step={1} variant="indigo" />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-50 flex items-center gap-2 ${isLight ? "text-slate-800" : "text-white"}`}>
                    <Weight className="w-3.5 h-3.5" /> {t.weight}
                  </label>
                  <span className={`text-3xl font-black tabular-nums ${isLight ? "text-emerald-500" : "text-emerald-400"}`}>{weight}<span className="text-xs ml-1 opacity-50">kg</span></span>
                </div>
                <div className="px-1">
                    <PremiumSlider value={[weight]} onValueChange={(val) => setWeight(val[0])} min={30} max={200} step={1} variant="emerald" />
                </div>
              </div>
          </div>
        </motion.div>

        {/* GOALS - Bento Card (8 cols) */}
        <motion.div variants={item} className={`md:col-span-12 lg:col-span-8 rounded-[3.5rem] p-8 md:p-10 relative overflow-hidden border transition-all duration-700 flex flex-col ${panelStyle}`}>
            <div className="mb-10 relative z-10">
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center mb-6 shadow-xl ${isLight ? "bg-rose-100 text-rose-600" : "bg-rose-500/20 text-rose-400 shadow-rose-500/10"}`}>
                    <Target className="w-7 h-7" />
                </div>
                <h2 className={`text-2xl font-black uppercase tracking-tight ${isLight ? "text-slate-800" : "text-white"}`}>
                    {t.goal}
                </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                {goals.map(g => {
                    const isSelected = fitnessGoal === g.id;
                    const Icon = g.icon;
                    return (
                        <button
                            key={g.id}
                            onClick={() => setFitnessGoal(g.id)}
                            className={`group relative p-6 rounded-[2.5rem] border flex flex-col items-center justify-center gap-4 transition-all duration-500 overflow-hidden
                              ${isSelected
                                ? `border-${g.color}-500/50 bg-${g.color}-500/10 shadow-2xl shadow-${g.color}-500/30 text-${g.color}-600 dark:text-${g.color}-400 scale-[1.02]`
                                : `border-transparent hover:border-white/10 ${inputGroupStyle} ${isLight ? "text-slate-500 hover:text-slate-800" : "text-zinc-500 hover:text-white"}`
                              }`}
                        >
                            {isSelected && <div className={`absolute inset-0 bg-gradient-to-br from-${g.color}-500/20 via-transparent to-transparent pointer-events-none animate-pulse-slow`} />}
                            
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isSelected ? `bg-${g.color}-500/20 scale-110 rotate-3` : "bg-black/5 dark:bg-white/5 opacity-50"}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-center leading-tight">{g.label}</span>
                            
                            {isSelected && (
                              <motion.div layoutId="goal-check" className="absolute top-4 right-4 animate-in zoom-in fade-in">
                                <CheckCircle2 className={`w-5 h-5 text-${g.color}-500`} />
                              </motion.div>
                            )}
                        </button>
                    );
                })}
            </div>
        </motion.div>

        {/* LOGISTICS & PREFERENCES - Bento Grid Component (12 cols) */}
        <motion.div variants={item} className={`md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8`}>
            
            {/* Experience & Constraints */}
            <div className={`md:col-span-12 lg:col-span-12 rounded-[3.5rem] p-8 md:p-10 border relative overflow-hidden flex flex-col md:flex-row gap-10 ${panelStyle}`}>
                
                <div className="flex-1 space-y-8">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isLight ? "bg-purple-100 text-purple-600" : "bg-purple-500/20 text-purple-400 shadow-purple-500/10"}`}>
                          <Sparkles className="w-6 h-6" />
                      </div>
                      <h2 className={`text-xl font-black uppercase tracking-tight ${isLight ? "text-slate-800" : "text-white"}`}>
                          Logistique & Niveau
                      </h2>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Experience Selector */}
                      <div className="space-y-4">
                        <label className={`text-[10px] font-black uppercase tracking-widest opacity-50 ${isLight ? "text-slate-800" : "text-white"}`}>
                            {t.experience}
                        </label>
                        <div className="flex bg-black/5 dark:bg-white/10 p-1.5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                           {experienceLevels.map(lvl => (
                             <button
                               key={lvl.id}
                               onClick={() => setExperienceLevel(lvl.id)}
                               className={`flex-1 text-[11px] font-black uppercase py-4 rounded-[1.5rem] transition-all duration-500 tracking-tighter
                                 ${experienceLevel === lvl.id 
                                   ? (isLight ? "bg-white text-blue-600 shadow-xl" : "bg-zinc-800 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)]") 
                                   : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                 }`}
                             >
                               {lvl.label}
                             </button>
                           ))}
                        </div>
                      </div>

                      {/* Equipment */}
                      <div className="space-y-4">
                         <label className={`text-[10px] font-black uppercase tracking-widest opacity-50 ${isLight ? "text-slate-800" : "text-white"}`}>
                            {t.equipment}
                        </label>
                        <div className={`flex items-center gap-3 px-6 rounded-[2rem] border h-[4.5rem] transition-all duration-500 ${isLight ? "bg-white/50 border-slate-200 focus-within:bg-white focus-within:border-blue-500/50" : "bg-black/40 border-white/10 focus-within:border-blue-500/50"}`}>
                           <Dumbbell className="w-5 h-5 opacity-40" />
                           <Input
                                placeholder={t.equipmentDesc}
                                className="bg-transparent border-0 ring-0 focus-visible:ring-0 px-0 font-bold uppercase tracking-tight text-sm"
                                value={equipment}
                                onChange={(e) => setEquipment(e.target.value)}
                           />
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Sports Preference */}
                      <div className="space-y-4">
                         <label className={`text-[10px] font-black uppercase tracking-widest opacity-50 ${isLight ? "text-slate-800" : "text-white"}`}>
                            {t.preferred}
                        </label>
                        <div className={`flex items-center gap-3 px-6 rounded-[2rem] border h-[4.5rem] transition-all duration-500 ${isLight ? "bg-white/50 border-slate-200 focus-within:bg-white focus-within:border-emerald-500/50" : "bg-black/40 border-white/10 focus-within:border-emerald-500/50"}`}>
                           <HeartPulse className="w-5 h-5 opacity-40 text-emerald-500" />
                           <Input
                                placeholder={t.preferredDesc}
                                className="bg-transparent border-0 ring-0 focus-visible:ring-0 px-0 font-bold uppercase tracking-tight text-sm"
                                value={preferred_sports}
                                onChange={(e) => setPreferredSports(e.target.value)}
                           />
                        </div>
                      </div>

                      {/* Injuries */}
                      <div className="space-y-4">
                         <label className={`text-[10px] font-black uppercase tracking-widest opacity-50 ${isLight ? "text-slate-800" : "text-white"}`}>
                            {t.injuries}
                        </label>
                        <div className={`flex items-center gap-3 px-6 rounded-[2rem] border h-[4.5rem] transition-all duration-500 ${isLight ? "bg-white/50 border-slate-200 focus-within:bg-white focus-within:border-rose-500/50" : "bg-black/40 border-white/10 focus-within:border-rose-500/50"}`}>
                           <Activity className="w-5 h-5 opacity-40 text-rose-500" />
                           <Input
                                placeholder={t.injuriesDesc}
                                className="bg-transparent border-0 ring-0 focus-visible:ring-0 px-0 font-bold uppercase tracking-tight text-sm"
                                value={injuries}
                                onChange={(e) => setInjuries(e.target.value)}
                           />
                        </div>
                      </div>
                   </div>
                </div>

                {/* Duration Slider - Specialist card hidden inside */}
                <div className={`w-full md:w-[320px] rounded-[3rem] p-8 border flex flex-col justify-between ${isLight ? "bg-zinc-950 text-white border-zinc-900 shadow-2xl" : "bg-blue-600/10 border-blue-500/20 shadow-2xl shadow-blue-500/10"}`}>
                    <div className="space-y-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLight ? "bg-white/10 text-white" : "bg-blue-500 text-white"}`}>
                           <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight">Durée du Cycle</h3>
                        <p className="text-xs font-medium opacity-50 leading-relaxed">
                          Un cycle plus long permet une progression plus stable et une meilleure périodisation.
                        </p>
                    </div>

                    <div className="space-y-10 mt-8">
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Semanas</span>
                          <span className="text-5xl font-outline-2 font-black tabular-nums">{planWeeks[0]}</span>
                       </div>
                       <div className="px-2">
                          <PremiumSlider value={planWeeks} onValueChange={setPlanWeeks} min={1} max={12} step={1} variant="purple" />
                       </div>
                    </div>
                </div>
            </div>
            
        </motion.div>

        {/* ACTION PANEL */}
        <motion.div variants={item} className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onShowSaved}
            className={`md:col-span-12 lg:col-span-4 h-24 rounded-[3rem] border font-black uppercase tracking-widest transition-all duration-500 group overflow-hidden ${isLight
                ? "bg-white border-slate-200 text-slate-700 hover:border-blue-500/20 hover:bg-slate-50"
                : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
              }`}
          >
            <History className="w-6 h-6 mr-4 group-hover:-rotate-12 transition-transform duration-500" />
            {Translations[language as keyof typeof Translations]?.sidebar?.history || "Historique"}
          </Button>

          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating || isUpdating}
            className={`md:col-span-12 lg:col-span-8 h-24 rounded-[3rem] font-black uppercase tracking-[0.2em] transition-all duration-700 overflow-hidden relative group text-white border-0 shadow-2xl ${isLight
                ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30"
                : "bg-zinc-50 hover:bg-white text-zinc-950 shadow-white/5"
              }`}
          >
            {/* Animated background for button */}
            {isLight && <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-700 opacity-100 transition-opacity" />}
            
            <div className={`absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] ${isGenerating || isUpdating ? "animate-shimmer" : "group-hover:animate-shimmer"}`} />

            <div className="relative z-10 flex items-center justify-center gap-4">
              {isGenerating || isUpdating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-xl">{Translations[language as keyof typeof Translations]?.common?.generating || "Génération..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                  <span className="text-xl">{t.generate}</span>
                </>
              )}
            </div>
          </Button>
        </motion.div>

      </div>
    </motion.div>
  );
}
