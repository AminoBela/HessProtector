import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, ArrowRight, Plus, Rocket, Utensils, Coins, CheckCircle2, Wallet, X } from "lucide-react";
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
    ? "bg-white/80 backdrop-blur-3xl border-white/50 shadow-2xl shadow-emerald-500/10"
    : "bg-zinc-950/80 backdrop-blur-3xl border-white/10 shadow-2xl shadow-black/60";

  const inputStyle = isLight
    ? "bg-white border-emerald-900/10 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-[border-color,box-shadow] !h-16 rounded-2xl px-6 text-xl font-medium shadow-sm"
    : "bg-zinc-900/80 border-white/10 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-[border-color,box-shadow] !h-16 rounded-2xl px-6 text-xl font-medium shadow-inner";

  const selectStyle = isLight
    ? "w-full !h-16 px-6 rounded-2xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm font-medium text-xl flex items-center"
    : "w-full !h-16 px-6 rounded-2xl border border-white/10 bg-zinc-900/80 text-white focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner font-medium text-xl flex items-center";

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

  const removeBill = (index: number) => {
    setSetupBills(setupBills.filter((_, i) => i !== index));
  };

  const handleFinish = () => {
    onFinish({
      balance: parseFloat(setupBalance),
      bills: setupBills,
      ...setupProfile,
    });
  };

  const steps = [
    { id: 0, title: t.step1, icon: Coins, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 1, title: t.step2, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: 2, title: t.step3, icon: Utensils, color: "text-amber-500", bg: "bg-amber-500/10" }
  ];

  const totalBills = setupBills.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = parseFloat(setupBalance || "0") - totalBills;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center font-sans overflow-hidden ${isLight ? "bg-slate-50 text-slate-800" : "bg-zinc-950 text-white"}`}>
      <div className="absolute inset-0 z-0">
        {bg}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
        className="relative z-10 flex w-full h-screen"
      >
        {/* Left Side: Summary Panel (Hidden on mobile) */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl bg-gradient-to-br from-emerald-400 to-cyan-500">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <span className={`text-4xl font-black tracking-tighter ${isLight ? "text-slate-900" : "text-white"}`}>
              Hess<span className="text-emerald-500">Protector</span>
            </span>
          </div>

          <div className="flex-1 max-w-lg mt-10">
            <h1 className={`text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] mb-8 ${isLight ? "text-slate-900" : "text-white"}`}>
              Configuration <br /> Initiale
            </h1>

            <div className="space-y-10 relative z-10">
              <div className="space-y-2">
                <p className={`text-sm font-bold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-zinc-500"}`}>Solde Initial</p>
                <div className="flex items-end gap-2">
                  <span className={`text-5xl font-black ${setupBalance ? (isLight ? "text-slate-800" : "text-white") : (isLight ? "text-slate-300" : "text-zinc-700")}`}>
                    {setupBalance ? parseFloat(setupBalance).toFixed(2) : "0.00"}
                  </span>
                  <span className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-400" : "text-zinc-500"}`}>€</span>
                </div>
              </div>

              <div className="space-y-2 w-full max-w-md">
                <div className="flex justify-between items-center">
                  <p className={`text-sm font-bold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-zinc-500"}`}>Prélèvements ({setupBills.length})</p>
                  <span className="text-2xl font-black text-rose-500">-{totalBills.toFixed(2)} €</span>
                </div>
                {setupBills.length > 0 && (
                  <div className={`h-2 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-white/5"}`}>
                    <motion.div
                      className="h-full bg-rose-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((totalBills / (parseFloat(setupBalance) || 1)) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className={`text-sm font-bold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-zinc-500"}`}>Reste à vivre (Mois)</p>
                <div className="flex items-end gap-2">
                  <span className={`text-5xl font-black ${remainingBudget > 0 ? "text-emerald-500" : (remainingBudget < 0 ? "text-rose-500" : (isLight ? "text-slate-300" : "text-zinc-700"))}`}>
                    {setupBalance ? remainingBudget.toFixed(2) : "0.00"}
                  </span>
                  <span className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-400" : "text-zinc-500"}`}>€</span>
                </div>
              </div>

              {setupStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`space-y-4 pt-8 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}
                >
                  <p className={`text-sm font-bold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-zinc-500"}`}>Préférences Coach</p>
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${isLight ? "bg-slate-200 text-slate-500" : "bg-white/5 text-zinc-400"}`}>
                      <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`text-xl font-bold ${isLight ? "text-slate-700" : "text-zinc-300"}`}>{setupProfile.supermarket || "Non défini"}</p>
                      <p className={`text-sm uppercase font-bold tracking-widest ${isLight ? "text-slate-400" : "text-zinc-500"}`}>{setupProfile.diet}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Step Progress indicators */}
          <div className="flex gap-4 mt-auto w-full max-w-sm">
            {steps.map(step => (
              <div key={step.id} className={`h-2 flex-1 rounded-full transition-colors duration-500 ${setupStep >= step.id ? "bg-emerald-500" : (isLight ? "bg-slate-300" : "bg-white/10")}`} />
            ))}
          </div>
        </div>

        {/* Right Side: Glass Form Panel */}
        <div className={`w-full lg:w-[500px] xl:w-[600px] flex flex-col justify-center min-h-screen p-8 sm:p-12 lg:p-16 shadow-2xl overflow-y-auto ${isLight ? "bg-white/80 border-l border-white/50 backdrop-blur-2xl" : "bg-zinc-950/80 border-l border-white/10 backdrop-blur-2xl"}`}>

          {/* Mobile Header (Hidden on Desktop) */}
          <div className="flex lg:hidden items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-emerald-400 to-cyan-500">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl md:text-3xl font-black tracking-tighter ${isLight ? "text-slate-900" : "text-white"}`}>
              Hess<span className="text-emerald-500">Protector</span>
            </span>
          </div>

          <div className="w-full flex-1 flex flex-col">
            <div className="pb-8">
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  key={setupStep}
                  initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${steps[setupStep].bg} ${steps[setupStep].color}`}
                >
                  {(() => {
                    const Icon = steps[setupStep].icon;
                    return <Icon className="w-8 h-8" />;
                  })()}
                </motion.div>
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-widest mb-1 ${steps[setupStep].color}`}>
                    Étape {setupStep + 1} de 3
                  </h3>
                  <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                    {steps[setupStep].title}
                  </h2>
                </div>
              </div>
              <p className={`text-lg md:text-xl font-medium mt-4 ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                {setupStep === 0 && "Entrez le montant exact de votre solde bancaire aujourd'hui. HessProtector l'utilisera comme point de départ."}
                {setupStep === 1 && "Entrez vos charges fixes mensuelles (loyer, factures, abonnements) pour calculer votre véritable budget vital."}
                {setupStep === 2 && "Dites au Coach IA où vous faites vos courses et s'il doit adapter ses recettes."}
              </p>
            </div>

            <div className="px-8 md:px-12 flex-1 flex flex-col pt-0 pb-10">
              <AnimatePresence mode="wait">
                {/* STEP 0: BALANCE */}
                {setupStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="relative w-full max-w-lg group py-12">
                        <div className={`absolute inset-0 rounded-3xl blur-2xl transition-all duration-500 ${isLight ? "bg-emerald-500/10 group-focus-within:bg-emerald-500/20" : "bg-emerald-500/10 group-focus-within:bg-emerald-500/30"}`} />
                        <Input
                          type="number"
                          placeholder="0.00"
                          className={`relative text-center text-7xl md:text-8xl font-black h-48 bg-transparent border-0 w-full focus-visible:ring-0 placeholder:opacity-50 ${isLight ? "text-slate-800" : "text-white"}`}
                          value={setupBalance}
                          onChange={(e) => setSetupBalance(e.target.value)}
                          autoFocus
                        />
                        <span className={`absolute right-4 md:right-12 top-20 md:top-24 text-4xl font-light ${isLight ? "text-slate-400" : "text-zinc-600"}`}>
                          €
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 1: BILLS */}
                {setupStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex-1 space-y-6 flex flex-col">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 lg:col-span-5">
                          <Input
                            placeholder={t.billName + " (ex: Loyer)"}
                            className={inputStyle}
                            value={tempBill.label}
                            onChange={(e) =>
                              setTempBill({ ...tempBill, label: e.target.value })
                            }
                          />
                        </div>
                        <div className="col-span-12 lg:col-span-7 flex gap-4">
                          <Input
                            type="number"
                            placeholder={t.billAmount + " (€)"}
                            className={inputStyle}
                            value={tempBill.amount}
                            onChange={(e) =>
                              setTempBill({ ...tempBill, amount: e.target.value })
                            }
                            onKeyDown={(e) => e.key === "Enter" && addSetupBill()}
                          />
                          <Button
                            onClick={addSetupBill}
                            disabled={!tempBill.label || !tempBill.amount}
                            className={`h-16 w-16 shrink-0 rounded-2xl transition-all ${!tempBill.label || !tempBill.amount ? (isLight ? "bg-slate-200 text-slate-400" : "bg-white/5 text-white/20") : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"}`}
                          >
                            <Plus className="w-8 h-8" />
                          </Button>
                        </div>
                      </div>

                      <div className={`flex-1 rounded-2xl border ${isLight ? "border-slate-100 bg-slate-50/50" : "border-white/5 bg-black/20"} overflow-hidden flex flex-col min-h-[250px]`}>
                        <ScrollArea className="flex-1 p-2">
                          {setupBills.length === 0 ? (
                            <div className="h-[200px] flex flex-col items-center justify-center opacity-50 space-y-4">
                              <Wallet className="w-16 h-16 mb-2 opacity-50" />
                              <p className="text-xl font-bold">Aucune dépense fixe ajoutée</p>
                            </div>
                          ) : (
                            <div className="space-y-3 p-2">
                              <AnimatePresence>
                                {setupBills.map((b, i) => (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    key={i}
                                    className={`flex justify-between items-center p-5 rounded-2xl shadow-sm group ${isLight ? "bg-white border border-slate-100" : "bg-zinc-900 border border-white/5"}`}
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="w-4 h-4 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                                      <span className={`font-bold text-xl ${isLight ? "text-slate-700" : "text-zinc-200"}`}>{b.label}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                      <span className="font-black text-rose-500 text-2xl">-{b.amount}€</span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeBill(i)}
                                        className={`rounded-xl opacity-0 group-hover:opacity-100 transition-opacity ${isLight ? "hover:bg-rose-100 hover:text-rose-600" : "hover:bg-rose-950 hover:text-rose-400"}`}
                                      >
                                        <X className="w-5 h-5" />
                                      </Button>
                                    </div>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: PROFILE */}
                {setupStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col justify-center"
                  >
                    <div className="space-y-10 max-w-xl mx-auto w-full">
                      <div className="space-y-4">
                        <label className={`text-sm font-black uppercase tracking-widest pl-2 block ${isLight ? "text-slate-400" : "text-zinc-400"}`}>
                          Enseigne Préférée
                        </label>
                        <div className="relative">
                          <Utensils className={`absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 z-10 ${isLight ? "text-slate-400" : "text-zinc-500"}`} />
                          <Input
                            className={`${inputStyle} pl-16 text-xl`}
                            value={setupProfile.supermarket}
                            onChange={(e) =>
                              setSetupProfile({
                                ...setupProfile,
                                supermarket: e.target.value,
                              })
                            }
                            placeholder="Ex: Leclerc, Lidl, Carrefour..."
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className={`text-sm font-black uppercase tracking-widest pl-2 block ${isLight ? "text-slate-400" : "text-zinc-400"}`}>
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
                          <SelectContent className={`border-0 shadow-2xl rounded-2xl ${isLight ? "bg-white" : "bg-zinc-900 text-white"}`}>
                            {["Aucun", "Végétarien", "Vegan", "Sans Gluten", "Halal", "Cétogène"].map(diet => (
                              <SelectItem key={diet} value={diet} className="text-lg py-3 rounded-xl mx-2 cursor-pointer">{diet}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* BOTTOM NAVIGATION BUTTONS */}
              <div className="flex flex-col gap-3 pt-6 mt-auto border-t border-white/5">
                <Button
                  onClick={() => {
                    if (setupStep === 2) handleFinish();
                    else setSetupStep(setupStep + 1);
                  }}
                  disabled={setupStep === 0 && !setupBalance}
                  className={`w-full h-16 rounded-2xl text-xl font-black transition-all shadow-xl flex items-center justify-center gap-3 overflow-hidden relative group
                      ${setupStep === 2
                      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white shadow-purple-500/20"
                      : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/20"
                    }
                      ${setupStep === 0 && !setupBalance ? "!opacity-50 !grayscale pointer-events-none" : "hover:scale-[1.02]"}
                    `}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
                  <span className="relative flex items-center justify-center gap-3">
                    {setupStep === 2 ? (
                      <><Rocket className="w-6 h-6 animate-pulse" /> {t.start}</>
                    ) : (
                      <>{t.next} <ArrowRight className="w-6 h-6" /></>
                    )}
                  </span>
                </Button>

                <AnimatePresence>
                  {setupStep > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="w-full flex justify-center overflow-hidden"
                    >
                      <Button
                        variant="ghost"
                        onClick={() => setSetupStep(Math.max(0, setupStep - 1))}
                        className={`w-full h-14 rounded-2xl text-lg font-bold border-0 ${isLight ? "bg-transparent hover:bg-slate-100 text-slate-500 hover:!text-slate-900" : "bg-transparent hover:bg-white/5 text-zinc-400 hover:!text-white"}`}
                      >
                        Retour
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
