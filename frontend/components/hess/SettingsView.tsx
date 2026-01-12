import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Save, Check, Loader2, RotateCcw } from "lucide-react"
import { Translations } from "@/lib/i18n"

interface SettingsViewProps {
    settingsForm: any;
    setSettingsForm: (f: any) => void;
    updateSettings: () => Promise<void>;
    language: string;
    theme: string;
}

export function SettingsView({ settingsForm, setSettingsForm, updateSettings, language, theme }: SettingsViewProps) {
    const isLight = theme === 'light';
    const t = Translations[language as keyof typeof Translations].settings;

    // Feedback State
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

    const handleSave = async () => {
        setSaveStatus('saving');
        await updateSettings();
        // Fake delay for premium feel
        setTimeout(() => {
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 500);
    };

    const cardGlass = isLight
        ? "bg-white/70 backdrop-blur-xl border-emerald-900/5 shadow-xl text-slate-800"
        : "bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-2xl text-white";

    const inputStyle = isLight
        ? "bg-white border-emerald-900/10 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 !h-14 rounded-xl"
        : "bg-zinc-950/60 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/50 !h-14 rounded-xl";

    const selectStyle = isLight
        ? "w-full !h-14 px-4 rounded-xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50"
        : "w-full !h-14 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50";

    return (
        <Card className={`border-0 ${cardGlass} rounded-3xl overflow-hidden`}>
            <CardHeader className={`border-b ${isLight ? 'border-emerald-900/5' : 'border-white/5'} p-8`}>
                <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tight">
                    <Settings className={`w-8 h-8 ${isLight ? 'text-emerald-600' : 'text-emerald-500'}`} />
                    {t.title}
                </CardTitle>
                <p className={`text-sm font-medium pl-11 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>{t.subtitle}</p>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-bold uppercase tracking-wider opacity-70 ml-1">{t.supermarket}</label>
                        <Input
                            placeholder="Ex: Leclerc, Lidl, Carrefour..."
                            className={inputStyle}
                            value={settingsForm.supermarket}
                            onChange={e => setSettingsForm({ ...settingsForm, supermarket: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-bold uppercase tracking-wider opacity-70 ml-1">{t.diet}</label>
                        <Select value={settingsForm.diet} onValueChange={val => setSettingsForm({ ...settingsForm, diet: val })}>
                            <SelectTrigger className={selectStyle}>
                                <SelectValue placeholder="Selectionner..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Aucun">Aucun (Tout)</SelectItem>
                                <SelectItem value="Végétarien">Végétarien</SelectItem>
                                <SelectItem value="Vegan">Vegan</SelectItem>
                                <SelectItem value="Sans Gluten">Sans Gluten</SelectItem>
                                <SelectItem value="Halal">Halal</SelectItem>
                                <SelectItem value="Cétogène">Cétogène</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={saveStatus === 'saving' || saveStatus === 'success'}
                        className={`
                            h-14 px-8 rounded-2xl font-black text-lg shadow-xl transition-all duration-300
                            ${saveStatus === 'success'
                                ? 'bg-emerald-500 text-white scale-105'
                                : saveStatus === 'saving'
                                    ? 'bg-zinc-500 text-white opacity-80'
                                    : isLight ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105' : 'bg-white text-black hover:bg-zinc-200 hover:scale-105'
                            }
                        `}
                    >
                        {saveStatus === 'saving' && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        {saveStatus === 'success' && <Check className="w-5 h-5 mr-2" />}
                        {saveStatus === 'idle' && <Save className="w-5 h-5 mr-2" />}

                        {saveStatus === 'saving' ? "Enregistrement..." : saveStatus === 'success' ? "Enregistré !" : t.save}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
