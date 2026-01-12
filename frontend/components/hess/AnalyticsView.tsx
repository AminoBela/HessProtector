import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, TrendingUp, TrendingDown, Wallet, PiggyBank, Sparkles } from "lucide-react"
import { Translations } from "@/lib/i18n";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { useAuth } from "@/hooks/useAuth";

interface AnalyticsViewProps {
    language: string;
    theme: string;
    activeTab?: string;
}

export function AnalyticsView({ language, theme, activeTab }: AnalyticsViewProps) {
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    // Audit State
    const [audit, setAudit] = useState<string | null>(null);
    const [auditLoading, setAuditLoading] = useState(false);

    const isLight = theme === 'light';
    const cardGlass = isLight
        ? "bg-white/70 backdrop-blur-xl border-emerald-900/5 shadow-xl text-slate-800 rounded-3xl overflow-hidden hover:bg-white/80 transition-colors duration-500"
        : "bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-2xl text-white rounded-3xl overflow-hidden hover:bg-zinc-900/50 transition-colors duration-500";

    const selectStyle = isLight
        ? "w-32 h-10 px-4 rounded-xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50"
        : "w-32 h-10 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50";

    const t = Translations[language as keyof typeof Translations] || Translations.fr;

    // Fetch Data
    useEffect(() => {
        if (token) fetchAnalytics();
    }, [year, month, token]);

    const fetchAnalytics = async () => {
        setLoading(true);
        setAudit(null); // Reset audit when date changes
        try {
            const res = await fetch(`http://localhost:8000/api/analytics/monthly?year=${year}&month=${month}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const runAudit = async () => {
        if (!token) return;
        setAuditLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/analytics/audit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ year, month, language })
            });
            if (res.ok) {
                const json = await res.json();
                setAudit(json.analysis);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setAuditLoading(false);
        }
    }

    // Chart Colors
    const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

    if (!data) return <div className="p-10 text-center animate-pulse">{t.common.loading}...</div>;

    const stats = data?.stats || { income: 0, expense: 0, net: 0, savings_rate: 0 };
    const daily_data = data?.daily_data || [];
    const category_data = data?.category_data || [];
    const top_expenses = data?.top_expenses || [];

    return (
        <div className="space-y-8 pb-20">
            {/* Header / Selectors */}
            <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
                <div className="flex gap-4">
                    <Select value={month} onValueChange={setMonth}>
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="Mois" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <SelectItem key={m} value={m.toString()}>{m.toString().padStart(2, '0')}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="Année" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2026">2026</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={runAudit} disabled={auditLoading} className={`h-10 px-6 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105 ${isLight ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-400 text-white'}`}>
                        {auditLoading ? <Sparkles className="animate-spin w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        {t.audit?.button || (language === 'fr' ? "Audit" : "Audit")}
                    </Button>
                </div>
            </div>

            {/* AUDIT SECTION */}
            {audit && (
                <Card className={`border-0 ${cardGlass} border-l-4 border-l-indigo-500 overflow-hidden`}>
                    <CardHeader className={`border-b ${isLight ? 'border-indigo-100 bg-indigo-50/50' : 'border-white/5 bg-white/5'}`}>
                        <CardTitle className="flex items-center gap-2 text-indigo-500 text-lg font-bold uppercase tracking-wider">
                            <Sparkles className="w-5 h-5 fill-indigo-500" />
                            {t.audit?.title || (language === 'fr' ? "Analyse du Coach" : "Análisis del Coach")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className={`space-y-4 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                            {audit.split('\n').map((line, i) => {
                                // Headlines (##)
                                if (line.startsWith('## ')) return <h3 key={i} className={`text-xl font-black mt-6 mb-2 ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`}>{line.replace('## ', '')}</h3>;
                                // Sub-headlines (###)
                                if (line.startsWith('### ')) return <h4 key={i} className={`text-lg font-bold mt-4 mb-2 ${isLight ? 'text-slate-800' : 'text-white'}`}>{line.replace('### ', '')}</h4>;
                                // Bullet points
                                if (line.trim().startsWith('- ')) return (
                                    <li key={i} className="ml-4 list-none flex items-start gap-2">
                                        <span className="text-indigo-500 mt-1.5">•</span>
                                        <span dangerouslySetInnerHTML={{ __html: line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></span>
                                    </li>
                                );
                                // Bold Text handling for normal lines
                                return <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} className="leading-relaxed"></p>;
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className={`border-0 ${cardGlass} p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform`}>
                    <div><p className="text-xs font-bold uppercase text-emerald-500 mb-1 tracking-wider">Revenus</p><p className="text-3xl font-black">{stats.income.toFixed(2)}€</p></div>
                    <TrendingUp className="w-10 h-10 text-emerald-500/20 self-end" />
                </Card>
                <Card className={`border-0 ${cardGlass} p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform`}>
                    <div><p className="text-xs font-bold uppercase text-rose-500 mb-1 tracking-wider">Dépenses</p><p className="text-3xl font-black">{stats.expense.toFixed(2)}€</p></div>
                    <TrendingDown className="w-10 h-10 text-rose-500/20 self-end" />
                </Card>
                <Card className={`border-0 ${cardGlass} p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform`}>
                    <div><p className="text-xs font-bold uppercase text-blue-500 mb-1 tracking-wider">Net</p><p className={`text-3xl font-black ${stats.net >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{stats.net.toFixed(2)}€</p></div>
                    <Wallet className="w-10 h-10 text-blue-500/20 self-end" />
                </Card>
                <Card className={`border-0 ${cardGlass} p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform`}>
                    <div><p className="text-xs font-bold uppercase text-purple-500 mb-1 tracking-wider">Épargne</p><p className="text-3xl font-black">{stats.savings_rate.toFixed(1)}%</p></div>
                    <PiggyBank className="w-10 h-10 text-purple-500/20 self-end" />
                </Card>
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* DAILY EVOLUTION */}
                <Card className={`border-0 ${cardGlass} h-[400px]`}>
                    <CardHeader><CardTitle className="text-sm uppercase tracking-widest opacity-50">Évolution Journalière</CardTitle></CardHeader>
                    <CardContent className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={daily_data}>
                                <defs>
                                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient>
                                </defs>
                                <XAxis dataKey="day" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}€`} />
                                <Tooltip contentStyle={{ backgroundColor: isLight ? '#ffffff' : '#18181b', borderRadius: '12px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }} />
                                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorInc)" strokeWidth={3} />
                                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExp)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* CATEGORIES PIE */}
                <Card className={`border-0 ${cardGlass} min-h-[400px]`}>
                    <CardHeader><CardTitle className="text-sm uppercase tracking-widest opacity-50">Par Catégorie</CardTitle></CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={category_data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {category_data.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: isLight ? '#ffffff' : '#18181b', borderRadius: '12px', border: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4 justify-center">
                            {category_data.map((entry: any, index: number) => (
                                <div key={entry.name} className="flex items-center gap-1 text-xs font-bold opacity-70">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* TOP EXPENSES */}
            <Card className={`border-0 ${cardGlass}`}>
                <CardHeader><CardTitle className="text-sm uppercase tracking-widest opacity-50">Top Dépenses</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                        {top_expenses.map((t: any, i: number) => (
                            <div key={i} className={`flex justify-between items-center p-4 rounded-xl ${isLight ? 'bg-white/50 border border-emerald-900/5' : 'bg-white/5 border border-white/5'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="font-bold text-lg">{i + 1}.</div>
                                    <div>
                                        <div className="font-bold">{t.label}</div>
                                        <div className="text-xs opacity-50">{t.date}</div>
                                    </div>
                                </div>
                                <div className="font-black text-rose-500">-{t.amount.toFixed(2)}€</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
