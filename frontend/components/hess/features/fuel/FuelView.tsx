"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Coins, MapPin, Fuel, Trash2, Pencil, Calendar, Save, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    const { fuelLog, fuelStats, addFuel, deleteFuel, updateFuel, isLoading, isAdding, isUpdating } = useFuel(token);

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
    const [actionMenuEntry, setActionMenuEntry] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        if (!form.date || !form.liters || !form.total_cost) {
            setError(t.fuel.fillRequired);
            return;
        }

        const entry: FuelEntry = {
            date: form.date,
            liters: Number(form.liters),
            total_cost: Number(form.total_cost),
            odometer: form.odometer ? Number(form.odometer) : null,
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
        ? "w-full bg-white border border-emerald-900/10 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 !h-14 rounded-2xl px-5 font-bold shadow-sm transition-all"
        : "w-full bg-zinc-950/50 border border-emerald-500/20 text-white placeholder:text-zinc-600 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 !h-14 rounded-2xl px-5 font-bold shadow-inner transition-all";
    const labelStyle = "text-[10px] font-black uppercase tracking-widest opacity-60 ml-1 block text-emerald-600 dark:text-emerald-400";

    const kpiCards = [
        { title: t.fuel.kpi.avgConsumption, value: isNaN(fuelStats.avg_consumption) || !isFinite(fuelStats.avg_consumption) ? "0.00" : fuelStats.avg_consumption.toFixed(2), unit: t.fuel.kpi.l100km, icon: <Flame className="w-5 h-5 text-orange-500" />, color: isLight ? "from-orange-500/10 to-transparent border-orange-200" : "from-orange-500/10 to-transparent border-orange-500/30" },
        { title: t.fuel.kpi.costPerKm, value: isNaN(fuelStats.cost_per_km) || !isFinite(fuelStats.cost_per_km) ? "0.00" : fuelStats.cost_per_km.toFixed(3), unit: t.fuel.kpi.euroKm, icon: <Coins className="w-5 h-5 text-emerald-500" />, color: isLight ? "from-emerald-500/10 to-transparent border-emerald-200" : "from-emerald-500/10 to-transparent border-emerald-500/30" },
        { title: t.fuel.kpi.totalDistance, value: isNaN(fuelStats.total_distance) || !isFinite(fuelStats.total_distance) ? "0" : fuelStats.total_distance.toLocaleString(), unit: t.fuel.kpi.km, icon: <MapPin className="w-5 h-5 text-blue-500" />, color: isLight ? "from-blue-500/10 to-transparent border-blue-200" : "from-blue-500/10 to-transparent border-blue-500/30" },
        { title: t.fuel.kpi.totalCost, value: isNaN(fuelStats.total_cost) || !isFinite(fuelStats.total_cost) ? "0.00" : fuelStats.total_cost.toFixed(2), unit: "€", icon: <Fuel className="w-5 h-5 text-purple-500" />, blur: true, color: isLight ? "from-purple-500/10 to-transparent border-purple-200" : "from-purple-500/10 to-transparent border-purple-500/30" }
    ];

    if (isLoading) {
        return <div className="p-8 text-center text-zinc-500 animate-pulse">{t.common.loading}</div>;
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-widest ${isLight ? "text-slate-800" : "text-white"}`}>
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
                        <CardContent className="space-y-6">
                            <div className="space-y-1.5">
                                <label className={labelStyle}>{t.fuel.date}</label>
                                <PremiumDatePicker date={form.date ? new Date(form.date) : undefined} setDate={(d) => setForm({ ...form, date: d ? d.toISOString().split("T")[0] : "" })} isLight={isLight} language={language} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className={labelStyle}>{t.fuel.liters}</label>
                                    <Input type="number" step="0.01" className={inputStyle} value={form.liters || ""} onChange={e => setForm({ ...form, liters: parseFloat(e.target.value) })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelStyle}>{t.fuel.cost}</label>
                                    <Input type="number" step="0.01" className={inputStyle} value={form.total_cost || ""} onChange={e => setForm({ ...form, total_cost: parseFloat(e.target.value) })} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className={labelStyle}>{t.fuel.odometer} <span className="normal-case opacity-50 ml-1">({t.common.optional})</span></label>
                                <Input type="number" className={inputStyle} value={form.odometer || ""} onChange={e => setForm({ ...form, odometer: parseFloat(e.target.value) })} />
                            </div>

                            <div className="space-y-1.5">
                                <label className={labelStyle}>{t.fuel.type}</label>
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

                            <div className="space-y-1.5">
                                <label className={labelStyle}>{t.fuel.station}</label>
                                <Input className={inputStyle} value={form.station || ""} onChange={e => setForm({ ...form, station: e.target.value })} />
                            </div>

                            <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${isLight ? "bg-white border-emerald-900/10 shadow-sm" : "bg-zinc-950/50 border-emerald-500/20 shadow-inner"}`}>
                                <div className="space-y-1">
                                    <label className="text-sm font-black uppercase tracking-wider">{t.fuel.isFullTank}</label>
                                    <p className="text-[10px] font-bold opacity-50 uppercase">{t.fuel.activateForStats}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 accent-emerald-500 rounded-lg cursor-pointer"
                                    checked={form.is_full_tank}
                                    onChange={(e) => setForm({ ...form, is_full_tank: e.target.checked })}
                                />
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm font-bold text-red-500 flex items-center gap-2 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex gap-3 pt-2">
                                {editingId && (
                                    <Button variant="ghost" className="flex-1 rounded-xl" onClick={() => { setEditingId(null); setError(null); }} disabled={isAdding || isUpdating}>
                                        {t.common.cancel}
                                    </Button>
                                )}
                                <Button disabled={isAdding || isUpdating} className={`flex-1 rounded-xl font-bold ${isLight ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-white text-black hover:bg-zinc-200"}`} onClick={handleSubmit}>
                                    {(isAdding || isUpdating) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (editingId ? <Save className="w-4 h-4 mr-2" /> : <Fuel className="w-4 h-4 mr-2" />)}
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
                            <ScrollArea className="h-[600px] pr-2 md:pr-4">
                                {fuelLog.length === 0 ? (
                                    <div className="text-center py-20 opacity-50 italic font-medium">{t.fuel.empty}</div>
                                ) : (
                                    <div className="space-y-4 p-4 md:p-6">
                                        {fuelLog.map((entry) => (
                                            <div key={entry.id}
                                                onClick={() => setActionMenuEntry(entry)}
                                                className={`group cursor-pointer relative p-4 md:p-6 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 ${isLight ? "bg-white border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-500/30" : "bg-black/40 border-white/5 hover:bg-emerald-500/5 hover:border-emerald-500/30"}`}>
                                                <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                                                    <div className={`p-4 rounded-2xl transition-colors duration-300 ${isLight ? "bg-emerald-100/50 text-emerald-600 group-hover:bg-emerald-100" : "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20"}`}>
                                                        <Fuel className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <h3 className={`font-black tracking-wide text-lg ${isLight ? "text-slate-900" : "text-white"}`}>{entry.date}</h3>
                                                            {entry.station && (
                                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                                                    {entry.station}
                                                                </span>
                                                            )}
                                                            {!entry.is_full_tank && (
                                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                                                    {t.fuel.partial}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className={`text-sm font-semibold tracking-wide flex items-center gap-1.5 opacity-80 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                                                            <span>{entry.liters} L</span>
                                                            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                                                            <span>{t.fuel.types[entry.fuel_type as keyof typeof t.fuel.types] || entry.fuel_type}</span>
                                                            {entry.odometer && (
                                                                <>
                                                                    <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                                                                    <span>{entry.odometer.toLocaleString()} km</span>
                                                                </>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 w-full md:w-auto mt-2 md:mt-0 justify-end md:justify-end relative z-10 border-t border-white/5 md:border-t-0 pt-2 md:pt-0">
                                                    <div className="text-right flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end w-full md:w-auto mt-2 md:mt-0 gap-2 md:gap-0">
                                                        <div className={`text-2xl font-black text-rose-500 tracking-tight transition-all duration-500 ${isBlurred ? "blur-md select-none" : "blur-none"}`}>
                                                            -{entry.total_cost.toFixed(2)}€
                                                        </div>
                                                        <div className="text-xs font-bold opacity-60 tracking-wider">
                                                            {(entry.total_cost / entry.liters).toFixed(3)} €/L
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog
                open={!!actionMenuEntry}
                onOpenChange={(open) => !open && setActionMenuEntry(null)}
            >
                <DialogContent
                    className={
                        isLight
                            ? "bg-white/95 backdrop-blur-xl border-emerald-900/10 text-slate-800 w-11/12 max-w-sm rounded-3xl"
                            : "bg-zinc-950/95 backdrop-blur-xl border-white/10 text-white w-11/12 max-w-sm rounded-3xl"
                    }
                >
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-black">{actionMenuEntry?.date}</DialogTitle>
                        <div className={`text-center font-bold text-sm text-rose-500`}>
                            -{actionMenuEntry?.total_cost?.toFixed(2)}€
                        </div>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-4">
                        <Button
                            variant="outline"
                            className={`h-14 font-bold rounded-2xl flex items-center justify-start gap-4 px-6 shadow-sm border ${isLight ? "bg-slate-50 border-slate-200 hover:bg-slate-100" : "bg-black/20 border-white/5 hover:bg-white/5"}`}
                            onClick={() => { handleEdit(actionMenuEntry); setActionMenuEntry(null); }}
                        >
                            <Pencil className="w-5 h-5 text-emerald-500" /> <span className="text-base">{t.common?.edit || "Modifier"}</span>
                        </Button>
                        <Button
                            variant="outline"
                            className={`h-14 font-bold rounded-2xl flex items-center justify-start gap-4 px-6 shadow-sm border text-rose-500 hover:text-rose-600 ${isLight ? "bg-rose-50 border-rose-100 hover:bg-rose-100" : "bg-rose-950/20 border-rose-900/30 hover:bg-rose-900/40"}`}
                            onClick={() => { setDeleteId(actionMenuEntry.id); setActionMenuEntry(null); }}
                        >
                            <Trash2 className="w-5 h-5" /> <span className="text-base">{t.common?.delete || "Supprimer"}</span>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent className={`border-0 rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-2xl shadow-2xl ${isLight ? "bg-white/80" : "bg-zinc-950/80"}`}>
                    <DialogHeader>
                        <DialogTitle className={`text-2xl font-black uppercase tracking-wider mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>{t.common.confirm}</DialogTitle>
                        <DialogDescription className={`text-lg font-medium opacity-80 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                            {language === "es" ? "¿Seguro que quieres eliminar este repostaje? Las estadísticas se recalcularán." : "Supprimer ce relevé ? Les statistiques de consommation seront recalculées."}
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
