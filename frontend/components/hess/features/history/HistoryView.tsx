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
    ? "bg-white border-emerald-900/10 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 h-12 rounded-xl"
    : "bg-zinc-950/60 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/50 h-12 rounded-xl";

  const selectStyle = isLight
    ? "w-full h-12 px-4 rounded-xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50"
    : "w-full h-12 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50";

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
        <CardContent className="p-8">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {(data?.transactions || []).length === 0 ? (
                <div className={`text-center mt-10 ${subTextColor}`}>
                  {t?.history?.empty || "Aucun historique"}
                </div>
              ) : (
                (data?.transactions || []).map((tx: any) => (
                  <motion.div
                    variants={item}
                    key={tx.id}
                    className={`flex flex-row justify-between items-center p-3 md:p-5 rounded-2xl border transition-colors duration-300 gap-2 md:gap-4 ${itemBg}`}
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

                      <div className="flex gap-1 md:gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 md:w-10 md:h-10 shrink-0"
                          onClick={() => openEdit(tx)}
                        >
                          <Pencil className={`w-4 h-4 md:w-5 md:h-5 ${editColor}`} />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 md:w-10 md:h-10"
                          onClick={() => setDeletingTxId(tx.id)}
                        >
                          <Trash2 className={`w-4 h-4 md:w-5 md:h-5 ${trashColor}`} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>

          <Dialog
            open={!!editingTx}
            onOpenChange={(open) => !open && setEditingTx(null)}
          >
            <DialogContent
              className={
                isLight
                  ? "bg-white/90 backdrop-blur-xl border-emerald-900/10 text-slate-800"
                  : "bg-zinc-950/90 backdrop-blur-xl border-white/10 text-white"
              }
            >
              <DialogHeader>
                <DialogTitle>{t.common.edit || "Modifier"} {t.history.title || "Transaction"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  placeholder={t.dialog.label}
                  className={inputStyle}
                  value={editForm.label}
                  onChange={(e) =>
                    setEditForm({ ...editForm, label: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder={t.dialog.amount}
                    className={inputStyle}
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm({ ...editForm, amount: e.target.value })
                    }
                  />
                  <Input
                    type="date"
                    className={inputStyle}
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, date: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                <Button
                  variant="premium"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full h-12 rounded-xl"
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
