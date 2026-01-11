import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, ScanLine, Camera, Utensils, Package, Beef, Milk, Carrot } from "lucide-react"

const getCategoryIcon = (cat: string) => {
    switch (cat) {
        case 'Frais/Viande': return <Beef className="w-5 h-5 text-rose-300" />;
        case 'Laitier': return <Milk className="w-5 h-5 text-sky-200" />;
        case 'Légumes': return <Carrot className="w-5 h-5 text-orange-300" />;
        default: return <Package className="w-5 h-5 text-zinc-300" />;
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
    theme
}: PantryViewProps) {
    const isLight = theme === 'light';
    const cardGlass = isLight
        ? "bg-white/70 backdrop-blur-xl border-emerald-900/5 shadow-xl text-slate-800 rounded-3xl overflow-hidden hover:bg-white/80 transition-colors duration-500"
        : "bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-2xl text-white rounded-3xl overflow-hidden hover:bg-zinc-900/50 transition-colors duration-500";

    const inputStyle = isLight
        ? "bg-white border-emerald-900/10 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all h-12 rounded-xl px-4 font-medium shadow-inner"
        : "bg-zinc-900/60 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all h-12 rounded-xl px-4 font-medium shadow-inner";

    const selectStyle = isLight
        ? "w-full h-12 px-4 rounded-xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50 cursor-pointer backdrop-blur-xl transition-all shadow-inner font-medium"
        : "w-full h-12 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50 cursor-pointer backdrop-blur-xl transition-all shadow-inner font-medium";

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 space-y-8">
                <Card className={`h-fit border-0 ${cardGlass} p-6 relative overflow-hidden`}>
                    {scanning && <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center"><ScanLine className="w-16 h-16 text-emerald-400 animate-ping" /><p className="mt-4 font-bold text-emerald-400 uppercase tracking-widest animate-pulse">Analyse IA en cours...</p></div>}
                    <CardHeader><CardTitle className="text-sm uppercase tracking-widest text-zinc-400 font-bold">Scanner un Ticket</CardTitle></CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed border-white/20 rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative">
                            <Camera className="w-8 h-8 text-zinc-500 mb-2" />
                            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Photo / Upload</span>
                            <input type="file" accept="image/*" onChange={handleUploadReceipt} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </CardContent>
                </Card>
                <Card className={`h-fit border-0 ${cardGlass} p-6`}><CardHeader><CardTitle className="text-sm uppercase tracking-widest text-zinc-400 font-bold">Ajout Manuel</CardTitle></CardHeader><CardContent className="space-y-6"><Input placeholder="Produit (ex: Pâtes)" className={inputStyle} value={pantryForm.item} onChange={(e: any) => setPantryForm({ ...pantryForm, item: e.target.value })} /><div className="grid grid-cols-2 gap-4"><Input placeholder="Qté" className={inputStyle} value={pantryForm.qty} onChange={(e: any) => setPantryForm({ ...pantryForm, qty: e.target.value })} /><select className={selectStyle} value={pantryForm.category} onChange={(e: any) => setPantryForm({ ...pantryForm, category: e.target.value })}><option value="Autre">Autre</option><option value="Frais/Viande">Frais</option><option value="Laitier">Laitier</option><option value="Légumes">Légumes</option></select></div><Input type="date" className={inputStyle} value={pantryForm.expiry} onChange={(e: any) => setPantryForm({ ...pantryForm, expiry: e.target.value })} /><Button onClick={handleAddPantry} className="w-full bg-cyan-500 hover:bg-cyan-400 h-14 rounded-xl font-black text-black text-lg shadow-lg">Ajouter</Button></CardContent></Card>
            </div>
            <div className="md:col-span-8">
                <Card className={`border-0 ${cardGlass} h-full`}><CardHeader><CardTitle className="text-xl font-black uppercase tracking-wider">Inventaire Cuisine</CardTitle></CardHeader><CardContent><ScrollArea className="h-[600px] pr-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{data.pantry.length === 0 ? <div className="col-span-2 text-center text-zinc-600 py-10">Frigo vide</div> : data.pantry.map((p: any) => (<div key={p.id} className="flex justify-between items-center p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group"><div className="flex items-center gap-5"><div className="p-4 bg-black/40 rounded-xl">{getCategoryIcon(p.category)}</div><div><div className="font-bold text-lg text-zinc-200">{p.item}</div><div className="text-sm text-zinc-500 mt-1 font-medium">{p.qty}</div></div></div><Button variant="ghost" size="icon" onClick={() => handleDeletePantry(p.id)} className="text-zinc-600 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl"><Trash2 className="w-5 h-5" /></Button></div>))}</div></ScrollArea></CardContent></Card>
            </div>
        </div>
    )
}
