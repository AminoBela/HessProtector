import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Wallet, Zap, TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { SurvivalGauge } from "./SurvivalGauge";
import { AchievementsView } from "./AchievementsView";
import { motion, Variants } from "framer-motion";
import { usePrivacy } from "@/context/PrivacyContext";
import { PanicModal } from "../../common/PanicModal";

import { container, item } from "@/lib/animations";

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

export function DashboardView({
  data,
  barData,
  COLORS,
  language,
  theme,
  statsData,
  years,
  statsYear,
  setStatsYear,
  t,
}: DashboardViewProps) {
  const { isBlurred } = usePrivacy();
  const isLight = theme === "light";
  const cardGlass = isLight
    ? "card-glass card-glass-light"
    : "card-glass card-glass-dark";

  const cardTitleColor = isLight ? "text-slate-400" : "text-zinc-400";
  const bigNumberColor = isLight ? "text-slate-800" : "text-white";
  const subTextColor = isLight ? "text-slate-500" : "text-zinc-500";
  const pillBg = isLight
    ? "bg-white border-emerald-900/10 shadow-sm"
    : "bg-black/40 border-white/5";
  const pillText = isLight ? "text-slate-700" : "text-white";
  const itemBg = isLight
    ? "bg-white border-emerald-900/5 hover:bg-emerald-50/50"
    : "bg-white/5 border-white/5 hover:bg-white/10";
  const chartGrid = isLight ? "#e2e8f0" : "#333";
  const chartText = isLight ? "#64748b" : "#666";

  const annualData = statsData?.monthly_data || [];

  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();
  const daysRemaining = Math.max(1, daysInMonth - today.getDate() + 1);
  const perDay = (data?.balance || 0) / daysRemaining;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${isLight ? "bg-white/90 border-emerald-900/10" : "bg-black/80 border-white/10"}`}
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
                style={{ backgroundColor: p.color || p.fill }}
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

  if (!data)
    return (
      <div className="p-8 text-center text-emerald-500 animate-pulse">
        {t.loading}...
      </div>
    );

  return (
    <motion.div
      key={language}
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          {data.safe_balance < 50 && (
            <PanicModal language={language} isLight={isLight} />
          )}
        </div>
        <div
          className={`p-1 rounded-xl flex gap-1 ${isLight ? "bg-white/50 border border-emerald-900/10" : "bg-black/40 border border-white/10"}`}
        >
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setStatsYear(y)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${statsYear === y ? (isLight ? "bg-emerald-500 text-white shadow-lg" : "bg-zinc-800 text-white shadow-lg") : isLight ? "text-slate-500 hover:text-emerald-600" : "text-zinc-500 hover:text-white"}`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          variants={item}
          className="md:col-span-2 relative min-h-[320px] flex flex-col justify-between"
        >
          <div className={`absolute inset-0 border-0 ${cardGlass} z-0`} />
          <div
            className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none mix-blend-screen z-0 ${isLight ? "bg-emerald-500/10" : "bg-emerald-500/20"}`}
          ></div>
          <div className="relative z-10 p-6 flex flex-col justify-between h-full">
            <CardHeader className="p-0">
              <CardTitle
                className={`${cardTitleColor} text-sm uppercase font-black tracking-[0.3em]`}
              >
                {t.netBalance} ({t.annual} {statsYear})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-6">
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-6xl md:text-8xl font-black tracking-tighter ${bigNumberColor} ${isBlurred ? "blur-xl select-none" : ""}`}
                >
                  {statsData ? statsData.net_result.toFixed(2) : "..."}
                </span>
                <span className="text-3xl text-emerald-400 font-thin">€</span>
              </div>
              <div className="mt-8 flex flex-col md:flex-row gap-4 text-sm font-bold">
                <div
                  className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${pillBg} ${pillText}`}
                >
                  <TrendingUp className="w-5 h-5 text-emerald-500" />{" "}
                  {t.incoming}:{" "}
                  <span className={isBlurred ? "blur-sm" : ""}>
                    {statsData ? statsData.total_income.toFixed(2) : 0}€
                  </span>
                </div>
                <div
                  className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${pillBg} ${pillText}`}
                >
                  <Zap className="w-5 h-5 text-rose-500" /> {t.outgoing}:{" "}
                  <span className={isBlurred ? "blur-sm" : ""}>
                    {statsData ? statsData.total_expense.toFixed(2) : 0}€
                  </span>
                </div>
                <div
                  className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${pillBg} ${statsData && statsData.net_result >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                >
                  <Wallet className="w-5 h-5" /> {t.balance}:{" "}
                  {statsData && statsData.net_result >= 0
                    ? t.surplus
                    : t.deficit}
                </div>
              </div>
            </CardContent>
          </div>
        </motion.div>
        <motion.div
          variants={item}
          className="md:col-span-1 relative min-h-[320px] flex flex-col justify-between"
        >
          <div
            className={`absolute inset-0 border-0 ${cardGlass} rounded-3xl z-0`}
          ></div>
          <div className="relative z-10 p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className={`text-sm font-black uppercase tracking-widest mb-1 ${isLight ? "text-slate-500" : "text-zinc-400"}`}
                >
                  {t.safeBalance}
                </h3>
                <div
                  className={`text-5xl md:text-7xl font-black tracking-tighter ${isBlurred ? "blur-md select-none" : ""}`}
                >
                  {data?.safe_balance?.toFixed(2)}€
                </div>
              </div>
              <div
                className={`p-3 rounded-full ${isLight ? "bg-emerald-100/50 text-emerald-600" : "bg-emerald-500/10 text-emerald-400"}`}
              >
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>

            <div
              className={`mt-8 p-4 rounded-2xl border ${isLight ? "bg-indigo-50/50 border-indigo-100" : "bg-indigo-500/10 border-indigo-500/10"}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${isLight ? "bg-indigo-100 text-indigo-600" : "bg-indigo-500/20 text-indigo-400"}`}
                >
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-xs font-black uppercase tracking-wider ${isLight ? "text-indigo-500" : "text-indigo-400"}`}
                  >
                    Reste à vivre (Est.)
                  </p>
                  <p
                    className={`text-lg font-bold ${isLight ? "text-indigo-900" : "text-indigo-100"}`}
                  >
                    {data?.prediction?.projected_end}€
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={item} className="h-[400px] relative">
          <div className={`absolute inset-0 border-0 ${cardGlass} z-0`} />
          <div className="relative z-10 h-full">
            <CardHeader className="pt-8 px-8 pb-2">
              <CardTitle
                className={`text-xs uppercase tracking-[0.2em] font-black ${subTextColor}`}
              >
                {t.evolution} {statsYear}
              </CardTitle>
            </CardHeader>
            <CardContent
              className={`h-[300px] ${isBlurred ? "blur-lg transition-all duration-500" : ""}`}
            >
              {statsData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={annualData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartGrid}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke={chartText}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={chartText}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
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
                      name={t.incoming}
                    />
                    <Bar
                      dataKey="expense"
                      fill="#f43f5e"
                      radius={[4, 4, 0, 0]}
                      name={t.outgoing}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div
                  className={`h-full flex items-center justify-center ${subTextColor}`}
                >
                  {t.loading}
                </div>
              )}
            </CardContent>
          </div>
        </motion.div>
        <motion.div variants={item} className="h-[400px] relative">
          <div className={`absolute inset-0 border-0 ${cardGlass} z-0`} />
          <div className="relative z-10 h-full">
            <CardHeader className="pt-8 px-8 pb-2">
              <CardTitle
                className={`text-xs uppercase tracking-[0.2em] font-black ${subTextColor}`}
              >
                {t.activities}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {data.transactions.slice(0, 5).map((tx: any) => (
                    <div
                      key={tx.id}
                      className={`flex justify-between items-center p-5 rounded-2xl border transition-colors ${itemBg}`}
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`p-3 rounded-xl ${tx.type === "revenu" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}
                        >
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <div
                            className={`font-bold text-lg ${bigNumberColor}`}
                          >
                            {tx.label}
                          </div>
                          <div
                            className={`text-xs uppercase font-bold tracking-wider ${subTextColor}`}
                          >
                            {tx.date} • {tx.category}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`font-mono text-xl font-bold ${tx.type === "revenu" ? "text-emerald-500" : "text-rose-500"} ${isBlurred ? "blur-sm select-none" : ""}`}
                      >
                        {tx.type === "revenu" ? "+" : "-"}
                        {parseFloat(tx.amount).toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </div>
        </motion.div>
      </div>

      {data.achievements && (
        <motion.div variants={item}>
          <h3
            className={`text-xs font-black uppercase tracking-widest mb-6 ${subTextColor}`}
          >
            {t.achievements || "Salle des Trophées"}
          </h3>
          <AchievementsView
            achievements={data.achievements}
            isLight={isLight}
            language={language}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
