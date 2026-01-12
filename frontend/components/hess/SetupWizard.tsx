import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShieldCheck, ArrowRight, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Translations } from "@/lib/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SetupWizardProps {
    onFinish: (data: any) => void;
    bg: React.ReactNode;
}

export function SetupWizard({ onFinish, bg }: SetupWizardProps) {
    const [setupStep, setSetupStep] = useState(0)
    const [setupBalance, setSetupBalance] = useState("")
    const [setupBills, setSetupBills] = useState<any[]>([])
    const [setupProfile, setSetupProfile] = useState({ supermarket: "Lidl", diet: "Aucun" })
    const [tempBill, setTempBill] = useState({ label: "", amount: "", day: "", type: "Fixe" })


    const t = Translations.fr.setup;

    const inputStyle = "bg-zinc-950/60 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all h-12 rounded-xl px-4 font-medium shadow-inner";
    const selectStyle = "w-full h-12 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50 cursor-pointer backdrop-blur-xl transition-all shadow-inner font-medium";

    const addSetupBill = () => {
        if (!tempBill.label || !tempBill.amount) return;
        setSetupBills([...setupBills, { ...tempBill, amount: parseFloat(tempBill.amount), day: parseInt(tempBill.day) || 1 }]);
        setTempBill({ label: "", amount: "", day: "", type: "Fixe" })
    }

    const handleFinish = () => {
        onFinish({ balance: parseFloat(setupBalance), bills: setupBills, ...setupProfile });
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 text-white font-sans relative overflow-hidden">{bg}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
                <Card className="bg-zinc-950/80 backdrop-blur-3xl border-white/10 shadow-2xl rounded-3xl overflow-hidden">
                    <CardHeader className="pt-10 pb-2"><div className="flex justify-center mb-4"><ShieldCheck className="w-12 h-12 text-emerald-400" /></div><CardTitle className="text-center text-3xl font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">{setupStep === 0 ? t.step1 : setupStep === 1 ? t.step2 : t.step3}</CardTitle></CardHeader>
                    <CardContent className="space-y-8 p-10">
                        {setupStep === 0 && (<div className="text-center space-y-6"><div className="relative w-full"><Input type="number" placeholder="0" className="text-center text-6xl font-black h-24 bg-transparent border-none text-white w-full focus-visible:ring-0 placeholder:text-zinc-800" value={setupBalance} onChange={e => setSetupBalance(e.target.value)} autoFocus /><span className="absolute right-10 top-6 text-zinc-600 text-3xl font-light">€</span></div><Button onClick={() => setSetupStep(1)} disabled={!setupBalance} className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl text-lg">{t.next} <ArrowRight className="ml-2 w-5 h-5" /></Button></div>)}
                        {setupStep === 1 && (<div className="space-y-6"><div className="grid grid-cols-2 gap-3"><Input placeholder={t.billName} className={inputStyle} value={tempBill.label} onChange={e => setTempBill({ ...tempBill, label: e.target.value })} /><div className="flex gap-2"><Input type="number" placeholder={t.billAmount} className={inputStyle} value={tempBill.amount} onChange={e => setTempBill({ ...tempBill, amount: e.target.value })} /><Button onClick={addSetupBill} className="h-12 w-12 bg-emerald-600 hover:bg-emerald-500 rounded-xl"><Plus /></Button></div></div><ScrollArea className="h-40 rounded-xl border border-white/5 bg-black/20 p-2">{setupBills.map((b, i) => (<div key={i} className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-lg mb-2 last:mb-0"><span className="font-bold">{b.label}</span><span className="text-emerald-400">{b.amount}€</span></div>))}</ScrollArea><Button onClick={() => setSetupStep(2)} className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl text-lg">{t.next}</Button></div>)}
                        {setupStep === 2 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-400 uppercase">Supermarché</label>
                                    <Input
                                        className={inputStyle}
                                        value={setupProfile.supermarket}
                                        onChange={e => setSetupProfile({ ...setupProfile, supermarket: e.target.value })}
                                        placeholder="Ex: Leclerc, Lidl..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-400 uppercase">Régime</label>
                                    <Select value={setupProfile.diet} onValueChange={val => setSetupProfile({ ...setupProfile, diet: val })}>
                                        <SelectTrigger className={selectStyle}>
                                            <SelectValue placeholder="Selectionner..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                            <SelectItem value="Aucun">Aucun (Tout)</SelectItem>
                                            <SelectItem value="Végétarien">Végétarien</SelectItem>
                                            <SelectItem value="Vegan">Vegan</SelectItem>
                                            <SelectItem value="Sans Gluten">Sans Gluten</SelectItem>
                                            <SelectItem value="Halal">Halal</SelectItem>
                                            <SelectItem value="Cétogène">Cétogène</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleFinish} className="w-full h-14 bg-emerald-500 text-white hover:bg-emerald-400 font-black rounded-2xl text-xl animate-pulse">{t.start}</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
