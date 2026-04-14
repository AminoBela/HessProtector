import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  ScanLine,
  Camera,
  Package,
  Beef,
  Milk,
  Carrot,
  Wine,
  Home,
  Check,
  ThermometerSnowflake,
  Utensils,
} from "lucide-react";
import { Translations } from "@/lib/i18n";
import { motion, Variants } from "framer-motion";
import { container, item } from "@/lib/animations";
import { PremiumDatePicker } from "@/components/ui/premium-date-picker";
import { differenceInDays } from "date-fns";
import { AlertCircle } from "lucide-react";

const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case "Viandes":
      return <Beef className="w-5 h-5 text-rose-300" />;
    case "Laitiers":
      return <Milk className="w-5 h-5 text-sky-200" />;
    case "Legumes":
      return <Carrot className="w-5 h-5 text-orange-300" />;
    case "Boisson":
      return <Wine className="w-5 h-5 text-purple-300" />;
    case "Maison":
    case "Hygiene":
      return <Home className="w-5 h-5 text-indigo-300" />;
    case "Surgeles":
      return <ThermometerSnowflake className="w-5 h-5 text-cyan-300" />;
    case "Epicerie":
    default:
      return <Package className="w-5 h-5 text-zinc-300" />;
  }
};

interface PantryItem {
  id: number;
  item: string;
  qty: string;
  category: string;
  expiry?: string;
}

interface PantryForm {
  item: string;
  qty: string;
  category: string;
  expiry: string;
}

