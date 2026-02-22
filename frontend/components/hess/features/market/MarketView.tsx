import { useState } from "react";
import { motion } from "framer-motion";
import { container, item } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Check,
  ShoppingBag,
  Palette,
  Sparkles,
  Star,
  Crown,
  Zap,
} from "lucide-react";
import { usePrivacy } from "@/context/PrivacyContext";

interface MarketViewProps {
  data: any;
  language: string;
  theme: string;
  onBuy: (item: any) => void;
  onEquip: (item: any) => void;
}

const THEMES = [
  {
    id: "default",
    name: "Obsidian",
    price: 0,
    color: "emerald",
    gradient: "from-slate-800 via-zinc-700 to-emerald-900",
    bgGradient: "from-emerald-500/10 via-zinc-500/5 to-transparent",
    icon: Palette,
    description: {
      fr: "Élégance sombre, l'essentiel raffiné",
      es: "Elegancia oscura, lo esencial refinado",
    },
  },
  {
    id: "neon",
    name: "Horizon",
    price: 500,
    color: "cyan",
    gradient: "from-zinc-800 via-blue-900 to-cyan-950",
    bgGradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
    icon: Zap,
    description: {
      fr: "Profondeur océanique, clarté infinie",
      es: "Profundidad oceánica, claridad infinita",
    },
    minRank: "Mendiant",
  },
  {
    id: "gold",
    name: "Aurum",
    price: 1000,
    color: "yellow",
    gradient: "from-stone-800 via-amber-900 to-yellow-950",
    bgGradient: "from-amber-400/10 via-stone-500/5 to-transparent",
    icon: Crown,
    description: {
      fr: "L'or discret des connaisseurs",
      es: "El oro discreto de los conocedores",
    },
    minRank: "Investisseur",
  },
  {
    id: "cyber",
    name: "Velvet",
    price: 2500,
    color: "pink",
    gradient: "from-zinc-800 via-fuchsia-900 to-rose-950",
    bgGradient: "from-fuchsia-500/10 via-rose-500/5 to-transparent",
    icon: Sparkles,
    description: {
      fr: "Luxe digital, touche de mystère",
      es: "Lujo digital, toque de misterio",
    },
    minRank: "Rentier",
  },
  {
    id: "matrix",
    name: "Phantom",
    price: 5000,
    color: "green",
    gradient: "from-neutral-900 via-emerald-950 to-zinc-900",
    bgGradient: "from-emerald-500/10 via-neutral-500/5 to-transparent",
    icon: Star,
    description: {
      fr: "Noir absolu, lueur émeraude",
      es: "Negro absoluto, destello esmeralda",
    },
    minRank: "Rentier",
  },
];

