import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, ScanLine, Camera, Utensils, Package, Beef, Milk, Carrot, Wine, Home, Sparkles, Check, ThermometerSnowflake } from "lucide-react"
import { Translations } from "@/lib/i18n";
import { motion, Variants } from "framer-motion";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
};

const getCategoryIcon = (cat: string) => {
    switch (cat) {
        case 'Viandes': return <Beef className="w-5 h-5 text-rose-300" />;
        case 'Laitiers': return <Milk className="w-5 h-5 text-sky-200" />;
        case 'Legumes': return <Carrot className="w-5 h-5 text-orange-300" />;
        case 'Boisson': return <Wine className="w-5 h-5 text-purple-300" />;
        case 'Maison': case 'Hygiene': return <Home className="w-5 h-5 text-indigo-300" />;
        case 'Surgeles': return <ThermometerSnowflake className="w-5 h-5 text-cyan-300" />;
        case 'Epicerie': default: return <Package className="w-5 h-5 text-zinc-300" />;
    }
}

interface PantryViewProps {
    data: any;
    pantryForm: any;
    setPantryForm: (form: any) => void;
    handleAddPantry: () => void;
    handleDeletePantry: (id: number) => void;
    scanning: boolean;
    handleUploadReceipt: (e: any) => void;
    language: string;
    theme: string;
    scannedTotal: number | null;
    setScannedTotal: (val: number | null) => void;
    handleAddTx: (form: any) => void;
}

