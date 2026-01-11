import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Wallet, Zap, TrendingUp } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardViewProps {
    data: any;
    barData: any[];
    COLORS: string[];
    language: string;
    theme: string;
    statsData: any;
    years: string[];
    statsYear: string;
    setStatsYear: (y: string) => void;
    t: any;
}

export function DashboardView({ data, barData, COLORS, language, theme, statsData, years, statsYear, setStatsYear, t }: DashboardViewProps) {
    const isLight = theme === 'light';
    const cardGlass = isLight
        ? "bg-white/70 backdrop-blur-xl border-emerald-900/5 shadow-xl text-slate-800 rounded-3xl overflow-hidden hover:bg-white/80 transition-colors duration-500"
        : "bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-2xl text-white rounded-3xl overflow-hidden hover:bg-zinc-900/50 transition-colors duration-500";

    const cardTitleColor = isLight ? "text-slate-400" : "text-zinc-400";
    const bigNumberColor = isLight ? "text-slate-800" : "text-white";
    const subTextColor = isLight ? "text-slate-500" : "text-zinc-500";
    const pillBg = isLight ? "bg-white border-emerald-900/10 shadow-sm" : "bg-black/40 border-white/5";
    const pillText = isLight ? "text-slate-700" : "text-white";
    const itemBg = isLight ? "bg-white border-emerald-900/5 hover:bg-emerald-50/50" : "bg-white/5 border-white/5 hover:bg-white/10";
    const chartGrid = isLight ? "#e2e8f0" : "#333";
    const chartText = isLight ? "#64748b" : "#666";

    const annualData = statsData?.monthly_data || [];

    // Date Logic
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRemaining = Math.max(1, daysInMonth - today.getDate() + 1); // +1 to include today
    const perDay = data.balance / daysRemaining;

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div></div>
                <div className={`p-1 rounded-xl flex gap-1 ${isLight ? 'bg-white/50 border border-emerald-900/10' : 'bg-black/40 border border-white/10'}`}>
                    {years.map(y => (
                        <button
                            key={y}
                            onClick={() => setStatsYear(y)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statsYear === y ? (isLight ? 'bg-emerald-500 text-white shadow-lg' : 'bg-zinc-800 text-white shadow-lg') : (isLight ? 'text-slate-500 hover:text-emerald-600' : 'text-zinc-500 hover:text-white')}`}
                        >
                            {y}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className={`md:col-span-2 relative border-0 ${cardGlass} min-h-[320px] flex flex-col justify-between`}>
                    <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none mix-blend-screen ${isLight ? 'bg-emerald-500/10' : 'bg-emerald-500/20'}`}></div>
                    <CardHeader>
                        <CardTitle className={`${cardTitleColor} text-sm uppercase font-bold tracking-[0.3em]`}>{t.netBalance} ({t.annual} {statsYear})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-6xl md:text-8xl font-black tracking-tighter ${bigNumberColor}`}>{statsData ? statsData.net_result.toFixed(2) : '...'}</span>
                            <span className="text-3xl text-emerald-400 font-thin">€</span>
                        </div>
                        <div className="mt-8 flex flex-col md:flex-row gap-4 text-sm font-bold">
                            <div className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${pillBg} ${pillText}`}>
                                <TrendingUp className="w-5 h-5 text-emerald-500" /> {t.incoming}: {statsData ? statsData.total_income.toFixed(2) : 0}€
                            </div>
                            <div className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${pillBg} ${pillText}`}>
                                <Zap className="w-5 h-5 text-rose-500" /> {t.outgoing}: {statsData ? statsData.total_expense.toFixed(2) : 0}€
                            </div>
                            <div className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${pillBg} ${statsData && statsData.net_result >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                <Wallet className="w-5 h-5" /> {t.balance}: {statsData && statsData.net_result >= 0 ? t.surplus : t.deficit}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={`border-0 flex flex-col justify-center gap-10 p-10 ${cardGlass}`}>
                    <div className="flex justify-between items-end">
                        <span className={`${cardTitleColor} text-sm font-bold uppercase tracking-widest`}>{t.perDay} ({daysRemaining}{t.daysLeft})</span>
                        <span className="text-5xl font-thin text-cyan-300 tracking-tighter">{perDay.toFixed(2)}€</span>
                    </div>
                    <div className="space-y-3">
                        <Progress value={Math.min((perDay / 20) * 100, 100)} className={`h-3 rounded-full ${isLight ? 'bg-slate-200' : 'bg-black/50'}`} indicatorColor="bg-cyan-500" />
                        <div className={`flex justify-between text-xs uppercase font-black tracking-widest ${subTextColor}`}><span>0€</span><span>{t.target}: 20€</span></div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className={`border-0 ${cardGlass} h-[400px]`}>
                    <CardHeader>
                        <CardTitle className={`text-xs uppercase tracking-[0.2em] font-bold ${subTextColor}`}>{t.evolution} {statsYear}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {statsData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={annualData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
                                    <XAxis dataKey="month" stroke={chartText} fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke={chartText} fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: isLight ? '#fff' : '#000', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: isLight ? '#1e293b' : '#fff' }} />
                                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name={t.incoming} />
                                    <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name={t.outgoing} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className={`h-full flex items-center justify-center ${subTextColor}`}>{t.loading}</div>}
                    </CardContent>
                </Card>
                <Card className={`border-0 ${cardGlass} h-[400px]`}>
                    <CardHeader>
                        <CardTitle className={`text-xs uppercase tracking-[0.2em] font-bold ${subTextColor}`}>{t.activities}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-3">
                                {data.transactions.slice(0, 5).map((tx: any) => (
                                    <div key={tx.id} className={`flex justify-between items-center p-5 rounded-2xl border transition-all ${itemBg}`}>
                                        <div className="flex items-center gap-5">
                                            <div className={`p-3 rounded-xl ${tx.type === 'revenu' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className={`font-bold text-lg ${bigNumberColor}`}>{tx.label}</div>
                                                <div className={`text-xs uppercase font-bold tracking-wider ${subTextColor}`}>{tx.date} • {tx.category}</div>
                                            </div>
                                        </div>
                                        <span className={`font-mono text-xl font-bold ${tx.type === 'revenu' ? 'text-emerald-500' : 'text-rose-500'}`}>{tx.type === 'revenu' ? '+' : '-'}{tx.amount}€</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