export function MarketView({
  data,
  language,
  theme,
  onBuy,
  onEquip,
}: MarketViewProps) {
  const isLight = theme === "light";
  const { isBlurred } = usePrivacy();

  const t =
    language === "fr"
      ? {
          title: "HessMarket",
          subtitle: "Personnalise ton univers",
          buy: "Acheter",
          equip: "Équiper",
          equipped: "Équipé ✓",
          locked: "Verrouillé",
          rank: "Rang requis",
          free: "GRATUIT",
          owned: "Possédé",
        }
      : {
          title: "HessMarket",
          subtitle: "Personaliza tu universo",
          buy: "Comprar",
          equip: "Equipar",
          equipped: "Equipado ✓",
          locked: "Bloqueado",
          rank: "Rango req.",
          free: "GRATIS",
          owned: "Poseído",
        };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {}
      <div className="flex justify-between items-end">
        <div>
          <h2
            className={`text-3xl font-black uppercase tracking-tighter ${isLight ? "text-slate-800" : "text-white"}`}
          >
            <ShoppingBag className="inline w-8 h-8 mr-2 -mt-1" />
            {t.title}
          </h2>
          <p
            className={`text-sm font-bold uppercase tracking-widest mt-1 ${isLight ? "text-slate-400" : "text-zinc-500"}`}
          >
            {t.subtitle}
          </p>
        </div>
        <div
          className={`px-5 py-3 rounded-2xl flex items-center gap-3 font-black text-xl border ${isLight ? "bg-white border-amber-200 text-amber-600 shadow-lg shadow-amber-100" : "bg-amber-900/20 border-amber-500/20 text-amber-400"} ${isBlurred ? "blur-md" : ""}`}
        >
          <Star className="w-5 h-5 fill-current" /> {data.xp || 0} XP
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {THEMES.map((themeItem) => {
          const unlockedList = (
            data.profile?.unlocked_themes || "default"
          ).split(",");
          const isOwned =
            unlockedList.includes(themeItem.id) || themeItem.id === "default";
          const isEquipped =
            (data.profile?.active_theme || data.active_theme) === themeItem.id;
          const canAfford = (data.xp || 0) >= themeItem.price;

          const rankLevels: any = { Mendiant: 0, Investisseur: 1, Rentier: 2 };
          const userRankLevel = rankLevels[data.rank] || 0;
          const itemRankLevel = themeItem.minRank
            ? rankLevels[themeItem.minRank]
            : 0;
          const isRankLocked = userRankLevel < itemRankLevel;

          const ThemeIcon = themeItem.icon;
          const desc =
            themeItem.description[language as "fr" | "es"] ||
            themeItem.description.fr;

          return (
            <motion.div
              variants={item}
              key={themeItem.id}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="h-full"
            >
              <div
                className={`h-full relative rounded-3xl border overflow-hidden transition-all duration-500 group
                                ${
                                  isEquipped
                                    ? isLight
                                      ? "border-emerald-300 shadow-xl shadow-emerald-100 ring-2 ring-emerald-400/50"
                                      : "border-emerald-500/40 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30"
                                    : isLight
                                      ? "border-slate-200 shadow-lg hover:shadow-xl hover:border-slate-300 bg-white"
                                      : "border-white/5 shadow-lg hover:shadow-xl hover:border-white/10 bg-zinc-900/40"
                                }
                                ${isLight ? "bg-white" : "bg-zinc-900/40 backdrop-blur-md"}
                            `}
              >
                {}
                <div
                  className={`h-44 bg-gradient-to-br ${themeItem.gradient} relative overflow-hidden`}
                >
                  {}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                  {}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />

                  {}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ThemeIcon className="w-16 h-16 text-white/30 group-hover:text-white/50 transition-all duration-500 group-hover:scale-110" />
                  </div>

                  {}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md
                                            ${
                                              themeItem.price === 0
                                                ? "bg-emerald-500/80 text-white"
                                                : "bg-black/40 text-white border border-white/20"
                                            }`}
                    >
                      {themeItem.price === 0 ? t.free : `${themeItem.price} XP`}
                    </div>
                  </div>

                  {}
                  {isEquipped && (
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-white flex items-center gap-1.5 shadow-lg">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        {t.equipped}
                      </div>
                    </div>
                  )}

                  {}
                  {isRankLocked && !isOwned && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <Lock className="w-8 h-8 text-white/60 mx-auto mb-2" />
                        <p className="text-white/80 text-xs font-bold uppercase tracking-widest">
                          {t.rank}: {themeItem.minRank}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {}
                <div className="p-6">
                  <div className="mb-4">
                    <h3
                      className={`text-xl font-black uppercase tracking-tight ${isLight ? "text-slate-800" : "text-white"}`}
                    >
                      {themeItem.name}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${isLight ? "text-slate-500" : "text-zinc-400"}`}
                    >
                      {desc}
                    </p>
                  </div>

                  {}
                  <div>
                    {isEquipped ? (
                      <Button
                        disabled
                        className={`w-full font-bold rounded-xl h-11 border-0
                                                ${isLight ? "bg-emerald-50 text-emerald-600" : "bg-emerald-500/20 text-emerald-400"}`}
                      >
                        <Check className="w-4 h-4 mr-2" /> {t.equipped}
                      </Button>
                    ) : isOwned ? (
                      <Button
                        onClick={() => onEquip(themeItem)}
                        className={`w-full font-bold rounded-xl h-11 transition-all
                                                ${
                                                  isLight
                                                    ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200"
                                                    : "bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/10"
                                                }`}
                      >
                        <Palette className="w-4 h-4 mr-2" /> {t.equip}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onBuy(themeItem)}
                        disabled={isRankLocked || !canAfford}
                        className={`w-full font-bold rounded-xl h-11 transition-all
                                                    ${isRankLocked || !canAfford ? "opacity-50 cursor-not-allowed" : ""}
                                                    ${
                                                      isLight
                                                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-200"
                                                        : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/20"
                                                    }`}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" /> {t.buy} —{" "}
                        {themeItem.price} XP
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
