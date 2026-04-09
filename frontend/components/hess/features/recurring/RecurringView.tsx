import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, GripVertical, CalendarDays, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Translations } from "@/lib/i18n";
import { format, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths } from "date-fns";
import { fr, es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { container, item } from "@/lib/animations";
import { usePrivacy } from "@/context/PrivacyContext";

interface RecurringViewProps {
  data: any;
  recForm: any;
  setRecForm: (form: any) => void;
  handleAddRec: () => void;
  handleDeleteRec: (id: number) => void;
  handleUpdateRec?: (id: number, data: any) => Promise<boolean>;
  language: string;
  theme: string;
}

export function RecurringView({
  data,
  recForm,
  setRecForm,
  handleAddRec,
  handleDeleteRec,
  handleUpdateRec,
  language,
  theme,
}: RecurringViewProps) {
  const { isBlurred } = usePrivacy();
  const isLight = theme === "light";
  const cardGlass = isLight
    ? "card-glass card-glass-light"
    : "card-glass card-glass-dark";

  const inputStyle = isLight
    ? "bg-white border-emerald-900/10 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-[border-color,box-shadow] !h-14 rounded-xl px-4 font-medium shadow-inner"
    : "bg-zinc-950/60 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-[border-color,box-shadow] !h-14 rounded-xl px-4 font-medium shadow-inner";

  const selectStyle = isLight
    ? "w-full !h-14 px-4 rounded-xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50 cursor-pointer transition-[border-color,box-shadow] shadow-inner font-medium"
    : "w-full !h-14 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50 cursor-pointer transition-[border-color,box-shadow] shadow-inner font-medium";

  const today = new Date();
  
  // Month navigation state
  const [viewDate, setViewDate] = useState(new Date());
  const viewMonthDays = getDaysInMonth(viewDate);
  const firstDayOfViewMonth = getDay(startOfMonth(viewDate));
  const offset = firstDayOfViewMonth === 0 ? 6 : firstDayOfViewMonth - 1;

  const goNextMonth = () => setViewDate(addMonths(viewDate, 1));
  const goPrevMonth = () => setViewDate(subMonths(viewDate, 1));

  const t =
    Translations[language as keyof typeof Translations] || Translations.fr;
  const locale = language === "es" ? es : fr;

  // Mobile: selected day for detail view
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());

  // Drag & Drop state
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, bill: any) => {
    setDraggedItem(bill);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", bill.id.toString());
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, dayNum: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverDay(dayNum);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverDay(null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetDay: number) => {
    e.preventDefault();
    setDragOverDay(null);
    if (draggedItem && handleUpdateRec && draggedItem.day !== targetDay) {
      await handleUpdateRec(draggedItem.id, {
        label: draggedItem.label,
        amount: parseFloat(draggedItem.amount),
        day: targetDay,
        type: draggedItem.type
      });
    }
    setDraggedItem(null);
  }, [draggedItem, handleUpdateRec]);

  // Get bills for selected day on mobile
  const selectedDayBills = (data?.recurring || []).filter(
    (r: any) => r.day === selectedDay,
  );

  // Color helpers for bill chips
  const chipColor = (type: string) => {
    if (type === "Abonnement") {
      return isLight
        ? "bg-violet-100 text-violet-700 border-violet-200"
        : "bg-violet-500/20 text-violet-300 border-violet-500/30";
    }
    return isLight
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-amber-500/20 text-amber-300 border-amber-500/30";
  };

  // Type icon for distinction
  const chipIcon = (type: string) => {
    if (type === "Abonnement") {
      return "🔄";
    }
    return "📌";
  };

  const isCurrentMonth = viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear();

  return (
    <motion.div
      key={language}
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-12 gap-8"
    >
      <div className="md:col-span-4 space-y-8">
        <motion.div variants={item}>
          <Card className={`h-fit border-0 ${cardGlass}`}>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest text-zinc-400">
                {t.recurring.newRec}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder={t.recurring.labelPlace}
                className={inputStyle}
                value={recForm.label}
                onChange={(e: any) =>
                  setRecForm({ ...recForm, label: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder={t.recurring.amountPlace}
                className={inputStyle}
                value={recForm.amount}
                onChange={(e: any) =>
                  setRecForm({ ...recForm, amount: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder={t.recurring.dayPlace}
                  className={inputStyle}
                  value={recForm.day}
                  onChange={(e: any) =>
                    setRecForm({ ...recForm, day: e.target.value })
                  }
                />
                <Select
                  value={recForm.type}
                  onValueChange={(val) => setRecForm({ ...recForm, type: val })}
                >
                  <SelectTrigger className={selectStyle}>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixe">{t.recurring.fixe}</SelectItem>
                    <SelectItem value="Abonnement">
                      {t.recurring.sub}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="premium"
                size="xl"
                onClick={handleAddRec}
                className="w-full mt-2"
              >
                {t.recurring.add}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className={`border-0 ${cardGlass}`}>
            <CardHeader>
              <CardTitle className="text-sm uppercase text-zinc-400">
                {t.recurring.total}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-black ${isBlurred ? "blur-md select-none transition-all duration-300" : ""}`}>
                {parseFloat(data?.monthly_burn || 0).toFixed(2)}€
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                {t.recurring.subtitle}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="md:col-span-8">
        <motion.div variants={item} className="h-full">
          <Card className={`border-0 ${cardGlass} h-full`}>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle
                className={`text-xl uppercase font-black tracking-widest ${isLight ? "text-slate-400" : "text-white"}`}
              >
                {t.sidebar.recurring}
              </CardTitle>
              {/* Month Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goPrevMonth}
                  className={`p-1.5 rounded-lg transition-colors ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-white/10 text-zinc-400"}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <Badge
                  className={
                    isLight
                      ? "bg-emerald-600/10 text-emerald-800 min-w-[140px] justify-center"
                      : "bg-white/10 text-white px-3 py-1 min-w-[140px] justify-center"
                  }
                >
                  {format(viewDate, "MMMM yyyy", { locale: locale })}
                </Badge>
                <button
                  onClick={goNextMonth}
                  className={`p-1.5 rounded-lg transition-colors ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-white/10 text-zinc-400"}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {/* ═══════════════════════════════════════════ */}
              {/* DESKTOP CALENDAR — Full 7-column grid with drag & drop */}
              {/* ═══════════════════════════════════════════ */}
              <div className="hidden md:block">
                <div
                  className={`grid grid-cols-7 gap-2 p-4 rounded-2xl border ${isLight ? "bg-slate-50 border-emerald-900/5" : "bg-black/20 border-white/5"}`}
                >
                  {t.recurring.weekDays.map((d: string, i: number) => (
                    <div
                      key={i}
                      className={`p-2 text-center text-xs font-black ${isLight ? "text-slate-400" : "text-zinc-500"}`}
                    >
                      {d}
                    </div>
                  ))}
                  {Array.from({ length: offset }).map((_, i) => (
                    <div key={`e-${i}`} className="h-24"></div>
                  ))}
                  {Array.from({ length: viewMonthDays }).map((_, i) => {
                    const dayNum = i + 1;
                    const isToday = isCurrentMonth && dayNum === today.getDate();
                    const bills = (data?.recurring || []).filter(
                      (r: any) => r.day === dayNum,
                    );
                    const isDragTarget = dragOverDay === dayNum;
                    const maxVisible = 2;
                    const visibleBills = bills.slice(0, maxVisible);
                    const hiddenCount = bills.length - maxVisible;

                    const dayBg = isDragTarget
                      ? isLight
                        ? "bg-emerald-100 border-emerald-400 ring-2 ring-emerald-400/50 scale-[1.02]"
                        : "bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400/50 scale-[1.02]"
                      : isLight
                        ? isToday
                          ? "bg-purple-100 border-purple-200"
                          : "bg-white border-slate-200 hover:bg-slate-100"
                        : isToday
                          ? "bg-purple-500/10 border-purple-500/30"
                          : "bg-zinc-800/50 hover:bg-zinc-700/50 border-zinc-700/50";

                    const numColor = isLight
                      ? isToday
                        ? "text-purple-700"
                        : "text-slate-400 group-hover:text-slate-600"
                      : isToday
                        ? "text-purple-300"
                        : "text-zinc-500 group-hover:text-zinc-300";

                    return (
                      <div
                        key={dayNum}
                        onDragOver={(e) => handleDragOver(e, dayNum)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, dayNum)}
                        className={`h-24 p-2 relative rounded-xl border transition-all duration-200 group flex flex-col gap-1 ${dayBg}`}
                      >
                        <span className={`text-sm font-bold ${numColor}`}>
                          {dayNum}
                        </span>
                        <div className="flex flex-col gap-1 overflow-hidden flex-1">
                          {visibleBills.map((b: any) => (
                            <div
                              key={b.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, b)}
                              className={`flex justify-between items-center px-1.5 py-0.5 rounded-md text-[10px] border cursor-grab active:cursor-grabbing transition-all hover:ring-1 hover:ring-emerald-400/50 ${chipColor(b.type)}`}
                            >
                              <div className="flex items-center gap-0.5 min-w-0">
                                <span className="text-[9px] shrink-0">{chipIcon(b.type)}</span>
                                <span className="truncate">{b.label}</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className={`font-bold ${isBlurred ? "blur-sm select-none" : ""}`}>
                                  {parseFloat(b.amount).toFixed(0)}€
                                </span>
                                <Trash2
                                  className={`w-3 h-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ${isLight ? "text-slate-400 hover:text-rose-500" : "text-zinc-600 hover:text-rose-400"}`}
                                  onClick={(e) => { e.stopPropagation(); handleDeleteRec(b.id); }}
                                />
                              </div>
                            </div>
                          ))}
                          {hiddenCount > 0 && (
                            <div className={`text-[9px] font-bold text-center rounded-md py-0.5 ${isLight ? "bg-slate-100 text-slate-500" : "bg-white/5 text-zinc-400"}`}>
                              +{hiddenCount} {t.recurring.more || "de plus"}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ═══════════════════════════════════════════ */}
              {/* MOBILE CALENDAR — iOS-style compact grid + day detail below */}
              {/* ═══════════════════════════════════════════ */}
              <div className="md:hidden space-y-4">
                {/* Mini calendar grid */}
                <div className={`rounded-2xl border p-3 ${isLight ? "bg-slate-50 border-emerald-900/5" : "bg-black/20 border-white/5"}`}>
                  {/* Week day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {t.recurring.weekDays.map((d: string, i: number) => (
                      <div
                        key={i}
                        className={`text-center text-[10px] font-black uppercase ${isLight ? "text-slate-400" : "text-zinc-600"}`}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  {/* Day numbers */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: offset }).map((_, i) => (
                      <div key={`me-${i}`} className="aspect-square"></div>
                    ))}
                    {Array.from({ length: viewMonthDays }).map((_, i) => {
                      const dayNum = i + 1;
                      const isToday = isCurrentMonth && dayNum === today.getDate();
                      const isSelected = dayNum === selectedDay;
                      const bills = (data?.recurring || []).filter(
                        (r: any) => r.day === dayNum,
                      );
                      const hasBills = bills.length > 0;

                      return (
                        <button
                          key={dayNum}
                          onClick={() => setSelectedDay(dayNum)}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 relative ${
                            isSelected
                              ? isLight
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110"
                                : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110"
                              : isToday
                                ? isLight
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-purple-500/20 text-purple-300"
                                : isLight
                                  ? "text-slate-600 hover:bg-slate-100"
                                  : "text-zinc-400 hover:bg-white/5"
                          }`}
                        >
                          <span className="text-xs font-bold leading-none">{dayNum}</span>
                          {/* Dot indicators for bills */}
                          {hasBills && (
                            <div className="flex gap-0.5 mt-0.5">
                              {bills.slice(0, 3).map((_b: any, bi: number) => (
                                <div
                                  key={bi}
                                  className={`w-1 h-1 rounded-full ${
                                    isSelected
                                      ? "bg-white/80"
                                      : _b.type === "Abonnement"
                                        ? "bg-violet-500"
                                        : "bg-amber-500"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected day detail panel */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-2xl border p-4 ${isLight ? "bg-white border-slate-200" : "bg-zinc-900/50 border-white/5"}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${isLight ? "bg-emerald-50 text-emerald-600" : "bg-emerald-500/10 text-emerald-400"}`}>
                          <CalendarDays className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className={`text-lg font-black ${isLight ? "text-slate-800" : "text-white"}`}>
                            {selectedDay} {format(viewDate, "MMMM", { locale: locale })}
                          </h3>
                          <p className={`text-[10px] uppercase tracking-widest font-bold ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                            {selectedDayBills.length === 0
                              ? (t.recurring.noBill || (language === "es" ? "Sin cargo" : "Aucun prélèvement"))
                              : `${selectedDayBills.length} ${t.recurring.billCount || (language === "es" ? "cargo(s)" : "prélèvement(s)")}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedDayBills.length === 0 ? (
                      <div className={`text-center py-8 rounded-xl border-2 border-dashed ${isLight ? "border-slate-200 text-slate-400" : "border-white/10 text-zinc-600"}`}>
                        <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-medium">
                          {t.recurring.freeDay || (language === "es" ? "Día libre" : "Jour libre")}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedDayBills.map((b: any) => (
                          <motion.div
                            key={b.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                              isLight
                                ? "bg-white border-slate-200 shadow-sm"
                                : "bg-white/5 border-white/10"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-1 h-10 rounded-full shrink-0 ${b.type === "Abonnement" ? "bg-violet-500" : "bg-amber-500"}`} />
                              <div className="min-w-0">
                                <p className={`font-bold text-sm truncate ${isLight ? "text-slate-800" : "text-white"}`}>
                                  {b.label}
                                </p>
                                <p className={`text-[10px] uppercase tracking-widest font-bold ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                                  {b.type === "Abonnement" ? `🔄 ${t.recurring.sub}` : `📌 ${t.recurring.fixe}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className={`font-mono text-lg font-black ${isBlurred ? "blur-md select-none" : ""} ${isLight ? "text-slate-800" : "text-white"}`}>
                                {parseFloat(b.amount).toFixed(2)}€
                              </span>
                              <button
                                onClick={() => handleDeleteRec(b.id)}
                                className={`p-2 rounded-xl transition-colors ${isLight ? "hover:bg-rose-50 text-slate-400 hover:text-rose-500" : "hover:bg-rose-500/10 text-zinc-600 hover:text-rose-400"}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
