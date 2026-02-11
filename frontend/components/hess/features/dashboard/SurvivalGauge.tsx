import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Skull, PartyPopper } from "lucide-react";
import { usePrivacy } from "@/context/PrivacyContext";

interface SurvivalGaugeProps {
  prediction: {
    days_left: number;
    avg_daily_burn: number;
    projected_end: number;
    status: string;
  };
  isLight: boolean;
  language: string;
}

export function SurvivalGauge({
  prediction,
  isLight,
  language,
}: SurvivalGaugeProps) {
  const { isBlurred } = usePrivacy();
  const isSafe = prediction.status === "safe";
  const percent = Math.min(
    100,
    Math.max(0, (prediction.projected_end + 500) / 10),
  );

  const text =
    language === "fr"
      ? {
          title: "Mode Oracle",
          safe: "Survie Probable",
          danger: "Mort Financière",
          burn: "Dépense/jour",
        }
      : {
          title: "Modo Oráculo",
          safe: "Supervivencia Probable",
          danger: "Muerte Financiera",
          burn: "Gasto/día",
        };

  return (
    <div
      className={`p-6 rounded-3xl border relative overflow-hidden ${isLight ? "bg-white/70 border-emerald-900/5" : "bg-zinc-900/40 border-white/5"}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3
          className={`font-black uppercase tracking-widest text-xs ${isLight ? "text-slate-400" : "text-zinc-500"}`}
        >
          {text.title}
        </h3>
        <div
          className={`px-2 py-1 rounded text-xs font-bold ${isSafe ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"}`}
        >
          {prediction.days_left}J restants
        </div>
      </div>

      <div className="flex flex-col items-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-4xl font-black mb-1 ${isSafe ? "text-emerald-500" : "text-rose-500"} ${isBlurred ? "blur-lg select-none" : ""}`}
        >
          {prediction.projected_end > 0 ? "+" : ""}
          {prediction.projected_end.toFixed(0)}€
        </motion.div>

        <div
          className={`flex items-center gap-2 font-bold ${isSafe ? "text-emerald-600" : "text-rose-400"}`}
        >
          {isSafe ? (
            <PartyPopper className="w-5 h-5" />
          ) : (
            <Skull className="w-5 h-5" />
          )}
          {isSafe ? text.safe : text.danger}
        </div>

        <div
          className={`mt-6 text-xs font-mono opacity-50 ${isLight ? "text-slate-500" : "text-zinc-400"}`}
        >
          ~
          <span className={isBlurred ? "blur-sm" : ""}>
            {prediction.avg_daily_burn.toFixed(0)}€
          </span>{" "}
          {text.burn}
        </div>
      </div>

      {/* Background Gauge Visual */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-yellow-500 to-emerald-500 opacity-20" />
      <motion.div
        className={`absolute bottom-0 h-1 ${isSafe ? "bg-emerald-500" : "bg-rose-500"}`}
        style={{
          left: isSafe ? "50%" : "auto",
          right: isSafe ? "auto" : "50%",
          width: "50%",
        }}
        initial={{ width: 0 }}
        animate={{
          width: `${Math.min(50, Math.abs(prediction.projected_end) / 10)}%`,
        }}
      />
    </div>
  );
}
