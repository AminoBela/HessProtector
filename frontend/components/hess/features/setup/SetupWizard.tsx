import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, ArrowRight, Plus, Rocket, Utensils, Coins, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Translations } from "@/lib/i18n";
import { useSettings } from "@/context/SettingsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SetupWizardProps {
  onFinish: (data: any) => void;
  bg?: React.ReactNode;
}

export function SetupWizard({ onFinish, bg }: SetupWizardProps) {
  const { theme } = useSettings();
  const isLight = theme === "light";

  const [setupStep, setSetupStep] = useState(0);
  const [setupBalance, setSetupBalance] = useState("");
  const [setupBills, setSetupBills] = useState<any[]>([]);
  const [setupProfile, setSetupProfile] = useState({
    supermarket: "",
    diet: "Aucun",
  });
  const [tempBill, setTempBill] = useState({
    label: "",
    amount: "",
    day: "",
    type: "Fixe",
  });

  const t = Translations.fr.setup;

  const cardGlass = isLight
    ? "bg-white/80 backdrop-blur-2xl border-white/50 shadow-2xl shadow-emerald-500/10"
    : "bg-zinc-950/80 backdrop-blur-2xl border-white/10 shadow-2xl shadow-black/50";

  const inputStyle = isLight
    ? "bg-white/50 border-emerald-900/10 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all !h-14 rounded-2xl px-5 text-lg font-medium shadow-sm"
    : "bg-zinc-950/50 border-emerald-500/20 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all !h-14 rounded-2xl px-5 text-lg font-medium shadow-inner";

  const selectStyle = isLight
    ? "w-full !h-14 px-5 rounded-2xl border border-emerald-900/10 bg-white/50 text-slate-800 focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm font-medium text-lg flex items-center"
    : "w-full !h-14 px-5 rounded-2xl border border-emerald-500/20 bg-zinc-950/50 text-white focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner font-medium text-lg flex items-center";

  const addSetupBill = () => {
    if (!tempBill.label || !tempBill.amount) return;
    setSetupBills([
      ...setupBills,
      {
        ...tempBill,
        amount: parseFloat(tempBill.amount),
        day: parseInt(tempBill.day) || 1,
      },
    ]);
    setTempBill({ label: "", amount: "", day: "", type: "Fixe" });
  };

  const handleFinish = () => {
    onFinish({
      balance: parseFloat(setupBalance),
      bills: setupBills,
      ...setupProfile,
    });
  };

  const steps = [
    { title: t.step1, icon: Coins, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: t.step2, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: t.step3, icon: Utensils, color: "text-amber-500", bg: "bg-amber-500/10" }
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden ${isLight ? "bg-slate-50 text-slate-800" : "bg-black text-white"}`}>
      { /* Global AnimatedBackground injected by MainLayout */}

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
        className="w-full max-w-xl z-10"
      >
        <Card className={`border ${cardGlass} rounded-[2rem] overflow-hidden`}>
          { }
          <CardHeader className="px-10 pt-8 pb-4">
            <div className="flex justify-between items-center mb-8 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full z-0 overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(setupStep / 2) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
              {steps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                  <motion.div
                    animate={{
                      scale: setupStep === idx ? 1.2 : 1,
                      opacity: setupStep >= idx ? 1 : 0.4
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${setupStep > idx ? "bg-emerald-500 text-white" : setupStep === idx ? `bg-white dark:bg-zinc-900 border-2 border-emerald-500 text-emerald-500` : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"}`}
                  >
                    {setupStep > idx ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="text-center space-y-4 mb-2">
              <motion.div
                key={setupStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`inline-flex items-center justify-center p-3 rounded-2xl mb-2 ${steps[setupStep].bg} ${steps[setupStep].color}`}
              >
                {(() => {
                  const Icon = steps[setupStep].icon;
                  return <Icon className="w-8 h-8" />;
                })()}
              </motion.div>
              <CardTitle className={`text-2xl font-black uppercase tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                {steps[setupStep].title}
              </CardTitle>
              <p className={`text-sm ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                {setupStep === 0 && "Quel est le montant actuel sur votre compte bancaire principal ?"}
                {setupStep === 1 && "Prévoyez vos prélèvements fixes pour ne plus être surpris."}
                {setupStep === 2 && "Aidez le Coach IA à vous préparer les meilleurs repas."}
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-10 pt-4 px-6 md:px-10">
            <AnimatePresence mode="wait">
              {setupStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="w-full h-[400px] flex flex-col"
                >
                  <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                    <div className="relative w-full group py-6">
                      <div className={`absolute inset-0 rounded-3xl blur-xl transition-all duration-500 ${isLight ? "bg-emerald-500/10 group-focus-within:bg-emerald-500/20" : "bg-emerald-500/5 group-focus-within:bg-emerald-500/20"}`} />
                      <Input
                        type="number"
                        placeholder="0.00"
                        className={`relative text-center text-7xl md:text-8xl font-black h-40 bg-transparent border-0 w-full focus-visible:ring-0 ${isLight ? "text-slate-800 placeholder:text-slate-300" : "text-white placeholder:text-zinc-800"}`}
                        value={setupBalance}
                        onChange={(e) => setSetupBalance(e.target.value)}
                        autoFocus
                      />
                      <span className={`absolute right-4 md:right-8 top-12 md:top-14 text-4xl font-light ${isLight ? "text-slate-400" : "text-zinc-600"}`}>
                        €
                      </span>
                    </div>
                  </div>
                  <div className="pt-6 mt-auto">
                    <Button
                      onClick={() => setSetupStep(1)}
                      disabled={!setupBalance}
                      className="w-full h-16 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black rounded-2xl text-xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                    >
                      {t.next} <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {setupStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="w-full h-[400px] flex flex-col"
                >
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-5">
                        <Input
                          placeholder={t.billName + " (ex: Netflix)"}
                          className={inputStyle}
                          value={tempBill.label}
                          onChange={(e) =>
                            setTempBill({ ...tempBill, label: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-span-12 md:col-span-7 flex gap-4">
                        <Input
                          type="number"
                          placeholder={t.billAmount + " (€)"}
                          className={inputStyle}
                          value={tempBill.amount}
                          onChange={(e) =>
                            setTempBill({ ...tempBill, amount: e.target.value })
                          }
                        />
                        <Button
                          onClick={addSetupBill}
                          disabled={!tempBill.label || !tempBill.amount}
                          className={`h-14 w-14 shrink-0 rounded-2xl transition-all ${!tempBill.label || !tempBill.amount ? (isLight ? "bg-slate-200 text-slate-400" : "bg-white/5 text-white/20") : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"}`}
                        >
                          <Plus className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>

                    <div className={`rounded-2xl border ${isLight ? "border-slate-100 bg-slate-50/50" : "border-white/5 bg-black/20"} overflow-hidden`}>
                      <ScrollArea className="h-[210px] p-2">
                        {setupBills.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4 mt-10">
                            <ShieldCheck className="w-12 h-12 mb-2" />
                            <p className="text-base font-medium">Aucune charge ajoutée</p>
                          </div>
                        ) : (
                          <div className="space-y-3 p-2">
                            <AnimatePresence>
                              {setupBills.map((b, i) => (
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  key={i}
                                  className={`flex justify-between items-center p-4 rounded-2xl shadow-sm ${isLight ? "bg-white border border-slate-100" : "bg-zinc-900/50 border border-white/5"}`}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    <span className={`font-bold text-lg ${isLight ? "text-slate-700" : "text-zinc-200"}`}>{b.label}</span>
                                  </div>
                                  <span className="font-black text-emerald-500 text-xl">{b.amount}€</span>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 mt-auto">
                    <Button
                      variant="outline"
                      onClick={() => setSetupStep(0)}
                      className={`h-16 px-8 rounded-2xl text-lg font-bold border-2 ${isLight ? "border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900 hover:!text-slate-900" : "border-white/10 bg-transparent hover:bg-white/10 text-zinc-300 hover:!text-white"}`}
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={() => setSetupStep(2)}
                      className="flex-1 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black rounded-2xl text-xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                    >
                      {t.next} <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {setupStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="w-full h-[400px] flex flex-col"
                >
                  <div className="flex-1 space-y-10 flex flex-col justify-center">
                    <div className="space-y-2">
                      <label className={`text-sm font-black uppercase tracking-widest pl-2 block mb-4 ${isLight ? "text-slate-400" : "text-zinc-400"}`}>
                        Enseigne Préférée
                      </label>
                      <div className="relative">
                        <Utensils className={`absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 z-10 ${isLight ? "text-slate-400" : "text-zinc-500"}`} />
                        <Input
                          className={`${inputStyle} pl-16`}
                          value={setupProfile.supermarket}
                          onChange={(e) =>
                            setSetupProfile({
                              ...setupProfile,
                              supermarket: e.target.value,
                            })
                          }
                          placeholder="Ex: Leclerc, Lidl..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`text-sm font-black uppercase tracking-widest pl-2 block mb-4 ${isLight ? "text-slate-400" : "text-zinc-400"}`}>
                        Régime Alimentaire
                      </label>
                      <Select
                        value={setupProfile.diet}
                        onValueChange={(val) =>
                          setSetupProfile({ ...setupProfile, diet: val })
                        }
                      >
                        <SelectTrigger className={selectStyle}>
                          <SelectValue placeholder="Selectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aucun">Aucun (Tout)</SelectItem>
                          <SelectItem value="Végétarien">Végétarien</SelectItem>
                          <SelectItem value="Vegan">Vegan</SelectItem>
                          <SelectItem value="Sans Gluten">Sans Gluten</SelectItem>
                          <SelectItem value="Halal">Halal</SelectItem>
                          <SelectItem value="Cétogène">Cétogène</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 mt-auto">
                    <Button
                      variant="outline"
                      onClick={() => setSetupStep(1)}
                      className={`h-16 px-6 rounded-2xl text-lg font-bold border-2 ${isLight ? "border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900 hover:!text-slate-900" : "border-white/10 bg-transparent hover:bg-white/10 text-zinc-300 hover:!text-white"}`}
                    >
                      Retour
                    </Button>

                    <Button
                      onClick={handleFinish}
                      className="flex-1 h-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white font-black rounded-2xl text-xl transition-all hover:scale-[1.02] shadow-xl shadow-purple-500/20 group overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
                      <span className="relative flex items-center justify-center gap-2">
                        <Rocket className="w-6 h-6 animate-pulse" /> {t.start}
                      </span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
