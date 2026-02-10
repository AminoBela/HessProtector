import { useState } from "react";
import { motion } from "framer-motion";
import { container, item } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Check, ShoppingBag, Palette } from "lucide-react";
import { usePrivacy } from "@/context/PrivacyContext";

interface MarketViewProps {
    data: any;
    language: string;
    theme: string;
    onBuy: (item: any) => void;
    onEquip: (item: any) => void;
}

const THEMES = [
    { id: "default", name: "Standard", price: 0, color: "emerald", gradient: "from-emerald-500 to-teal-500" },
    { id: "gold", name: "Gold Prestige", price: 1000, color: "yellow", gradient: "from-yellow-400 to-amber-600", minRank: "Investisseur" },
    { id: "cyber", name: "Cyberpunk", price: 2500, color: "pink", gradient: "from-pink-500 to-purple-600", minRank: "Rentier" },
    { id: "matrix", name: "The Matrix", price: 5000, color: "green", gradient: "from-green-500 to-emerald-900", minRank: "Rentier" },
    { id: "neon", name: "Neon Blue", price: 500, color: "cyan", gradient: "from-cyan-400 to-blue-600", minRank: "Mendiant" },
];

export function MarketView({ data, language, theme, onBuy, onEquip }: MarketViewProps) {
    const isLight = theme === 'light';
    const cardGlass = isLight
        ? "card-glass card-glass-light"
        : "card-glass card-glass-dark";
    const { isBlurred } = usePrivacy();

    const t = language === 'fr'
        ? { title: "HessMarket", subtitle: "Dépense ton XP", buy: "Acheter", equip: "Équiper", equipped: "Équipé", locked: "Verrouillé", rank: "Rang requis" }
        : { title: "HessMarket", subtitle: "Gasta tu XP", buy: "Comprar", equip: "Equipar", equipped: "Equipado", locked: "Bloqueado", rank: "Rango req." };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={`text-3xl font-black uppercase tracking-tighter ${isLight ? 'text-slate-800' : 'text-white'}`}>{t.title}</h2>
                    <p className={`text-sm font-bold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>{t.subtitle}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-black text-xl ${isLight ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-900/20 text-indigo-400'} ${isBlurred ? 'blur-md' : ''}`}>
                    <ShoppingBag className="w-5 h-5" /> {data.xp || 0} XP
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {THEMES.map((themeItem) => {
                    const unlockedList = (data.profile?.unlocked_themes || 'default').split(',');
                    const isOwned = unlockedList.includes(themeItem.id) || themeItem.id === 'default';
                    const isEquipped = (data.profile?.active_theme || data.active_theme) === themeItem.id;
                    const canAfford = (data.xp || 0) >= themeItem.price;

                    // Simple rank check logic (mock)
                    const rankLevels: any = { "Mendiant": 0, "Investisseur": 1, "Rentier": 2 };
                    const userRankLevel = rankLevels[data.rank] || 0;
                    const itemRankLevel = themeItem.minRank ? rankLevels[themeItem.minRank] : 0;
                    const isRankLocked = userRankLevel < itemRankLevel;

                    return (
                        <motion.div
                            variants={item}
                            key={themeItem.id}
                            whileHover={{ scale: 1.02 }}
                            className="h-full"
                        >
                            <div className={`h-full relative overflow-hidden rounded-3xl border ${isLight ? 'border-emerald-900/5' : 'border-white/5'} ${cardGlass}`}>
                                <div className={`h-32 bg-gradient-to-br ${themeItem.gradient} flex items-center justify-center`}>
                                    <Palette className="w-12 h-12 text-white/50" />
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight">{themeItem.name}</h3>
                                            <p className={`text-xs font-bold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>{themeItem.price > 0 ? `${themeItem.price} XP` : 'GRATUIT'}</p>
                                        </div>
                                        {isRankLocked && !isOwned && (
                                            <div className="bg-rose-500/10 text-rose-500 p-2 rounded-lg" title={`${t.rank}: ${themeItem.minRank}`}>
                                                <Lock className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        {isEquipped ? (
                                            <Button disabled className="w-full bg-emerald-500/20 text-emerald-500 font-bold border-0">
                                                <Check className="w-4 h-4 mr-2" /> {t.equipped}
                                            </Button>
                                        ) : isOwned ? (
                                            <Button onClick={() => onEquip(themeItem)} className={`w-full font-bold ${isLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>
                                                {t.equip}
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => onBuy(themeItem)}
                                                disabled={isRankLocked}
                                                className={`w-full font-bold ${isRankLocked ? 'opacity-50 cursor-not-allowed' : ''} ${isLight ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                                            >
                                                {t.buy} - {themeItem.price} XP
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
