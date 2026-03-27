"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Coins, MapPin, Fuel, Trash2, Pencil, Calendar, Save } from "lucide-react";
import { motion } from "framer-motion";
import { Translations } from "@/lib/i18n";
import { container, item } from "@/lib/animations";
import { PremiumDatePicker } from "@/components/ui/premium-date-picker";
import { useFuel, FuelEntry } from "@/hooks/domain/useFuel";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/context/SettingsContext";

export default function FuelView({ isLight, isBlurred }: { isLight: boolean, isBlurred: boolean }) {
    const { token } = useAuth();
    const { language } = useSettings();
    const t = Translations[language as keyof typeof Translations];
    const { fuelLog, fuelStats, addFuel, deleteFuel, updateFuel, isLoading } = useFuel(token);

    const [form, setForm] = useState<Partial<FuelEntry>>({
        date: new Date().toISOString().split("T")[0],
        liters: undefined,
        total_cost: undefined,
        odometer: undefined,
        fuel_type: "diesel",
        station: "",
        is_full_tank: true,
        note: ""
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleSubmit = async () => {
        if (!form.date || !form.liters || !form.total_cost || !form.odometer) return;

        const entry: FuelEntry = {
            date: form.date,
            liters: Number(form.liters),
            total_cost: Number(form.total_cost),
            odometer: Number(form.odometer),
            fuel_type: form.fuel_type || "diesel",
            station: form.station,
            is_full_tank: form.is_full_tank ?? true,
            note: form.note
        };

        if (editingId) {
            await updateFuel(editingId, entry);
            setEditingId(null);
        } else {
            await addFuel(entry);
        }

        setForm({
            date: new Date().toISOString().split("T")[0],
            liters: undefined,
            total_cost: undefined,
            odometer: undefined,
            fuel_type: "diesel",
            station: "",
            is_full_tank: true,
            note: ""
        });
    };

    const handleEdit = (entry: FuelEntry) => {
        setEditingId(entry.id!);
        setForm({ ...entry });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cardGlass = isLight ? "card-glass card-glass-light" : "card-glass card-glass-dark";
    const inputStyle = isLight
        ? "w-full bg-white/50 border border-emerald-900/10 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 h-12 rounded-xl px-4 font-medium shadow-sm transition-all"
        : "w-full bg-zinc-950/50 border border-emerald-500/20 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500/50 h-12 rounded-xl px-4 font-medium shadow-inner transition-all";

    const kpiCards = [
        { title: t.fuel.kpi.avgConsumption, value: fuelStats.avg_consumption, unit: t.fuel.kpi.l100km, icon: <Flame className="w-5 h-5 text-orange-500" />, color: isLight ? "from-orange-500/10 to-transparent border-orange-200" : "from-orange-500/10 to-transparent border-orange-500/30" },
        { title: t.fuel.kpi.costPerKm, value: fuelStats.cost_per_km, unit: t.fuel.kpi.euroKm, icon: <Coins className="w-5 h-5 text-emerald-500" />, color: isLight ? "from-emerald-500/10 to-transparent border-emerald-200" : "from-emerald-500/10 to-transparent border-emerald-500/30" },
        { title: t.fuel.kpi.totalDistance, value: fuelStats.total_distance, unit: t.fuel.kpi.km, icon: <MapPin className="w-5 h-5 text-blue-500" />, color: isLight ? "from-blue-500/10 to-transparent border-blue-200" : "from-blue-500/10 to-transparent border-blue-500/30" },
        { title: t.fuel.kpi.totalCost, value: fuelStats.total_cost, unit: "€", icon: <Fuel className="w-5 h-5 text-purple-500" />, blur: true, color: isLight ? "from-purple-500/10 to-transparent border-purple-200" : "from-purple-500/10 to-transparent border-purple-500/30" }
    ];

    if (isLoading) {
        return <div className="p-8 text-center text-zinc-500 animate-pulse">{t.common.loading}</div>;
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <h1 className={`text-3xl font-black uppercase tracking-widest ${isLight ? "text-slate-800" : "text-white"}`}>
                {t.fuel.title}
            </h1>

            {/* KPI Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpiCards.map((kpi, i) => (
                    <motion.div key={i} variants={item} className={`p-5 rounded-3xl border bg-gradient-to-br ${kpi.color} ${isLight ? "bg-white/60 backdrop-blur-md" : "bg-black/40 backdrop-blur-md"}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-70 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>{kpi.title}</span>
                            {kpi.icon}
                        </div>
                        <div className="flex items-baseline gap-1 mt-2">
                            <span className={`text-2xl md:text-3xl font-black ${isLight ? "text-slate-900" : "text-white"} transition-all duration-500 ${kpi.blur && isBlurred ? "blur-md select-none" : "blur-none"}`}>
                                {kpi.value}
                            </span>
                            <span className={`text-sm font-bold opacity-60 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>{kpi.unit}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form Section */}
                <div className="lg:col-span-4">
                    <Card className={`border-0 ${cardGlass} h-fit`}>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                                {editingId ? <Pencil className="w-4 h-4" /> : <Fuel className="w-4 h-4" />}
                                {editingId ? t.common.edit : t.fuel.addBtn}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase opacity-70 ml-1">{t.fuel.date}</label>
                                <PremiumDatePicker date={form.date ? new Date(form.date) : undefined} setDate={(d) => setForm({ ...form, date: d ? d.toISOString().split("T")[0] : "" })} isLight={isLight} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase opacity-70 ml-1">{t.fuel.liters}</label>
                                    <Input type="number" step="0.01" className={inputStyle} value={form.liters || ""} onChange={e => setForm({ ...form, liters: parseFloat(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase opacity-70 ml-1">{t.fuel.cost}</label>
                                    <Input type="number" step="0.01" className={inputStyle} value={form.total_cost || ""} onChange={e => setForm({ ...form, total_cost: parseFloat(e.target.value) })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase opacity-70 ml-1">{t.fuel.odometer}</label>
                                <Input type="number" className={inputStyle} value={form.odometer || ""} onChange={e => setForm({ ...form, odometer: parseFloat(e.target.value) })} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase opacity-70 ml-1">{t.fuel.type}</label>
                                <Select value={form.fuel_type} onValueChange={(v: string) => setForm({ ...form, fuel_type: v })}>
                                    <SelectTrigger className={inputStyle}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="diesel">{t.fuel.types.diesel}</SelectItem>
                                        <SelectItem value="sp95">{t.fuel.types.sp95}</SelectItem>
                                        <SelectItem value="sp98">{t.fuel.types.sp98}</SelectItem>
                                        <SelectItem value="e85">{t.fuel.types.e85}</SelectItem>
                                        <SelectItem value="e10">{t.fuel.types.e10}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase opacity-70 ml-1">{t.fuel.station}</label>
                                <Input className={inputStyle} value={form.station || ""} onChange={e => setForm({ ...form, station: e.target.value })} />
                            </div>

                            <div className={`flex items-center justify-between p-4 rounded-xl border ${isLight ? "bg-white/50 border-emerald-900/10" : "bg-black/30 border-white/5"}`}>
                                <label className="text-sm font-bold">{t.fuel.isFullTank}</label>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 accent-emerald-500 rounded-lg cursor-pointer"
                                    checked={form.is_full_tank}
                                    onChange={(e) => setForm({ ...form, is_full_tank: e.target.checked })}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                {editingId && (
                                    <Button variant="ghost" className="flex-1 rounded-xl" onClick={() => setEditingId(null)}>
                                        {t.common.cancel}
                                    </Button>
                                )}
                                <Button className={`flex-1 rounded-xl font-bold ${isLight ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-white text-black hover:bg-zinc-200"}`} onClick={handleSubmit}>
                                    {editingId ? <Save className="w-4 h-4 mr-2" /> : <Fuel className="w-4 h-4 mr-2" />}
                                    {editingId ? t.common.update : t.fuel.addSubmit}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* History Section */}
                <div className="lg:col-span-8">
                    <Card className={`border-0 ${cardGlass} h-full`}>
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-emerald-500" />
                                {t.fuel.history}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[600px] pr-4">
                                {fuelLog.length === 0 ? (
                                    <div className="text-center py-20 opacity-50 italic font-medium">{t.fuel.empty}</div>
                                ) : (
                                    <div className="space-y-4">
                                        {fuelLog.map((entry) => (
                                            <motion.div key={entry.id} variants={item} className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:scale-[1.01] ${isLight ? "bg-white/50 border-slate-200" : "bg-white/5 border-white/5"}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-4 rounded-full ${isLight ? "bg-emerald-100 text-emerald-600" : "bg-emerald-500/20 text-emerald-400"}`}>
                                                        <Fuel className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className={`font-bold text-lg ${isLight ? "text-slate-900" : "text-white"}`}>{entry.date}</h3>
                                                            {entry.station && (
                                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                                    {entry.station}
                                                                </span>
                                                            )}
                                                            {!entry.is_full_tank && (
                                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                                                    Partiel
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className={`text-sm font-semibold opacity-70 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                                                            {entry.liters} L • {t.fuel.types[entry.fuel_type as keyof typeof t.fuel.types] || entry.fuel_type} • {entry.odometer.toLocaleString()} km
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 w-full md:w-auto mt-2 md:mt-0 justify-between md:justify-end">
                                                    <div className="text-right">
                                                        <div className={`text-2xl font-black text-rose-500 transition-all duration-500 ${isBlurred ? "blur-md select-none" : "blur-none"}`}>
                                                            -{entry.total_cost.toFixed(2)}€
                                                        </div>
                                                        <div className="text-xs font-bold opacity-60">
                                                            {(entry.total_cost / entry.liters).toFixed(3)} €/L
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)} className="hover:text-blue-500 hover:bg-blue-500/10">
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(entry.id!)} className="hover:text-red-500 hover:bg-red-500/10">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent className={`border-0 rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-2xl shadow-2xl ${isLight ? "bg-white/80" : "bg-zinc-950/80"}`}>
                    <DialogHeader>
                        <DialogTitle className={`text-2xl font-black uppercase tracking-wider mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>{t.common.confirm}</DialogTitle>
                        <DialogDescription className={`text-lg font-medium opacity-80 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                            Es-tu sûr de vouloir supprimer ce relevé ? Les statistiques de consommation seront recalculées.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-8 gap-3 sm:gap-0">
                        <Button variant="ghost" size="xl" className={`font-bold rounded-2xl ${isLight ? "hover:bg-slate-100" : "hover:bg-white/5"}`} onClick={() => setDeleteId(null)}>
                            {t.common.cancel}
                        </Button>
                        <Button
                            variant="destructive"
                            size="xl"
                            className="font-black rounded-2xl shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-all"
                            onClick={async () => {
                                if (deleteId) {
                                    await deleteFuel(deleteId);
                                    setDeleteId(null);
                                }
                            }}
                        >
                            {t.common.delete}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
