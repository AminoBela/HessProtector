import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Save,
  Check,
  Loader2,
  Shield,
  User,
  FileText,
  Download,
  Trash2,
  Lock,
} from "lucide-react";
import { Translations } from "@/lib/i18n";
import { LegalModal, LEGAL_TEXT } from "../../common/LegalModals";
import { AccountService } from "@/services/accountService";
import { ApiService } from "@/services/apiClient";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { container } from "@/lib/animations";

interface SettingsViewProps {
  settingsForm: any;
  setSettingsForm: (f: any) => void;
  updateSettings: () => Promise<void>;
  language: string;
  theme: string;
  token: string | null;
  logout: () => void;
}

interface SettingsTranslations {
  title: string;
  subtitle: string;
  tabs: {
    general: string;
    account: string;
    legal: string;
  };
  general: {
    supermarket: string;
    diet: string;
    theme: string;
    language: string;
    save: string;
  };
  account: {
    title: string;
    email: string;
    password: string;
    newPassword: string;
    delete: string;
    deleteDesc: string;
    deleteConfirm: string;
    logout: string;
  };
  legal: {
    title: string;
    export: string;
    exportDesc: string;
    terms: string;
    privacy: string;
    read: string;
  };
}

export function SettingsView({
  settingsForm,
  setSettingsForm,
  updateSettings,
  language,
  theme,
  token,
  logout,
}: SettingsViewProps) {
  const isLight = theme === "light";
  const t = Translations[language as keyof typeof Translations]
    .settings as unknown as SettingsTranslations;

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">(
    "idle",
  );
  const [activeTab, setActiveTab] = useState("general");

  const [pwdForm, setPwdForm] = useState({ old: "", new: "" });
  const [pwdStatus, setPwdStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [exportStatus, setExportStatus] = useState<"idle" | "loading">("idle");

  const [limits, setLimits] = useState<any[]>([]);
  const [limitForm, setLimitForm] = useState({ category: "", amount: "" });
  const [limitStatus, setLimitStatus] = useState<"idle" | "saving">("idle");

  useEffect(() => {
    if (token && activeTab === "budget") {
      ApiService.get("/budget-limits", token)
        .then(setLimits)
        .catch(console.error);
    }
  }, [token, activeTab]);

  const handleSaveLimit = async () => {
    if (!token || !limitForm.category || !limitForm.amount) return;
    setLimitStatus("saving");
    try {
      await ApiService.post(
        "/budget-limits",
        { ...limitForm, amount: parseFloat(limitForm.amount) },
        token,
      );
      setLimits((prev) => {
        const existing = prev.find((l) => l.category === limitForm.category);
        if (existing)
          return prev.map((l) =>
            l.category === limitForm.category
              ? { ...l, amount: parseFloat(limitForm.amount) }
              : l,
          );
        return [
          ...prev,
          {
            category: limitForm.category,
            amount: parseFloat(limitForm.amount),
          },
        ];
      });
      setLimitForm({ category: "", amount: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setLimitStatus("idle");
    }
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    await updateSettings();

    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 500);
  };

  const handleExport = async () => {
    if (!token) return;
    setExportStatus("loading");
    try {
      const blob = await AccountService.exportData(token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hess_data_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error("Export failed", e);
      alert("Erreur lors de l'exportation");
    } finally {
      setExportStatus("idle");
    }
  };

  const handleChangePassword = async () => {
    if (!token || !pwdForm.old || !pwdForm.new) return;
    setPwdStatus("loading");
    try {
      await AccountService.changePassword(
        { old_password: pwdForm.old, new_password: pwdForm.new },
        token,
      );
      setPwdStatus("success");
      setPwdForm({ old: "", new: "" });
      setTimeout(() => setPwdStatus("idle"), 3000);
    } catch (e) {
      console.error(e);
      setPwdStatus("error");
      setTimeout(() => setPwdStatus("idle"), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) return;
    if (!confirm(t.account.deleteConfirm.replace(",", "\n"))) return;

    try {
      await AccountService.deleteAccount(token);
      logout();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la suppression");
    }
  };

  const cardGlass = isLight
    ? "card-glass card-glass-light"
    : "card-glass card-glass-dark";
  const inputStyle = isLight
    ? "w-full bg-white/50 border border-emerald-900/10 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-[border-color,box-shadow] h-14 rounded-2xl px-5 text-lg font-medium shadow-sm"
    : "w-full bg-zinc-950/50 border border-emerald-500/20 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-[border-color,box-shadow] h-14 rounded-2xl px-5 text-lg font-medium shadow-inner";

  const selectStyle = isLight
    ? "w-full !h-14 px-4 rounded-xl border border-emerald-900/10 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500/50 font-medium"
    : "w-full !h-14 px-4 rounded-xl border border-white/10 bg-zinc-950/50 text-white focus:ring-2 focus:ring-emerald-500/50 font-medium";

  const tabTriggerStyle = `
        relative px-6 py-3 rounded-xl font-bold transition-all duration-300 z-10 
        data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105
        ${isLight ? "text-slate-500 hover:bg-slate-100" : "text-zinc-400 hover:bg-white/5"}
    `;

  const sectionBoxStyle = isLight
    ? "bg-white/50 border border-slate-200/50 rounded-2xl p-6 shadow-sm"
    : "bg-white/5 border border-white/5 rounded-2xl p-6";

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <Card
        className={`border-0 ${cardGlass} rounded-3xl overflow-hidden min-h-[600px] flex flex-col`}
      >
        <CardContent className="p-0 flex-1 flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <div
              className={`px-8 py-6 border-b ${isLight ? "border-slate-100" : "border-white/5"}`}
            >
              <TabsList
                className={`h-auto p-1 bg-transparent gap-3 flex-wrap justify-start`}
              >
                <TabsTrigger value="general" className={tabTriggerStyle}>
                  <Settings className="w-4 h-4 mr-2" />
                  {t.tabs.general}
                </TabsTrigger>
                <TabsTrigger value="account" className={tabTriggerStyle}>
                  <User className="w-4 h-4 mr-2" />
                  {t.tabs.account}
                </TabsTrigger>
                <TabsTrigger value="legal" className={tabTriggerStyle}>
                  <Shield className="w-4 h-4 mr-2" />
                  {t.tabs.legal}
                </TabsTrigger>
                <TabsTrigger value="budget" className={tabTriggerStyle}>
                  <Shield className="w-4 h-4 mr-2" />
                  Bouclier
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              <TabsContent
                value="general"
                className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="grid grid-cols-1 gap-6">
                  <div className={sectionBoxStyle}>
                    <h3
                      className={`text-sm font-bold uppercase tracking-wider mb-4 opacity-70 flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}
                    >
                      <Settings className="w-4 h-4" /> Préférences
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-3">
                        <label className="text-sm font-semibold opacity-80 ml-1">
                          {t.general.supermarket}
                        </label>
                        <Input
                          placeholder="Ex: Leclerc, Lidl, Carrefour..."
                          className={inputStyle}
                          value={settingsForm.supermarket}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              supermarket: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="text-sm font-semibold opacity-80 ml-1">
                          {t.general.diet}
                        </label>
                        <Select
                          value={settingsForm.diet}
                          onValueChange={(val) =>
                            setSettingsForm({ ...settingsForm, diet: val })
                          }
                        >
                          <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="Selectionner..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Aucun">Aucun (Tout)</SelectItem>
                            <SelectItem value="Végétarien">
                              Végétarien
                            </SelectItem>
                            <SelectItem value="Vegan">Vegan</SelectItem>
                            <SelectItem value="Sans Gluten">
                              Sans Gluten
                            </SelectItem>
                            <SelectItem value="Halal">Halal</SelectItem>
                            <SelectItem value="Cétogène">Cétogène</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={
                      saveStatus === "saving" || saveStatus === "success"
                    }
                    className={`
                                        h-14 px-10 rounded-2xl font-black text-lg shadow-xl transition-all duration-300
                                        ${saveStatus === "success" ? "bg-emerald-500 text-white scale-105" : saveStatus === "saving" ? "bg-zinc-500 text-white opacity-80" : "bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-105"}
                                    `}
                  >
                    {saveStatus === "saving" && (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    )}
                    {saveStatus === "success" && (
                      <Check className="w-5 h-5 mr-2" />
                    )}
                    {saveStatus === "idle" && <Save className="w-5 h-5 mr-2" />}
                    {saveStatus === "saving"
                      ? "Enregistrement..."
                      : saveStatus === "success"
                        ? "Enregistré !"
                        : t.general.save}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent
                value="account"
                className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className={sectionBoxStyle}>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold uppercase tracking-wider opacity-60 ml-1">
                        {t.account.email}
                      </label>
                      <Input
                        value="user@example.com"
                        disabled
                        className={`${inputStyle} opacity-70 cursor-not-allowed`}
                      />
                    </div>
                  </div>

                  <div className={sectionBoxStyle}>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-emerald-500">
                      <Lock className="w-5 h-5" />
                      {t.account.title}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium opacity-80 ml-1">
                          {t.account.password}
                        </label>
                        <Input
                          type="password"
                          className={inputStyle}
                          placeholder="••••••••"
                          value={pwdForm.old}
                          onChange={(e) =>
                            setPwdForm({ ...pwdForm, old: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium opacity-80 ml-1">
                          {t.account.newPassword}
                        </label>
                        <div className="flex gap-3">
                          <Input
                            type="password"
                            className={inputStyle}
                            placeholder="••••••••"
                            value={pwdForm.new}
                            onChange={(e) =>
                              setPwdForm({ ...pwdForm, new: e.target.value })
                            }
                          />
                          <Button
                            onClick={handleChangePassword}
                            disabled={
                              pwdStatus === "loading" ||
                              !pwdForm.old ||
                              !pwdForm.new
                            }
                            className={`h-14 px-8 rounded-xl font-bold transition-all ${pwdStatus === "success" ? "bg-emerald-500 text-white" : pwdStatus === "error" ? "bg-rose-500 text-white" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}
                          >
                            {pwdStatus === "loading" ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : pwdStatus === "success" ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              "OK"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 transition-colors ${isLight ? "bg-rose-50 border-rose-100 hover:border-rose-200" : "bg-rose-950/20 border-rose-900/30 hover:border-rose-800/50"}`}
                  >
                    <div className="text-rose-600 dark:text-rose-400">
                      <p className="font-bold flex items-center gap-2 text-lg">
                        <Trash2 className="w-5 h-5" />
                        {t.account.delete}
                      </p>
                      <p className="opacity-80 text-sm mt-1">
                        {t.account.deleteDesc}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="h-12 px-6 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/20 hover:shadow-rose-900/40 transition-all"
                    >
                      {t.account.delete}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="legal"
                className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
                  <div className="text-center mb-4">
                    <h3
                      className={`text-xl font-black uppercase tracking-tight mb-2 ${isLight ? "text-slate-800" : "text-white"}`}
                    >
                      Données & Conformité
                    </h3>
                    <p
                      className={`text-sm ${isLight ? "text-slate-500" : "text-zinc-400"}`}
                    >
                      Gérez vos données personnelles et consultez nos documents
                      légaux.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      className={`
                                        relative group overflow-hidden rounded-3xl border p-8 flex flex-col justify-between h-auto min-h-[280px] transition-all duration-500
                                        ${isLight
                          ? "bg-gradient-to-br from-white/80 to-slate-50/80 border-white/40 shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10"
                          : "bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border-white/10 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-emerald-900/20"
                        }
                                    `}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />

                      <div className="relative z-10">
                        <div
                          className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${isLight ? "bg-emerald-100 text-emerald-600" : "bg-emerald-500/20 text-emerald-400"}`}
                        >
                          <Download className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-2xl mb-2">
                          {t.legal.export}
                        </h3>
                        <p
                          className={`text-sm leading-relaxed ${isLight ? "text-slate-500" : "text-zinc-400"}`}
                        >
                          {t.legal.exportDesc}
                        </p>
                      </div>

                      <div className="relative z-10 mt-8">
                        <Button
                          onClick={handleExport}
                          disabled={exportStatus === "loading"}
                          className={`
                                                    w-full h-14 rounded-xl font-bold text-base transition-all duration-300
                                                    ${isLight
                              ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                            }
                                                `}
                        >
                          {exportStatus === "loading" ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />{" "}
                              Exportation...
                            </span>
                          ) : (
                            <span className="flex items-center justify-between w-full px-2">
                              Télécharger mes données
                              <Download className="w-5 h-5 opacity-70" />
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <LegalModal
                        title={t.legal.privacy}
                        trigger={
                          <button
                            className={`
                                                    w-full p-6 rounded-3xl border text-left transition-all duration-300 group flex items-center justify-between
                                                    ${isLight
                                ? "bg-white/60 hover:bg-white border-slate-200/60 hover:border-blue-200 shadow-sm hover:shadow-md"
                                : "bg-zinc-900/40 hover:bg-zinc-900/80 border-white/5 hover:border-blue-500/30"
                              }
                                                `}
                          >
                            <div className="flex items-center gap-5">
                              <div
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isLight ? "bg-blue-50 text-blue-600 group-hover:bg-blue-100" : "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20"}`}
                              >
                                <Shield className="w-6 h-6" />
                              </div>
                              <div>
                                <span className="font-bold text-lg block mb-1">
                                  {t.legal.privacy}
                                </span>
                                <span
                                  className={`text-xs font-medium uppercase tracking-wider ${isLight ? "text-blue-600/60" : "text-blue-400/60"}`}
                                >
                                  Document Légal
                                </span>
                              </div>
                            </div>
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 ${isLight ? "bg-blue-50 text-blue-600" : "bg-blue-500/20 text-blue-400"}`}
                            >
                              <FileText className="w-5 h-5" />
                            </div>
                          </button>
                        }
                        content={LEGAL_TEXT.privacy}
                        isLight={isLight}
                      />

                      <LegalModal
                        title={t.legal.terms}
                        trigger={
                          <button
                            className={`
                                                    w-full p-6 rounded-3xl border text-left transition-all duration-300 group flex items-center justify-between
                                                    ${isLight
                                ? "bg-white/60 hover:bg-white border-slate-200/60 hover:border-purple-200 shadow-sm hover:shadow-md"
                                : "bg-zinc-900/40 hover:bg-zinc-900/80 border-white/5 hover:border-purple-500/30"
                              }
                                                `}
                          >
                            <div className="flex items-center gap-5">
                              <div
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isLight ? "bg-purple-50 text-purple-600 group-hover:bg-purple-100" : "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20"}`}
                              >
                                <FileText className="w-6 h-6" />
                              </div>
                              <div>
                                <span className="font-bold text-lg block mb-1">
                                  {t.legal.terms}
                                </span>
                                <span
                                  className={`text-xs font-medium uppercase tracking-wider ${isLight ? "text-purple-600/60" : "text-purple-400/60"}`}
                                >
                                  Conditions
                                </span>
                              </div>
                            </div>
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 ${isLight ? "bg-purple-50 text-purple-600" : "bg-purple-500/20 text-purple-400"}`}
                            >
                              <FileText className="w-5 h-5" />
                            </div>
                          </button>
                        }
                        content={LEGAL_TEXT.terms}
                        isLight={isLight}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="budget"
                className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="grid grid-cols-1 gap-6">
                  <div className={sectionBoxStyle}>
                    <h3
                      className={`text-sm font-bold uppercase tracking-wider mb-4 opacity-70 flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}
                    >
                      <Shield className="w-4 h-4" /> Bouclier Budgétaire
                    </h3>
                    <div className="flex gap-4 items-end mb-6">
                      <div className="flex-1 flex flex-col">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1 mb-3">
                          Catégorie
                        </label>
                        <Input
                          className={inputStyle}
                          placeholder="Ex: Alimentation"
                          value={limitForm.category}
                          onChange={(e) =>
                            setLimitForm({
                              ...limitForm,
                              category: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="w-32 flex flex-col">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1 mb-3">
                          Limite (€)
                        </label>
                        <Input
                          type="number"
                          className={inputStyle}
                          placeholder="300"
                          value={limitForm.amount}
                          onChange={(e) =>
                            setLimitForm({
                              ...limitForm,
                              amount: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        onClick={handleSaveLimit}
                        disabled={limitStatus === "saving"}
                        className="h-14 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                      >
                        {limitStatus === "saving" ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Check className="w-5 h-5" />
                        )}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {limits.map((l, i) => (
                        <div
                          key={i}
                          className={`flex justify-between items-center p-4 rounded-xl border ${isLight ? "bg-white border-slate-100" : "bg-black/20 border-white/5"}`}
                        >
                          <span className="font-bold">{l.category}</span>
                          <span className="font-mono text-emerald-500 font-bold">
                            {l.amount}€
                          </span>
                        </div>
                      ))}
                      {limits.length === 0 && (
                        <div className="text-center opacity-50 text-sm py-4">
                          Aucune limite définie.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