interface PantryViewProps {
  data: { pantry: PantryItem[] };
  pantryForm: PantryForm;
  setPantryForm: (form: PantryForm) => void;
  handleAddPantry: () => void;
  handleDeletePantry: (id: number) => void;
  scanning: boolean;
  handleUploadReceipt: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  handleAddTx,
}: PantryViewProps) {
  const isLight = theme === "light";
  const cardGlass = isLight
    ? "card-glass card-glass-light"
    : "card-glass card-glass-dark";

  const inputStyle = isLight
    ? "bg-white border-emerald-900/10 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-[border-color,box-shadow] !h-14 rounded-xl px-4 font-medium shadow-inner"
    : "bg-zinc-900/60 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-[border-color,box-shadow] !h-14 rounded-xl px-4 font-medium shadow-inner";

  const selectStyle = isLight
    ? "w-full !h-14 px-4 rounded-xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50 cursor-pointer transition-[border-color,box-shadow] shadow-inner font-medium"
    : "w-full !h-14 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50 cursor-pointer transition-[border-color,box-shadow] shadow-inner font-medium";

  const t =
    Translations[language as keyof typeof Translations] || Translations.fr;
  const cats = t.pantry.categories;

  const [addStatus, setAddStatus] = useState<"idle" | "success">("idle");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectMode, setSelectMode] = useState(false);

  const allIds = useMemo(() => (data?.pantry || []).map((p: PantryItem) => p.id), [data?.pantry]);
  const allSelected = allIds.length > 0 && selectedIds.size === allIds.length;

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  };

  const handleBatchDelete = () => {
    selectedIds.forEach(id => handleDeletePantry(id));
    setSelectedIds(new Set());
    setSelectMode(false);
  };

  const handleConfirmExpense = () => {
    if (!scannedTotal) return;
    handleAddTx({
      label: "Courses (Scan)",
      amount: scannedTotal.toString(),
      type: "depense",
      category: "Alimentation",
    });
    setAddStatus("success");
    setTimeout(() => {
      setAddStatus("idle");
      setScannedTotal(null);
    }, 1500);
  };

  return (
    <motion.div
      key={language}
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-12 gap-8"
    >
      <div className="md:col-span-4 space-y-8">
        <Card
          className={`h-fit border-0 ${cardGlass} p-6 relative overflow-hidden`}
        >
          {scanning && (
            <div className="absolute inset-0 bg-black/95 z-30 flex flex-col items-center justify-center overflow-hidden rounded-3xl">
              <div className="relative w-48 h-48 border-2 border-emerald-500/20 rounded-2xl p-4 flex items-center justify-center">
                <motion.div 
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-emerald-400 blur-[2px] shadow-[0_0_20px_5px_rgba(52,211,153,0.8)] z-50 rounded-full"
                />
                <ScanLine className="w-20 h-20 text-emerald-500/40" />
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <p className="font-mono font-bold text-emerald-400 uppercase tracking-[0.2em] animate-pulse text-sm">
                  {t.pantry.scanning || "ANALYSE IA EN COURS..."}
                </p>
              </div>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-widest text-zinc-400 font-bold">
              {t.pantry.scanBtn}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-white/20 rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors relative group">
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <Camera className="w-8 h-8 text-zinc-500 mb-2 group-hover:text-emerald-400 transition-colors" />
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider group-hover:text-emerald-300 transition-colors">
                {t.pantry.scanDesc}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic"
                capture="environment"
                onChange={handleUploadReceipt}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        <Card className={`h-fit border-0 ${cardGlass} p-6`}>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-widest text-zinc-400 font-bold">
              {t.pantry.addItem}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              placeholder={t.pantry.itemPlaceholder}
              className={inputStyle}
              value={pantryForm.item}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPantryForm({ ...pantryForm, item: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder={t.pantry.qtyPlaceholder}
                className={inputStyle}
                value={pantryForm.qty}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPantryForm({ ...pantryForm, qty: e.target.value })
                }
              />
              <Select
                value={pantryForm.category}
                onValueChange={(val) =>
                  setPantryForm({ ...pantryForm, category: val })
                }
              >
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
            <div className="space-y-2">
              <label className="block mb-2 text-xs font-bold uppercase text-zinc-400">{t.pantry.expiryLabel}</label>
              <PremiumDatePicker
                date={pantryForm.expiry ? new Date(pantryForm.expiry) : undefined}
                setDate={(date) => setPantryForm({ ...pantryForm, expiry: date ? date.toISOString().split("T")[0] : "" })}
                isLight={isLight}
                language={language}
              />
            </div>
            <Button
              variant="premium"
              size="xl"
              onClick={handleAddPantry}
              className="w-full mt-2"
            >
              {t.pantry.add}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-8">
        <Card className={`border-0 ${cardGlass} h-full`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black uppercase tracking-wider">
              {t.pantry.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectMode && selectedIds.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBatchDelete}
                  className="h-9 rounded-xl font-bold text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  {t.common.deleteSelected} ({selectedIds.size})
                </Button>
              )}
              {selectMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSelectAll}
                  className={`h-9 rounded-xl font-bold text-xs ${isLight ? "border-slate-200" : "border-white/10"}`}
                >
                  {allSelected ? t.common.deselectAll : t.common.selectAll}
                </Button>
              )}
              {(data?.pantry || []).length > 0 && (
                <Button
                  variant={selectMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectMode(!selectMode);
                    if (selectMode) setSelectedIds(new Set());
                  }}
                  className={`h-9 rounded-xl font-bold text-xs ${selectMode ? "bg-emerald-500 text-white" : isLight ? "border-slate-200" : "border-white/10"}`}
                >
                  {selectMode ? t.common.cancel : t.common.edit}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {(data?.pantry || []).length === 0 ? (
                  <div className={`col-span-2 flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl ${isLight ? "border-slate-300 bg-slate-50/50" : "border-white/10 bg-white/5"}`}>
                    <Utensils className={`w-16 h-16 mb-4 ${isLight ? 'text-slate-300' : 'text-zinc-600'}`} />
                    <h3 className={`text-xl font-black mb-2 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>{t.common?.emptyTitle || (language === "es" ? "Despensa vacía" : "Garde-manger vide")}</h3>
                    <p className={`text-sm max-w-md ${isLight ? "text-slate-500" : "text-zinc-400"}`}>{t.pantry.empty || (language === "es" ? "Añade alimentos o escanea un ticket de compra." : "Ajoutez des aliments ou scannez un ticket.")}</p>
                  </div>
                ) : (
                  <div className="col-span-1 md:col-span-2 space-y-8">
                    {Object.entries((data?.pantry || []).reduce((acc: any, p: PantryItem) => {
                      if (!acc[p.category]) acc[p.category] = [];
                      acc[p.category].push(p);
                      return acc;
                    }, {})).map(([category, items]: [string, any]) => (
                      <div key={category} className="space-y-4">
                        <div className="flex items-center gap-3 border-b pb-2 border-slate-200 dark:border-white/10">
                          <div className={`p-2 rounded-lg ${isLight ? "bg-slate-100" : "bg-white/5"}`}>
                            {getCategoryIcon(category)}
                          </div>
                          <h3 className={`font-black text-lg tracking-wider uppercase ${isLight ? "text-slate-800" : "text-zinc-200"}`}>
                            {cats[category as keyof typeof cats] || category}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isLight ? "bg-slate-200 text-slate-600" : "bg-white/10 text-zinc-400"}`}>
                            {items.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {items.map((p: PantryItem) => {
                            const expiryDays = p.expiry ? differenceInDays(new Date(p.expiry), new Date()) : null;
                            const isExpiringSoon = expiryDays !== null && expiryDays <= 3 && expiryDays >= 0;
                            const isExpired = expiryDays !== null && expiryDays < 0;

                            return (
                              <motion.div variants={item} initial="hidden" animate="show" layout key={p.id}>
                                <div
                                  onClick={() => selectMode && toggleSelect(p.id)}
                                  className={`flex justify-between items-center p-5 rounded-2xl border group relative overflow-hidden ${selectMode ? "cursor-pointer" : ""} ${
                                    selectedIds.has(p.id) ? (isLight ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/30" : "bg-emerald-500/10 border-emerald-500/30 ring-2 ring-emerald-500/30") :
                                    isExpired 
                                    ? (isLight ? "bg-rose-50/50 border-rose-200" : "bg-rose-950/20 border-rose-900/50") 
                                    : (isLight ? "bg-white/40 border-emerald-900/5 hover:bg-white/80 transition-colors" : "bg-white/5 border-white/5 hover:bg-white/10 transition-colors")
                                  }`}
                                >
                                  {isExpiringSoon && (
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                                  )}
                                  {isExpired && (
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-600" />
                                  )}
                                  <div className="flex items-center gap-5">
                                    {selectMode && (
                                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                                        selectedIds.has(p.id) ? "bg-emerald-500 border-emerald-500" : isLight ? "border-slate-300" : "border-white/20"
                                      }`}>
                                        {selectedIds.has(p.id) && <Check className="w-4 h-4 text-white" />}
                                      </div>
                                    )}
                                    <div
                                      className={`p-4 rounded-xl ${isLight ? "bg-emerald-100/50" : "bg-black/40"}`}
                                    >
                                      {getCategoryIcon(p.category)}
                                    </div>
                                    <div>
                                      <div
                                        className={`font-bold text-lg flex items-center gap-2 ${isLight ? "text-slate-800" : "text-zinc-200"}`}
                                      >
                                        {p.item}
                                        {isExpiringSoon && <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />}
                                      </div>
                                      <div className="text-sm text-zinc-500 mt-1 font-medium flex items-center flex-wrap gap-2">
                                        <span>{p.qty}</span>
                                        {p.expiry && (
                                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                            isExpired ? "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400" :
                                            isExpiringSoon ? "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400" :
                                            "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                                          }`}>
                                            {isExpired ? "Périmé" : isExpiringSoon ? `J-${expiryDays}` : `DLC: ${new Date(p.expiry).toLocaleDateString()}`}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {!selectMode && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeletePantry(p.id)}
                                      className="text-zinc-600 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </Button>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={scannedTotal !== null}
        onOpenChange={(open) => !open && setScannedTotal(null)}
      >
        <DialogContent
          className={
            isLight
              ? "bg-white/95 backdrop-blur-xl border-emerald-900/10 text-slate-800"
              : "bg-zinc-950 border-white/10 text-white"
          }
        >
          <DialogHeader>
            <DialogTitle>{t.dialog.scanTotal}</DialogTitle>
            <DialogDescription>{t.dialog.addToExpenses}</DialogDescription>
          </DialogHeader>
          <div className="py-6 flex justify-center">
            <div className="text-4xl font-black text-emerald-400 font-mono">
              {scannedTotal?.toFixed(2)} €
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setScannedTotal(null)}>
              {t.common.cancel}
            </Button>
            <Button
              onClick={handleConfirmExpense}
              disabled={addStatus === "success"}
              className={`font-bold transition-all ${addStatus === "success" ? "bg-emerald-500 scale-105" : "bg-emerald-600 hover:bg-emerald-500"}`}
            >
              {addStatus === "success" ? (
                <>
                  <Check className="w-4 h-4 mr-2" /> {t.dialog.expenseAdded}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" /> {t.common.confirm}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
