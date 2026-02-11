import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bot,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Sparkles,
  Check,
  Quote,
  ArrowUp,
  ArrowDown,
  Tag,
} from "lucide-react";
import { motion } from "framer-motion";
import { Translations } from "@/lib/i18n";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { usePrivacy } from "@/context/PrivacyContext";
import { container, item } from "@/lib/animations";

interface AnalyticsViewProps {
  language: string;
  theme: string;
  activeTab?: string;
}

interface AuditResponse {
  score: number;
  title: string;
  roast: string;
  pros: string[];
  cons: string[];
  tips: { icon: string; tip: string }[];
}

export function AnalyticsView({
  language,
  theme,
  activeTab,
}: AnalyticsViewProps) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { isBlurred } = usePrivacy();

  const [audit, setAudit] = useState<AuditResponse | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  const isLight = theme === "light";
  const cardGlass = isLight
    ? "card-glass card-glass-light"
    : "card-glass card-glass-dark";

  const solidCard = isLight
    ? "bg-white/90 shadow-md rounded-3xl overflow-hidden"
    : "bg-zinc-900/60 shadow-lg rounded-3xl overflow-hidden";

  const selectStyle = isLight
    ? "w-32 h-10 px-4 rounded-xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50"
    : "w-32 h-10 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50";

  const t =
    Translations[language as keyof typeof Translations] || Translations.fr;

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setAudit(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/analytics/monthly?year=${year}&month=${month}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [year, month, token]);

  useEffect(() => {
    if (token) fetchAnalytics();
  }, [fetchAnalytics, token]);

  const runAudit = async () => {
    if (!token) return;
    setAuditLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/analytics/audit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ year, month, language }),
        },
      );
      if (res.ok) {
        const json = await res.json();
        setAudit(json.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAuditLoading(false);
    }
  };

  const COLORS = [
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ];

  if (!data)
    return (
      <div className="p-10 text-center animate-pulse">
        {t.common.loading}...
      </div>
    );

  const stats = data?.stats || {
    income: 0,
    expense: 0,
    net: 0,
    savings_rate: 0,
  };
  const daily_data = data?.daily_data || [];
  const category_data = data?.category_data || [];
  const top_expenses = data?.top_expenses || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-4 rounded-2xl border ${isLight ? "bg-white border-emerald-900/10" : "bg-zinc-950 border-white/10"}`}
        >
          {label && (
            <p
              className={`mb-2 text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-zinc-500"}`}
            >
              {label}
            </p>
          )}
          {payload.map((p: any, index: number) => (
            <div key={index} className="flex items-center gap-3 mb-1 last:mb-0">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: p.color || p.payload?.fill }}
              ></div>
              <span
                className={`text-sm font-medium ${isLight ? "text-slate-600" : "text-zinc-300"}`}
              >
                {p.name}:
              </span>
              <span
                className={`text-sm font-black font-mono ${isLight ? "text-slate-900" : "text-white"}`}
              >
                {p.value.toFixed(2)}€
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-500";
    if (score >= 5) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-20"
    >
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
        <div className="flex gap-4">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className={selectStyle}>
              <SelectValue placeholder={t.analytics?.month || "Mois"} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <SelectItem key={m} value={m.toString()}>
                  {m.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className={selectStyle}>
              <SelectValue placeholder={t.analytics?.year || "Année"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={runAudit}
            disabled={auditLoading}
            className={`h-10 px-6 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105 ${isLight ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-500 hover:bg-indigo-400 text-white"}`}
          >
            {auditLoading ? (
              <Sparkles className="animate-spin w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
            {t.audit?.button || (language === "fr" ? "Audit" : "Audit")}
          </Button>
        </div>
      </div>

      {audit && (
        <motion.div
          variants={item}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative"
        >
          <div className={`absolute inset-0 border-0 ${cardGlass} z-0`} />

          <Card className="relative z-10 border-0 bg-transparent shadow-none p-6">
            {/* Top Section: Score + Roast */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8 border-b border-white/5 pb-8">
              {/* Score Gauge */}
              <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="transparent"
                    stroke={isLight ? "#e2e8f0" : "#27272a"}
                    strokeWidth="8"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={351}
                    strokeDashoffset={351 - (351 * audit.score) / 10}
                    className={`${getScoreColor(audit.score)} transition-all duration-1000 ease-out`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={`text-4xl font-black ${getScoreColor(audit.score)}`}
                  >
                    {audit.score}
                  </span>
                  <span className="text-xs uppercase font-bold opacity-50">
                    Score
                  </span>
                </div>
              </div>

              {/* Title & Roast */}
              <div className="flex-1 text-center md:text-left">
                <h2
                  className={`text-3xl font-black uppercase tracking-tight mb-2 ${isLight ? "text-slate-900" : "text-white"}`}
                >
                  {audit.title}
                </h2>
                <p
                  className={`text-lg leading-relaxed ${isLight ? "text-slate-600" : "text-zinc-400"}`}
                >
                  &quot;{audit.roast}&quot;
                </p>
              </div>
            </div>

            {/* Middle Section: Pros vs Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div
                className={`p-6 rounded-2xl ${isLight ? "bg-emerald-50/50 border border-emerald-100" : "bg-emerald-900/10 border border-emerald-500/20"}`}
              >
                <h3 className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-wider mb-4">
                  <TrendingUp className="w-5 h-5" /> Top
                </h3>
                <ul className="space-y-3">
                  {audit.pros.map((pro, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-2 text-sm font-medium ${isLight ? "text-emerald-900" : "text-emerald-100"}`}
                    >
                      <Check className="w-4 h-4 mt-0.5 opacity-50" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`p-6 rounded-2xl ${isLight ? "bg-rose-50/50 border border-rose-100" : "bg-rose-900/10 border border-rose-500/20"}`}
              >
                <h3 className="flex items-center gap-2 text-rose-500 font-bold uppercase tracking-wider mb-4">
                  <TrendingDown className="w-5 h-5" /> Flop
                </h3>
                <ul className="space-y-3">
                  {audit.cons.map((con, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-2 text-sm font-medium ${isLight ? "text-rose-900" : "text-rose-100"}`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 opacity-50" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Section: Tips */}
            <div>
              <h3
                className={`text-sm font-bold uppercase tracking-widest opacity-50 mb-4 ${isLight ? "text-slate-900" : "text-white"}`}
              >
                Conseils du Coach
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {audit.tips.map((tip, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border flex items-start gap-4 ${isLight ? "bg-white border-slate-100" : "bg-zinc-900/50 border-white/5"}`}
                  >
                    <div className="text-2xl">{tip.icon}</div>
                    <p
                      className={`text-sm font-medium leading-relaxed ${isLight ? "text-slate-700" : "text-zinc-300"}`}
                    >
                      {tip.tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div variants={item} className="h-full relative">
          <div className={`absolute inset-0 border-0 ${cardGlass} z-0`} />
          <div className="relative z-10 p-6 flex flex-col justify-between h-full">
            <div>
              <p className="text-xs font-bold uppercase text-emerald-500 mb-1 tracking-wider">
                {t.analytics?.kpi.income || "Revenus"}
              </p>
              <p
                className={`text-3xl font-black ${isBlurred ? "blur-md select-none" : ""}`}
              >
                {stats.income.toFixed(2)}€
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-emerald-500/20 self-end" />
          </div>
        </motion.div>
        <motion.div variants={item} className="h-full relative">
          <div className={`absolute inset-0 border-0 ${cardGlass} z-0`} />
          <div className="relative z-10 p-6 flex flex-col justify-between h-full">
            <div>
              <p className="text-xs font-bold uppercase text-rose-500 mb-1 tracking-wider">
                {t.analytics?.kpi.expense || "Dépenses"}
              </p>
              <p
                className={`text-3xl font-black ${isBlurred ? "blur-md select-none" : ""}`}
              >
                {stats.expense.toFixed(2)}€
              </p>
            </div>
            <TrendingDown className="w-10 h-10 text-rose-500/20 self-end" />
          </div>
        </motion.div>
        <motion.div variants={item} className="h-full relative">
          <div className={`absolute inset-0 border-0 ${cardGlass} z-0`} />
          <div className="relative z-10 p-6 flex flex-col justify-between h-full">
            <div>
              <p className="text-xs font-bold uppercase text-blue-500 mb-1 tracking-wider">
                {t.analytics?.kpi.net || "Net"}
              </p>
              <p
                className={`text-3xl font-black ${stats.net >= 0 ? "text-emerald-500" : "text-rose-500"} ${isBlurred ? "blur-md select-none" : ""}`}
              >
                {stats.net.toFixed(2)}€
              </p>
            </div>
            <Wallet className="w-10 h-10 text-blue-500/20 self-end" />
          </div>
        </motion.div>
        <motion.div variants={item} className="h-full relative">
          <div className={`absolute inset-0 border-0 ${cardGlass} z-0`} />
          <div className="relative z-10 p-6 flex flex-col justify-between h-full">
            <div>
              <p className="text-xs font-bold uppercase text-purple-500 mb-1 tracking-wider">
                {t.analytics?.kpi.savings || "Épargne"}
              </p>
              <p
                className={`text-3xl font-black ${isBlurred ? "blur-md select-none" : ""}`}
              >
                {stats.savings_rate.toFixed(1)}%
              </p>
            </div>
            <PiggyBank className="w-10 h-10 text-purple-500/20 self-end" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={item} className="h-[420px] relative">
          <div className={`absolute inset-0 ${solidCard} z-0`} />
          <div className="relative z-10 h-full flex flex-col">
            <CardHeader className="pt-8 px-8 pb-2 shrink-0">
              <CardTitle className="text-sm uppercase tracking-widest opacity-50">
                {t.analytics?.charts.daily || "Évolution Journalière"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={daily_data}>
                  <XAxis
                    dataKey="day"
                    stroke="#52525b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#52525b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}€`}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      fill: isLight ? "#f1f5f9" : "#18181b",
                      opacity: 0.5,
                    }}
                  />
                  <Bar
                    dataKey="income"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name={t.analytics?.kpi.income || "Revenus"}
                  />
                  <Bar
                    dataKey="expense"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                    name={t.analytics?.kpi.expense || "Dépenses"}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </div>
        </motion.div>

        <motion.div variants={item} className="h-[420px] relative">
          <div className={`absolute inset-0 ${solidCard} z-0`} />
          <div className="relative z-10 h-full flex flex-col">
            <CardHeader className="pt-8 px-8 pb-2 shrink-0">
              <CardTitle className="text-sm uppercase tracking-widest opacity-50">
                {t.analytics?.charts.category || "Par Catégorie"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 flex flex-col min-h-0">
              <div className="h-[180px] w-full shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={category_data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {category_data.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar mt-4">
                <div className="flex flex-col gap-3">
                  {category_data.map((entry: any, index: number) => (
                    <div
                      key={entry.name}
                      className={`flex flex-col gap-2 p-3 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/5"}`}
                    >
                      <div className="flex justify-between items-center text-xs font-bold">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          ></div>
                          <span className="opacity-80">{entry.name}</span>
                        </div>
                        <span>{entry.value.toFixed(2)}€</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="relative">
        <div className={`absolute inset-0 ${solidCard} z-0`} />
        <div className="relative z-10">
          <CardHeader className="pt-8 px-8 pb-4">
            <CardTitle className="text-sm uppercase tracking-widest opacity-50">
              {t.analytics?.topExpenses || "Top Dépenses"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div
              className={`grid grid-cols-1 gap-2 ${isBlurred ? "blur-sm select-none transition-all duration-500" : ""}`}
            >
              {top_expenses.map((t: any, i: number) => (
                <div
                  key={i}
                  className={`flex justify-between items-center p-4 rounded-xl ${isLight ? "bg-white/50 border border-emerald-900/5" : "bg-white/5 border border-white/5"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="font-bold text-lg">{i + 1}.</div>
                    <div>
                      <div className="font-bold">{t.label}</div>
                      <div className="text-xs opacity-50">{t.date}</div>
                    </div>
                  </div>
                  <div className="font-black text-rose-500">
                    -{t.amount.toFixed(2)}€
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </div>
      </motion.div>
    </motion.div>
  );
}