export function PantryView({
    data,
    pantryForm,
    setPantryForm,
    handleAddPantry,
    handleDeletePantry,
    scanning,
    handleUploadReceipt,
    language,
    theme,
    scannedTotal,
    setScannedTotal,
    handleAddTx
}: PantryViewProps) {
    const isLight = theme === 'light';
    const cardGlass = isLight
        ? "bg-white/70 backdrop-blur-xl border-emerald-900/5 shadow-xl text-slate-800 rounded-3xl overflow-hidden hover:bg-white/80 transition-colors duration-500"
        : "bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-2xl text-white rounded-3xl overflow-hidden hover:bg-zinc-900/50 transition-colors duration-500";

    const inputStyle = isLight
        ? "bg-white border-emerald-900/10 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all !h-14 rounded-xl px-4 font-medium shadow-inner"
        : "bg-zinc-900/60 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all !h-14 rounded-xl px-4 font-medium shadow-inner";

    const selectStyle = isLight
        ? "w-full !h-14 px-4 rounded-xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50 cursor-pointer backdrop-blur-xl transition-all shadow-inner font-medium"
        : "w-full !h-14 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50 cursor-pointer backdrop-blur-xl transition-all shadow-inner font-medium";

    const t = Translations[language as keyof typeof Translations] || Translations.fr;
    const cats = t.pantry.categories;

    const [addStatus, setAddStatus] = useState<'idle' | 'success'>('idle');

    const handleConfirmExpense = () => {
        if (!scannedTotal) return;
        handleAddTx({
            label: "Courses (Scan)",
            amount: scannedTotal.toString(),
            type: "depense",
            category: "Alimentation"
        });
        setAddStatus('success');
        setTimeout(() => {
            setAddStatus('idle');
            setScannedTotal(null);
        }, 1500);
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-12 gap-8">

            <div className="md:col-span-4 space-y-8">

                <Card className={`h-fit border-0 ${cardGlass} p-6 relative overflow-hidden`}>
                    {scanning && <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center"><ScanLine className="w-16 h-16 text-emerald-400 animate-ping" /><p className="mt-4 font-bold text-emerald-400 uppercase tracking-widest animate-pulse">{t.pantry.scanning}</p></div>}
                    <CardHeader><CardTitle className="text-sm uppercase tracking-widest text-zinc-400 font-bold">{t.pantry.scanBtn}</CardTitle></CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed border-white/20 rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors relative group">
                            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                            <Camera className="w-8 h-8 text-zinc-500 mb-2 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider group-hover:text-emerald-300 transition-colors">{t.pantry.scanDesc}</span>
                            <input type="file" accept="image/*" capture="environment" onChange={handleUploadReceipt} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </CardContent>
                </Card>


                <Card className={`h-fit border-0 ${cardGlass} p-6`}>
                    <CardHeader><CardTitle className="text-sm uppercase tracking-widest text-zinc-400 font-bold">{t.pantry.addItem}</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <Input placeholder={t.pantry.itemPlaceholder} className={inputStyle} value={pantryForm.item} onChange={(e: any) => setPantryForm({ ...pantryForm, item: e.target.value })} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder={t.pantry.qtyPlaceholder} className={inputStyle} value={pantryForm.qty} onChange={(e: any) => setPantryForm({ ...pantryForm, qty: e.target.value })} />
                            <Select value={pantryForm.category} onValueChange={(val) => setPantryForm({ ...pantryForm, category: val })}>
                                <SelectTrigger className={selectStyle}>
                                    <SelectValue placeholder={t.pantry.category} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Autre">{cats.Autre}</SelectItem>
                                    <SelectItem value="Viandes">{cats.Viandes}</SelectItem>
                                    <SelectItem value="Legumes">{cats.Legumes}</SelectItem>
                                    <SelectItem value="Laitiers">{cats.Laitiers}</SelectItem>
                                    <SelectItem value="Epicerie">{cats.Epicerie}</SelectItem>
                                    <SelectItem value="Surgeles">{cats.Surgeles}</SelectItem>
                                    <SelectItem value="Boisson">{cats.Boisson}</SelectItem>
                                    <SelectItem value="Hygiene">{cats.Hygiene}</SelectItem>
                                    <SelectItem value="Maison">{cats.Maison}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Input type="date" className={inputStyle} value={pantryForm.expiry} onChange={(e: any) => setPantryForm({ ...pantryForm, expiry: e.target.value })} />
                        <Button onClick={handleAddPantry} className="w-full bg-cyan-500 hover:bg-cyan-400 h-14 rounded-xl font-black text-black text-lg shadow-lg hover:scale-105 transition-all">{t.pantry.add}</Button>
                    </CardContent>
                </Card>
            </div>


            <div className="md:col-span-8">
                <Card className={`border-0 ${cardGlass} h-full`}>
                    <CardHeader><CardTitle className="text-xl font-black uppercase tracking-wider">{t.pantry.title}</CardTitle></CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px] pr-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(data?.pantry || []).length === 0 ? <div className="col-span-2 text-center text-zinc-600 py-10 italic">{t.pantry.empty}</div> :
                                    (data?.pantry || []).map((p: any) => (
                                        <motion.div variants={item} key={p.id} className={`flex justify-between items-center p-5 rounded-2xl border transition-all group ${isLight ? 'bg-white/40 border-emerald-900/5 hover:bg-white/80' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                            <div className="flex items-center gap-5">
                                                <div className={`p-4 rounded-xl ${isLight ? 'bg-emerald-100/50' : 'bg-black/40'}`}>{getCategoryIcon(p.category)}</div>
                                                <div>
                                                    <div className={`font-bold text-lg ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>{p.item}</div>
                                                    <div className="text-sm text-zinc-500 mt-1 font-medium">{p.qty} • <span className={isLight ? 'text-emerald-600' : 'text-emerald-400'}>{cats[p.category as keyof typeof cats] || p.category}</span></div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeletePantry(p.id)} className="text-zinc-600 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl"><Trash2 className="w-5 h-5" /></Button>
                                        </motion.div>
                                    ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>


            <Dialog open={scannedTotal !== null} onOpenChange={(open) => !open && setScannedTotal(null)}>
                <DialogContent className="bg-zinc-950 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>{t.dialog.scanTotal}</DialogTitle>
                        <DialogDescription>{t.dialog.addToExpenses}</DialogDescription>
                    </DialogHeader>
                    <div className="py-6 flex justify-center">
                        <div className="text-4xl font-black text-emerald-400 font-mono">{scannedTotal?.toFixed(2)} €</div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setScannedTotal(null)}>{t.common.cancel}</Button>
                        <Button onClick={handleConfirmExpense} disabled={addStatus === 'success'} className={`font-bold transition-all ${addStatus === 'success' ? 'bg-emerald-500 scale-105' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
                            {addStatus === 'success' ? <><Check className="w-4 h-4 mr-2" /> Ajouté !</> : <><Check className="w-4 h-4 mr-2" /> {t.common.confirm}</>}
                        </Button>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        </motion.div >
    )
}
