import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Trophy } from "lucide-react";

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

export function AchievementsView({ achievements, isLight, language }: AchievementsViewProps) {
    const cardGlass = isLight
        ? "card-glass card-glass-light"
        : "card-glass card-glass-dark";

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((a, i) => (
                <motion.div
                    key={a.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Card className={`border-0 ${cardGlass} relative overflow-hidden group`}>
                        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                            <div className={`text-4xl mb-2 transition-transform duration-300 group-hover:scale-110 ${a.locked ? 'opacity-30 grayscale' : 'opacity-100'}`}>
                                {a.locked ? '🔒' : a.icon}
                            </div>

                            <div>
                                <h4 className={`font-black uppercase text-sm mb-1 ${a.locked ? 'text-zinc-500' : (isLight ? 'text-indigo-600' : 'text-indigo-400')}`}>
                                    {a.name}
                                </h4>
                                <p className="text-[10px] opacity-60 font-medium uppercase tracking-wider">{a.desc}</p>
                            </div>

                            {!a.locked && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
