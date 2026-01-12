import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import { Translations } from "@/lib/i18n";
import { format, getDaysInMonth, startOfMonth, getDay } from "date-fns"
import { fr } from "date-fns/locale"
import { motion, Variants } from "framer-motion";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
};

interface RecurringViewProps {
    data: any;
    recForm: any;
    setRecForm: (form: any) => void;
    handleAddRec: () => void;
    handleDeleteRec: (id: number) => void;
    language: string;
    theme: string;
}

export function RecurringView({ data, recForm, setRecForm, handleAddRec, handleDeleteRec, language, theme }: RecurringViewProps) {
    const isLight = theme === 'light';
    const cardGlass = isLight
        ? "bg-white/70 backdrop-blur-xl border-emerald-900/5 shadow-xl text-slate-800 rounded-3xl overflow-hidden hover:bg-white/80 transition-colors duration-500"
        : "bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-2xl text-white rounded-3xl overflow-hidden hover:bg-zinc-900/50 transition-colors duration-500";

    const inputStyle = isLight
        ? "bg-white border-emerald-900/10 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all !h-14 rounded-xl px-4 font-medium shadow-inner"
        : "bg-zinc-950/60 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all !h-14 rounded-xl px-4 font-medium shadow-inner";

    const selectStyle = isLight
        ? "w-full !h-14 px-4 rounded-xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50 cursor-pointer backdrop-blur-xl transition-all shadow-inner font-medium"
        : "w-full !h-14 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50 cursor-pointer backdrop-blur-xl transition-all shadow-inner font-medium";

    const today = new Date();
    const currentMonthDays = getDaysInMonth(today);
    const firstDayOfMonth = getDay(startOfMonth(today));
    const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;


    const t = Translations[language as keyof typeof Translations] || Translations.fr;
    const locale = (language === 'es' ? undefined : fr);

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 space-y-8">
                <motion.div variants={item}><Card className={`h-fit border-0 ${cardGlass}`}><CardHeader><CardTitle className="text-sm uppercase tracking-widest text-zinc-400">{t.recurring.newRec}</CardTitle></CardHeader><CardContent className="space-y-4"><Input placeholder={t.recurring.labelPlace} className={inputStyle} value={recForm.label} onChange={(e: any) => setRecForm({ ...recForm, label: e.target.value })} /><Input type="number" placeholder={t.recurring.amountPlace} className={inputStyle} value={recForm.amount} onChange={(e: any) => setRecForm({ ...recForm, amount: e.target.value })} /><div className="grid grid-cols-2 gap-2"><Input type="number" placeholder={t.recurring.dayPlace} className={inputStyle} value={recForm.day} onChange={(e: any) => setRecForm({ ...recForm, day: e.target.value })} />
                    <Select value={recForm.type} onValueChange={(val) => setRecForm({ ...recForm, type: val })}>
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Fixe">{t.recurring.fixe}</SelectItem>
                            <SelectItem value="Abonnement">{t.recurring.sub}</SelectItem>
                        </SelectContent>
                    </Select>
                </div><Button onClick={handleAddRec} className="w-full bg-purple-600 hover:bg-purple-500 h-14 rounded-xl font-bold">{t.recurring.add}</Button></CardContent></Card></motion.div>
                <motion.div variants={item}><Card className={`border-0 ${cardGlass}`}><CardHeader><CardTitle className="text-sm uppercase text-zinc-400">{t.recurring.total}</CardTitle></CardHeader><CardContent><div className="text-4xl font-black">{parseFloat(data?.monthly_burn || 0).toFixed(2)}€</div><p className="text-xs text-zinc-500 mt-2">{t.recurring.subtitle}</p></CardContent></Card></motion.div>
            </div>

            <div className="md:col-span-8">
                <motion.div variants={item} className="h-full">
                    <Card className={`border-0 ${cardGlass} h-full`}><CardHeader className="flex flex-row justify-between items-center"><CardTitle className={`text-xl uppercase font-black tracking-widest ${isLight ? 'text-slate-400' : 'text-zinc-200'}`}>{t.sidebar.recurring}</CardTitle><Badge className={isLight ? "bg-emerald-600/10 text-emerald-800" : "bg-white/10 text-white px-3 py-1"}>{format(today, 'MMMM yyyy', { locale: locale })}</Badge></CardHeader><CardContent>
                        <div className="overflow-x-auto pb-2">
                            <div className={`min-w-[700px] grid grid-cols-7 gap-1 p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-emerald-900/5' : 'bg-black/20 border-white/5'}`}>
                                {t.recurring.weekDays.map((d: string, i: number) => <div key={i} className={`p-2 text-center text-xs font-black ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>{d}</div>)}
                                {Array.from({ length: offset }).map((_, i) => (<div key={`e-${i}`} className="h-24"></div>))}
                                {Array.from({ length: currentMonthDays }).map((_, i) => {
                                    const dayNum = i + 1;
                                    const isToday = dayNum === today.getDate();
                                    const bills = (data?.recurring || []).filter((r: any) => r.day === dayNum);

                                    const dayBg = isLight
                                        ? (isToday ? 'bg-purple-100 border-purple-200' : 'bg-white border-slate-200 hover:bg-slate-100')
                                        : (isToday ? 'bg-purple-500/10 border-purple-500/30' : 'bg-black/20 hover:bg-white/5 border-white/5');

                                    const numColor = isLight
                                        ? (isToday ? 'text-purple-700' : 'text-slate-400 group-hover:text-slate-600')
                                        : (isToday ? 'text-purple-300' : 'text-zinc-500 group-hover:text-zinc-300');

                                    const billStyle = isLight
                                        ? "bg-slate-100 text-slate-700 border-slate-200"
                                        : "bg-white/5 text-white border-white/5";

                                    return (
                                        <div key={dayNum} className={`h-24 p-2 relative rounded-xl border transition-all group flex flex-col gap-1 ${dayBg}`}>
                                            <span className={`text-sm font-bold ${numColor}`}>{dayNum}</span>
                                            <div className="flex flex-col gap-1">
                                                {bills.map((b: any) => (
                                                    <div key={b.id} className={`flex justify-between items-center px-2 py-1 rounded text-[10px] border ${billStyle}`}>
                                                        <span className="truncate w-12">{b.label}</span>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-bold">{parseFloat(b.amount).toFixed(2)}</span>
                                                            <Trash2 className={`w-3 h-3 cursor-pointer ${isLight ? 'text-slate-400 hover:text-rose-500' : 'text-zinc-600 hover:text-rose-400'}`} onClick={() => handleDeleteRec(b.id)} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </CardContent></Card>
                </motion.div>
            </div>
        </motion.div >
    )
}
