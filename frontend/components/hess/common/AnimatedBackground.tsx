"use client";

import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
    themeId: string;
    isLight: boolean;
}

const themeConfigs: Record<string, any> = {
    default: {
        light: [
            "bg-emerald-300/40",
            "bg-indigo-300/40",
            "bg-purple-300/30",
            "bg-pink-300/30",
        ],
        dark: [
            "bg-emerald-900/40",
            "bg-indigo-900/40",
            "bg-purple-900/30",
            "bg-pink-900/30",
        ],
        baseBgLight: "bg-slate-50",
        baseBgDark: "bg-zinc-950",
    },
    neon: {
        light: [
            "bg-cyan-300/40",
            "bg-blue-400/30",
            "bg-sky-300/40",
            "bg-indigo-300/30",
        ],
        dark: [
            "bg-cyan-900/40",
            "bg-blue-900/40",
            "bg-sky-900/30",
            "bg-indigo-900/30",
        ],
        baseBgLight: "bg-slate-50",
        baseBgDark: "bg-zinc-950",
    },
    gold: {
        light: [
            "bg-amber-300/40",
            "bg-yellow-400/40",
            "bg-orange-300/40",
            "bg-rose-300/30",
        ],
        dark: [
            "bg-amber-900/40",
            "bg-yellow-900/30",
            "bg-orange-900/30",
            "bg-rose-900/30",
        ],
        baseBgLight: "bg-stone-50",
        baseBgDark: "bg-stone-950",
    },
    cyber: {
        light: [
            "bg-fuchsia-300/40",
            "bg-pink-400/40",
            "bg-rose-300/40",
            "bg-purple-300/30",
        ],
        dark: [
            "bg-fuchsia-900/40",
            "bg-pink-900/30",
            "bg-rose-900/30",
            "bg-purple-900/30",
        ],
        baseBgLight: "bg-slate-50",
        baseBgDark: "bg-zinc-950",
    },
    matrix: {
        light: [
            "bg-green-300/40",
            "bg-lime-400/40",
            "bg-emerald-300/40",
            "bg-teal-300/30",
        ],
        dark: [
            "bg-green-900/40",
            "bg-lime-900/30",
            "bg-emerald-900/30",
            "bg-teal-900/30",
        ],
        baseBgLight: "bg-neutral-50",
        baseBgDark: "bg-zinc-950",
    }
};

export function AnimatedBackground({ themeId, isLight }: AnimatedBackgroundProps) {
    const config = themeConfigs[themeId] || themeConfigs.default;
    const colors = isLight ? config.light : config.dark;
    const baseClass = isLight ? config.baseBgLight : config.baseBgDark;
    const blendMode = isLight ? "mix-blend-multiply" : "mix-blend-screen";

    return (
        <div className={`fixed inset-0 -z-50 overflow-hidden pointer-events-none transition-colors duration-1000 ${baseClass}`}>
            <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px] transition-colors duration-1000 ${blendMode} ${colors[0]}`}
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, -60, 0], x: [0, -50, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
                className={`absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full blur-[100px] transition-colors duration-1000 ${blendMode} ${colors[1]}`}
            />
            <motion.div
                animate={{ scale: [1.1, 1, 1.1], y: [0, -50, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 1 }}
                className={`absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full blur-[100px] transition-colors duration-1000 ${blendMode} ${colors[2]}`}
            />
            <motion.div
                animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 3 }}
                className={`absolute bottom-[10%] left-[20%] w-[45vw] h-[45vw] rounded-full blur-[110px] transition-colors duration-1000 ${blendMode} ${colors[3]}`}
            />
        </div>
    );
}
