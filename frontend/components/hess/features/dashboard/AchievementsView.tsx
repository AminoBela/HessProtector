import { motion } from "framer-motion";
import { Lock, PiggyBank, Palmtree, Gem, ChefHat, Trophy } from "lucide-react";

interface Achievement {
  id: string;
  icon: string;
  name: string;
  desc: string;
  locked?: boolean;
}

interface AchievementsViewProps {
  achievements: Achievement[];
  isLight: boolean;
  language: string;
}

export function AchievementsView({
  achievements,
  isLight,
  language,
}: AchievementsViewProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "squirrel":
        return <PiggyBank className="w-12 h-12 text-emerald-500" />;
      case "island":
        return <Palmtree className="w-12 h-12 text-teal-500" />;
      case "crystal":
        return <Gem className="w-12 h-12 text-purple-500" />;
      case "chef":
        return <ChefHat className="w-12 h-12 text-orange-500" />;
      case "lock":
        return <Lock className="w-12 h-12 text-zinc-400" />;
      default:
        return <Trophy className="w-12 h-12 text-yellow-500" />;
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {achievements.map((a, i) => {
        const isLocked = a.locked;

        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="h-full"
          >
            <div
              className={`
                relative h-full rounded-2xl border transition-all duration-200
                flex flex-col items-center justify-center p-6 text-center gap-4
                ${isLocked
                  ? "opacity-60 grayscale bg-zinc-100/5 border-zinc-500/10"
                  : isLight
                    ? "bg-slate-50 border-slate-200 hover:border-emerald-500/30 hover:bg-white"
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                }
              `}
            >
              <div className="select-none filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
                {getIcon(a.icon)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  {isLocked && <Lock className="w-3 h-3 text-zinc-500" />}
                  <h4
                    className={`font-bold uppercase text-xs tracking-widest ${isLight ? "text-slate-900" : "text-white"}`}
                  >
                    {a.name}
                  </h4>
                </div>
                <p className={`text-[10px] font-medium uppercase tracking-wide ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                  {a.desc}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
