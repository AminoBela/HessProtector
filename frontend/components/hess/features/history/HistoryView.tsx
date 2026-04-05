import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, Trash2, Pencil, Loader2 } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { container, item } from "@/lib/animations";
import { usePrivacy } from "@/context/PrivacyContext";
import { Translations } from "@/lib/i18n";

interface HistoryViewProps {
  data: any;
  handleDeleteTx: (id: number) => void;
  handleUpdateTx?: (id: number, form: any) => void;
  language: string;
  theme: string;
}

export function HistoryView({
  data,
  handleDeleteTx,
  handleUpdateTx,
  language,
  theme,
}: HistoryViewProps) {
  const { isBlurred } = usePrivacy();
  const t = Translations[language as keyof typeof Translations] || Translations.fr;
  const [isSaving, setIsSaving] = useState(false);
  const [editingTx, setEditingTx] = useState<any>(null);
  const [actionMenuTx, setActionMenuTx] = useState<any>(null);
  const [deletingTxId, setDeletingTxId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({
    label: "",
    amount: "",
    type: "",
    category: "",
    date: "",
  });

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

  const isLight = theme === "light";
  const cardGlass = isLight
    ? "card-glass card-glass-light"
    : "card-glass card-glass-dark";

  const inputStyle = isLight
    ? "bg-white/50 border-emerald-900/10 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 min-h-[56px] h-14 rounded-2xl shadow-sm px-4"
    : "bg-black/20 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/50 min-h-[56px] h-14 rounded-2xl shadow-inner px-4";

  const selectStyle = isLight
    ? "w-full min-h-[56px] h-14 px-4 rounded-2xl border border-emerald-900/10 bg-white/50 text-slate-800 focus:ring-2 focus:ring-emerald-500/50 shadow-sm flex items-center justify-between"
    : "w-full min-h-[56px] h-14 px-4 rounded-2xl border border-white/10 bg-black/20 text-white focus:ring-2 focus:ring-emerald-500/50 shadow-inner flex items-center justify-between";

  const itemBg = isLight
    ? "bg-white border-emerald-900/5 hover:bg-emerald-50/50"
    : "bg-white/5 border-white/5 hover:bg-white/10";
  const bigTextColor = isLight ? "text-slate-800" : "text-white";
  const subTextColor = isLight ? "text-slate-500" : "text-zinc-500";
  const trashColor = isLight
    ? "text-slate-400 hover:text-rose-500"
    : "text-zinc-600 hover:text-rose-400";
  const editColor = isLight
    ? "text-slate-400 hover:text-blue-500"
    : "text-zinc-600 hover:text-blue-400";

  return (
    <motion.div key={language} variants={container} initial="hidden" animate="show">
      <Card className={`border-0 ${cardGlass}`}>
        <CardContent className="p-4 md:p-8">
          <ScrollArea className="h-[600px] pr-2 md:pr-4">
            <div className="space-y-3">
              {(data?.transactions || []).length === 0 ? (
                <div className={`text-center mt-10 ${subTextColor}`}>
                  {t?.history?.empty || "Aucun historique"}
                </div>
              ) : (
                (data?.transactions || []).map((tx: any) => (
                  <div
                    key={tx.id}
                    onClick={() => setActionMenuTx(tx)}
                    className={`flex flex-row justify-between items-center p-3 md:p-5 rounded-2xl border transition-all duration-300 gap-2 md:gap-4 cursor-pointer hover:shadow-lg ${itemBg}`}
                  >
                    <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0">
                      <div
                        className={`p-2 md:p-3 shrink-0 rounded-xl ${tx.type === "revenu" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}
                      >
                        <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-sm md:text-lg truncate ${bigTextColor}`}>
                          {tx.label}
                        </div>
                        <div
                          className={`text-[10px] md:text-xs uppercase font-bold tracking-wider truncate ${subTextColor}`}
                        >
                          {tx.date} • {tx.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-4 justify-end shrink-0">
                      <span
                        className={`font-mono text-sm md:text-xl font-bold transition-all duration-300 ${tx.type === "revenu" ? "text-emerald-500" : "text-rose-500"} ${isBlurred ? "blur-md select-none" : "blur-none"}`}
                      >
                        {tx.type === "revenu" ? "+" : "-"}
                        {tx.amount.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <Dialog
            open={!!actionMenuTx}
            onOpenChange={(open) => !open && setActionMenuTx(null)}
          >
            <DialogContent
              className={
                isLight
                  ? "bg-white/95 backdrop-blur-xl border-emerald-900/10 text-slate-800 w-11/12 max-w-sm rounded-3xl"
                  : "bg-zinc-950/95 backdrop-blur-xl border-white/10 text-white w-11/12 max-w-sm rounded-3xl"
              }
            >
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-black">{actionMenuTx?.label}</DialogTitle>
                <div className={`text-center font-bold text-sm ${actionMenuTx?.type === "revenu" ? "text-emerald-500" : "text-rose-500"}`}>
                  {actionMenuTx?.type === "revenu" ? "+" : "-"}{actionMenuTx?.amount.toFixed(2)}€
                </div>
              </DialogHeader>
              <div className="flex flex-col gap-3 py-4">
                <Button
                  variant="outline"
                  className={`h-14 font-bold rounded-2xl flex items-center justify-start gap-4 px-6 shadow-sm border ${isLight ? "bg-slate-50 border-slate-200 hover:bg-slate-100" : "bg-black/20 border-white/5 hover:bg-white/5"}`}
                  onClick={() => { openEdit(actionMenuTx); setActionMenuTx(null); }}
                >
                  <Pencil className="w-5 h-5 text-emerald-500" /> <span className="text-base">{t.common?.edit || "Modifier"}</span>
                </Button>
                <Button
                  variant="outline"
                  className={`h-14 font-bold rounded-2xl flex items-center justify-start gap-4 px-6 shadow-sm border text-rose-500 hover:text-rose-600 ${isLight ? "bg-rose-50 border-rose-100 hover:bg-rose-100" : "bg-rose-950/20 border-rose-900/30 hover:bg-rose-900/40"}`}
                  onClick={() => { setDeletingTxId(actionMenuTx.id); setActionMenuTx(null); }}
                >
                  <Trash2 className="w-5 h-5" /> <span className="text-base">{t.common?.delete || "Supprimer"}</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={!!editingTx}
            onOpenChange={(open) => !open && setEditingTx(null)}
          >
            <DialogContent
              className={
                isLight
                  ? "bg-white/95 backdrop-blur-2xl border-emerald-900/10 text-slate-800 w-11/12 max-w-lg rounded-[32px] p-6 md:p-8"
                  : "bg-zinc-950/95 backdrop-blur-2xl border-white/10 text-white w-11/12 max-w-lg rounded-[32px] p-6 md:p-8"
              }
            >
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-black tracking-tight">{t.common.edit || "Modifier"} {t.history.title || "Transaction"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 md:space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-2">{t.dialog.label || "Libellé"}</label>
                  <Input
                  placeholder={t.dialog.label}
                  className={inputStyle}
                  value={editForm.label}
                  onChange={(e) =>
                    setEditForm({ ...editForm, label: e.target.value })
                  }
                />
                </div>
                <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-2">{t.dialog.amount || "Montant"}</label>
                    <Input
                      type="number"
                      placeholder={t.dialog.amount}
                      className={inputStyle}
                      value={editForm.amount}
                      onChange={(e) =>
                        setEditForm({ ...editForm, amount: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-2">Date</label>
                    <Input
                    type="date"
                    className={inputStyle}
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, date: e.target.value })
                    }
                />
                  </div>
                </div>
                <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-2">{t.dialog.type || "Type"}</label>
                    <Select
                    value={editForm.type}
                    onValueChange={(val) =>
                      setEditForm({ ...editForm, type: val })
                    }
                  >
                    <SelectTrigger className={selectStyle}>
                      <SelectValue placeholder={t.dialog.type} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="depense">{t.dialog.expense}</SelectItem>
                      <SelectItem value="revenu">{t.dialog.income}</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-2">{t.dialog.category || "Catégorie"}</label>
                    <Select
                    value={editForm.category}
                    onValueChange={(val) =>
                      setEditForm({ ...editForm, category: val })
                    }
                  >
                    <SelectTrigger className={selectStyle}>
                      <SelectValue placeholder={t.dialog.category} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alimentation">Alimentation</SelectItem>
                      <SelectItem value="Voiture">Voiture</SelectItem>
                      <SelectItem value="Loyer/Charges">
                        Loyer/Charges
                      </SelectItem>
                      <SelectItem value="Loisir">Loisir</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                </div>
                <Button
                  variant="premium"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full h-14 mt-4 rounded-2xl font-black tracking-wider text-base shadow-lg"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    t.common.save
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={!!deletingTxId}
            onOpenChange={(open) => !open && setDeletingTxId(null)}
          >
            <DialogContent
              className={
                isLight
                  ? "bg-white/90 backdrop-blur-xl border-emerald-900/10 text-slate-800"
                  : "bg-zinc-950/90 backdrop-blur-xl border-white/10 text-white"
              }
            >
              <DialogHeader>
                <DialogTitle>{t.common.delete}</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <p className={subTextColor}>
                  {t.settings?.account?.deleteDesc || "Action irreversible."}
                </p>
                <div className="flex gap-4 pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => setDeletingTxId(null)}
                    className="flex-1 h-12 rounded-xl font-bold"
                  >
                    {t.common.cancel}
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    className="flex-1 h-12 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg"
                  >
                    {t.common.confirm}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </motion.div>
  );
}
