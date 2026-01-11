import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Trash2, Target, Timer, Wallet } from "lucide-react"
import { differenceInDays } from "date-fns"

const inputStyleDark = "bg-zinc-950/60 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all h-12 rounded-xl px-4 font-medium shadow-inner";
const selectStyleDark = "w-full h-12 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50 cursor-pointer backdrop-blur-xl transition-all shadow-inner font-medium";
const cardGlassDark = "bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-2xl text-white rounded-3xl overflow-hidden hover:bg-zinc-900/50 transition-colors duration-500";

interface GoalsViewProps {
    data: any;
    goalForm: any;
    setGoalForm: (form: any) => void;
    handleAddGoal: () => void;
    handleDeleteGoal: (id: number) => void;
    language: string;
    theme: string;
}

export function GoalsView({ data, goalForm, setGoalForm, handleAddGoal, handleDeleteGoal, language, theme }: GoalsViewProps) {
    const isLight = theme === 'light';
    const cardGlass = isLight
        ? "bg-white/70 backdrop-blur-xl border-emerald-900/5 shadow-xl text-slate-800 rounded-3xl overflow-hidden hover:bg-white/80 transition-colors duration-500"
        : cardGlassDark;

    const inputStyle = isLight
        ? "bg-white border-emerald-900/10 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all h-12 rounded-xl px-4 font-medium shadow-inner"
        : inputStyleDark;

    const selectStyle = isLight
        ? "w-full h-12 px-4 rounded-xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50 cursor-pointer backdrop-blur-xl transition-all shadow-inner font-medium"
        : selectStyleDark;

    const cardTitleColor = isLight ? "text-slate-400" : "text-zinc-400";
    const labelColor = isLight ? "text-slate-500" : "text-zinc-500";
    const bigTextColor = isLight ? "text-slate-800" : "text-white";
    const infoBoxStyle = isLight ? "bg-emerald-50/50 border-emerald-900/5 text-slate-600" : "bg-black/20 border-white/5 text-zinc-400";
    const progressBg = isLight ? "bg-slate-200" : "bg-black/50";
    const trashColor = isLight ? "text-slate-400 hover:text-rose-500" : "text-zinc-600 hover:text-rose-400";

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
                <Card className={`h-fit border-0 ${cardGlass}`}>
                    <CardHeader>
                        <CardTitle className={`text-sm uppercase tracking-widest ${cardTitleColor}`}>Nouvel Objectif</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input placeholder="Nom (ex: PS5)" className={inputStyle} value={goalForm.label} onChange={(e: any) => setGoalForm({ ...goalForm, label: e.target.value })} />
                        <Input type="number" placeholder="Cible (€)" className={inputStyle} value={goalForm.target} onChange={(e: any) => setGoalForm({ ...goalForm, target: e.target.value })} />
                        <Input type="number" placeholder="Actuel (€)" className={inputStyle} value={goalForm.saved} onChange={(e: any) => setGoalForm({ ...goalForm, saved: e.target.value })} />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className={`text-xs font-bold uppercase ${labelColor}`}>Date Limite</label>
                                <Input type="date" className={inputStyle} value={goalForm.deadline} onChange={(e: any) => setGoalForm({ ...goalForm, deadline: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className={`text-xs font-bold uppercase ${labelColor}`}>Priorité</label>
                                <select className={selectStyle} value={goalForm.priority} onChange={(e: any) => setGoalForm({ ...goalForm, priority: e.target.value })}>
                                    <option value="Haute">Haute</option>
                                    <option value="Moyenne">Moyenne</option>
                                    <option value="Basse">Basse</option>
                                </select>
                            </div>
                        </div>
                        <Button onClick={handleAddGoal} className="w-full bg-indigo-600 hover:bg-indigo-500 h-14 rounded-xl font-bold text-lg mt-4">Créer</Button>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-8 space-y-4">
                {data.goals.map((g: any) => {
                    const daysRemaining = g.deadline ? differenceInDays(new Date(g.deadline), new Date()) : 999;
                    const needed = parseFloat(g.target) - parseFloat(g.saved);
                    const perMonth = daysRemaining > 0 ? (needed / (daysRemaining / 30)).toFixed(0) : 0;
                    return (
                        <Card key={g.id} className={`border-0 ${cardGlass} p-2`}>
                            <CardContent className="p-6">
                                <div className="flex justify-between mb-2">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${g.priority === 'Haute' ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                            <Target className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={`font-black text-xl ${bigTextColor}`}>{g.label}</h3>
                                            <p className={`text-xs uppercase font-bold tracking-widest ${labelColor}`}>{g.deadline ? `Pour le ${g.deadline}` : 'Pas de date'} • {g.priority}</p>
                                        </div>
                                    </div>
                                    <Trash2 className={`w-5 h-5 cursor-pointer ${trashColor}`} onClick={() => handleDeleteGoal(g.id)} />
                                </div>
                                <div className="mt-6 mb-2 flex justify-between text-sm font-bold">
                                    <span className={bigTextColor}>{g.saved}€</span>
                                    <span className={labelColor}>{g.target}€</span>
                                </div>
                                <Progress value={(g.saved / g.target) * 100} className={`h-4 rounded-full ${progressBg}`} indicatorColor={g.priority === 'Haute' ? 'bg-rose-500' : 'bg-indigo-500'} />
                                <div className={`mt-4 flex gap-4 text-xs font-medium p-3 rounded-lg border ${infoBoxStyle}`}>
                                    <div className="flex items-center gap-2">
                                        <Timer className="w-4 h-4" /> Reste {daysRemaining} jours
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Wallet className="w-4 h-4" /> Mettre {perMonth}€ / mois
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

