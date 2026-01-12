import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Trash2, Pencil, Loader2 } from "lucide-react"

interface HistoryViewProps {
    data: any;
    handleDeleteTx: (id: number) => void;
    handleUpdateTx?: (id: number, form: any) => void;
    language: string;
    theme: string;
}

export function HistoryView({ data, handleDeleteTx, handleUpdateTx, language, theme }: HistoryViewProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [editingTx, setEditingTx] = useState<any>(null);
    const [deletingTxId, setDeletingTxId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<any>({ label: "", amount: "", type: "", category: "", date: "" });

    const openEdit = (tx: any) => {
        setEditingTx(tx);
        setEditForm({ ...tx, amount: tx.amount.toString() });
    };

    const confirmDelete = () => {
        if (deletingTxId) {
            handleDeleteTx(deletingTxId);
            setDeletingTxId(null);
        }
    };

    const handleSave = async () => {
        if (handleUpdateTx && editingTx) {
            setIsSaving(true);
            await handleUpdateTx(editingTx.id, editForm);
            setIsSaving(false);
            setEditingTx(null);
        }
    };

    const isLight = theme === 'light';
    const cardGlass = isLight
        ? "bg-white/70 backdrop-blur-xl border-emerald-900/5 shadow-xl text-slate-800 rounded-3xl overflow-hidden hover:bg-white/80 transition-colors duration-500"
        : "bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-2xl text-white rounded-3xl overflow-hidden hover:bg-zinc-900/50 transition-colors duration-500";

    const inputStyle = isLight
        ? "bg-white border-emerald-900/10 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 h-12 rounded-xl"
        : "bg-zinc-950/60 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/50 h-12 rounded-xl";

    const selectStyle = isLight
        ? "w-full h-12 px-4 rounded-xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50"
        : "w-full h-12 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50";

    const itemBg = isLight ? "bg-white border-emerald-900/5 hover:bg-emerald-50/50" : "bg-white/5 border-white/5 hover:bg-white/10";
    const bigTextColor = isLight ? "text-slate-800" : "text-white";
    const subTextColor = isLight ? "text-slate-500" : "text-zinc-500";
    const trashColor = isLight ? "text-slate-400 hover:text-rose-500" : "text-zinc-600 hover:text-rose-400";
    const editColor = isLight ? "text-slate-400 hover:text-blue-500" : "text-zinc-600 hover:text-blue-400";

    return (
        <Card className={`border-0 ${cardGlass}`}>
            <CardContent className="p-8">
                <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-3">
                        {(data?.transactions || []).length === 0 ? <div className={`text-center mt-10 ${subTextColor}`}>Aucun historique</div> : (data?.transactions || []).map((tx: any) => (
                            <div key={tx.id} className={`flex justify-between items-center p-5 rounded-2xl border transition-all ${itemBg}`}>
                                <div className="flex items-center gap-5">
                                    <div className={`p-3 rounded-xl ${tx.type === 'revenu' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className={`font-bold text-lg ${bigTextColor}`}>{tx.label}</div>
                                        <div className={`text-xs uppercase font-bold tracking-wider ${subTextColor}`}>{tx.date} • {tx.category}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`font-mono text-xl font-bold ${tx.type === 'revenu' ? 'text-emerald-500' : 'text-rose-500'}`}>{tx.type === 'revenu' ? '+' : '-'}{tx.amount.toFixed(2)}€</span>

                                    <Button variant="ghost" size="icon" onClick={() => openEdit(tx)}>
                                        <Pencil className={`w-5 h-5 ${editColor}`} />
                                    </Button>

                                    <Button variant="ghost" size="icon" onClick={() => setDeletingTxId(tx.id)}>
                                        <Trash2 className={`w-5 h-5 ${trashColor}`} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <Dialog open={!!editingTx} onOpenChange={(open) => !open && setEditingTx(null)}>
                    <DialogContent className={isLight ? "bg-white/90 backdrop-blur-xl border-emerald-900/10 text-slate-800" : "bg-zinc-950/90 backdrop-blur-xl border-white/10 text-white"}>
                        <DialogHeader>
                            <DialogTitle>Modifier la Transaction</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input placeholder="Libellé" className={inputStyle} value={editForm.label} onChange={e => setEditForm({ ...editForm, label: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input type="number" placeholder="Montant" className={inputStyle} value={editForm.amount} onChange={e => setEditForm({ ...editForm, amount: e.target.value })} />
                                <Input type="date" className={inputStyle} value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Select value={editForm.type} onValueChange={val => setEditForm({ ...editForm, type: val })}>
                                    <SelectTrigger className={selectStyle}><SelectValue placeholder="Type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="depense">Dépense</SelectItem>
                                        <SelectItem value="revenu">Revenu</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={editForm.category} onValueChange={val => setEditForm({ ...editForm, category: val })}>
                                    <SelectTrigger className={selectStyle}><SelectValue placeholder="Catégorie" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Alimentation">Alimentation</SelectItem>
                                        <SelectItem value="Voiture">Voiture</SelectItem>
                                        <SelectItem value="Loyer/Charges">Loyer/Charges</SelectItem>
                                        <SelectItem value="Loisir">Loisir</SelectItem>
                                        <SelectItem value="Autre">Autre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleSave} disabled={isSaving} className="w-full h-12 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Enregistrer"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={!!deletingTxId} onOpenChange={(open) => !open && setDeletingTxId(null)}>
                    <DialogContent className={isLight ? "bg-white/90 backdrop-blur-xl border-emerald-900/10 text-slate-800" : "bg-zinc-950/90 backdrop-blur-xl border-white/10 text-white"}>
                        <DialogHeader>
                            <DialogTitle>Supprimer la Transaction</DialogTitle>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <p className={subTextColor}>Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible.</p>
                            <div className="flex gap-4 pt-2">
                                <Button variant="ghost" onClick={() => setDeletingTxId(null)} className="flex-1 h-12 rounded-xl font-bold">Annuler</Button>
                                <Button onClick={confirmDelete} className="flex-1 h-12 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg">
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )

}
