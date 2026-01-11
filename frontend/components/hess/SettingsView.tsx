import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SettingsViewProps {
    settingsForm: any;
    setSettingsForm: (form: any) => void;
    updateSettings: () => void;
    language: string;
    theme: string;
}

export function SettingsView({ settingsForm, setSettingsForm, updateSettings, language, theme }: SettingsViewProps) {
    const isLight = theme === 'light';
    const cardGlass = isLight
        ? "bg-white/70 backdrop-blur-xl border-emerald-900/5 shadow-xl text-slate-800 rounded-3xl overflow-hidden hover:bg-white/80 transition-colors duration-500"
        : "bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-2xl text-white rounded-3xl overflow-hidden hover:bg-zinc-900/50 transition-colors duration-500";

    const selectStyle = isLight
        ? "w-full h-12 px-4 rounded-xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50 cursor-pointer backdrop-blur-xl transition-all shadow-inner font-medium"
        : "w-full h-12 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50 cursor-pointer backdrop-blur-xl transition-all shadow-inner font-medium";

    const labelColor = isLight ? "text-slate-500" : "text-zinc-400";
    const btnClass = isLight ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-white text-black hover:bg-zinc-200";

    return (
        <Card className={`border-0 ${cardGlass} max-w-2xl mx-auto`}>
            <CardHeader><CardTitle className={isLight ? "text-slate-800" : "text-white"}>Mes Préférences</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className={`text-sm font-bold ${labelColor}`}>Supermarché Habituel</label>
                    <select className={selectStyle} value={settingsForm.supermarket} onChange={e => setSettingsForm({ ...settingsForm, supermarket: e.target.value })}>
                        <option value="Lidl">Lidl</option>
                        <option value="Aldi">Aldi</option>
                        <option value="Leclerc">Leclerc</option>
                        <option value="Carrefour">Carrefour</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className={`text-sm font-bold ${labelColor}`}>Régime Alimentaire</label>
                    <select className={selectStyle} value={settingsForm.diet} onChange={e => setSettingsForm({ ...settingsForm, diet: e.target.value })}>
                        <option value="Standard">Standard</option>
                        <option value="Halal">Halal</option>
                        <option value="Végétarien">Végétarien</option>
                    </select>
                </div>
                <Button onClick={updateSettings} className={`w-full h-14 font-bold rounded-xl ${btnClass}`}>Sauvegarder les modifications</Button>
            </CardContent>
        </Card>
    )
}
