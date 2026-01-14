import { ShieldCheck, LayoutDashboard, Bot, CalendarDays, Utensils, Target, TrendingUp, Settings, Trophy, Crown, Moon, Sun, Globe, Plus, Medal, ChartPie, LogOut, User, Eye, EyeOff, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Translations } from "@/lib/i18n";
import { usePrivacy } from "@/context/PrivacyContext";

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    data: any;
    theme: string;
    setTheme: (theme: string) => void;
    language: string;
    setLanguage: (lang: string) => void;
    bg: React.ReactNode;
    openTx: boolean;
    setOpenTx: (open: boolean) => void;
    txForm: any;
    setTxForm: (form: any) => void;
    handleAddTx: () => void;
    user: string | null;
    logout: () => void;
}

export function MainLayout({ children, activeTab, setActiveTab, data, theme, setTheme, language, setLanguage, bg, openTx, setOpenTx, txForm, setTxForm, handleAddTx, user, logout }: MainLayoutProps) {
    const isLight = theme === 'light';
    const textColor = isLight ? "text-slate-800" : "text-white";
    const sidebarBg = isLight ? "bg-white/80 border-emerald-900/5 shadow-xl" : "bg-zinc-950/40 border-white/5";
    const sidebarText = isLight ? "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50" : "text-zinc-500 hover:text-white hover:bg-white/5";
    const sidebarActive = isLight ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-white text-black font-extrabold shadow-[0_0_30px_rgba(255,255,255,0.4)]";

    const inputStyle = isLight
        ? "bg-white border-emerald-900/10 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all h-14 rounded-xl px-4 font-medium shadow-inner"
        : "bg-zinc-950/60 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all h-14 rounded-xl px-4 font-medium shadow-inner";
    const selectStyle = isLight
        ? "w-full !h-14 px-4 rounded-xl border border-emerald-900/10 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500/50 cursor-pointer backdrop-blur-xl transition-all shadow-inner font-medium flex items-center justify-between"
        : "w-full !h-14 px-4 rounded-xl border border-white/10 bg-zinc-950/60 text-white focus:ring-2 focus:ring-emerald-500/50 cursor-pointer backdrop-blur-xl transition-all shadow-inner font-medium flex items-center justify-between";


    const t = Translations[language as keyof typeof Translations] || Translations.fr;
    const { isBlurred, toggleBlur } = usePrivacy();

    const SidebarItem = ({ id, icon: Icon, label }: any) => (
        <button onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-4 px-2 py-4 rounded-2xl transition-all duration-300 group ${activeTab === id ? sidebarActive : sidebarText}`}><Icon className={`w-6 h-6 ${activeTab === id ? (isLight ? 'text-white' : 'text-black') : 'group-hover:text-emerald-400 transition-colors'}`} /> <span className="hidden md:block text-sm uppercase tracking-wider font-bold">{label}</span></button>
    )

    return (
        <div className={`flex h-screen font-sans overflow-hidden selection:bg-emerald-500/30 ${textColor}`}>
            {bg}
            <aside className={`w-20 md:w-80 flex-shrink-0 border-r border-white/5 backdrop-blur-2xl flex flex-col p-6 gap-2 z-20 transition-all ${sidebarBg}`}>
                <div className="h-24 flex items-center justify-center md:justify-start gap-4 mb-4"><div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg"><ShieldCheck className="w-7 h-7 text-black" /></div><div className="hidden md:block"><h1 className={`font-black text-2xl tracking-tighter ${textColor}`}>Hess<span className="text-emerald-500">Protector</span></h1></div></div>

                <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide px-4">
                    <SidebarItem id="dashboard" icon={LayoutDashboard} label={t.sidebar.dashboard} />
                    <SidebarItem id="analytics" icon={ChartPie} label={t.sidebar.analytics} />
                    <SidebarItem id="coach" icon={Bot} label={t.sidebar.coach} />
                    <SidebarItem id="recurring" icon={CalendarDays} label={t.sidebar.recurring} />
                    <SidebarItem id="pantry" icon={Utensils} label={t.sidebar.pantry} />
                    <SidebarItem id="goals" icon={Target} label={t.sidebar.goals} />
                    <SidebarItem id="history" icon={TrendingUp} label={t.sidebar.history} />
                    <SidebarItem id="market" icon={ShoppingBag} label="HessMarket" />
                    <SidebarItem id="settings" icon={Settings} label={t.sidebar.settings} />
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                    {data && data.rank && (
                        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-4 rounded-xl border border-white/10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                                    {data.rank === 'Rentier' ? <Crown className="w-5 h-5" /> : data.rank === 'Investisseur' ? <Trophy className="w-5 h-5" /> : <Medal className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.rank.title}</p>
                                    <p className="text-sm font-black text-white">
                                        {language === 'es' ?
                                            (data.rank === 'Rentier' ? 'Rentista' : data.rank === 'Investisseur' ? 'Inversor' : data.rank === 'Mendiant' ? 'Mendigo' : data.rank)
                                            : data.rank}
                                    </p>
                                </div>
                            </div>
                            <div className="relative h-2 bg-black/50 rounded-full overflow-hidden">
                                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-amber-600 transition-all duration-1000" style={{ width: `${Math.min(100, (data.xp / data.next_rank_xp) * 100)}%` }}></div>
                            </div>
                        </div>
                    )}

                    <div className={`flex items-center gap-3 px-2 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                        <User className="w-5 h-5" />
                        <span className="text-sm font-bold truncate flex-1">{user}</span>
                        <Button variant="ghost" size="icon" onClick={logout} className="hover:text-red-500 hover:bg-red-500/10"><LogOut className="w-5 h-5" /></Button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
                <div className={`flex justify-between items-center sticky top-0 z-50 px-4 md:px-10 py-6 border-b transition-all duration-300 ${isLight ? 'bg-white/95 border-emerald-900/5 shadow-sm' : 'bg-zinc-950/95 border-white/5 shadow-md'}`}>
                    <h2 className={`text-4xl font-black uppercase tracking-tighter drop-shadow-sm ${textColor}`}>{
                        activeTab === 'recurring' ? t.header.recurring :
                            activeTab === 'pantry' ? t.header.pantry :
                                activeTab === 'goals' ? t.header.goals :
                                    activeTab === 'dashboard' ? t.header.dashboard :
                                        activeTab === 'analytics' ? t.header.analytics :
                                            activeTab === 'coach' ? t.header.coach :
                                                activeTab === 'history' ? t.header.history :
                                                    activeTab === 'market' ? "HessMarket" :
                                                        activeTab === 'settings' ? t.header.settings : activeTab}
                    </h2>

                    <div className="flex items-center gap-4">
                        <div className={`flex rounded-full p-1 border backdrop-blur-md ${isLight ? 'bg-white/50 border-emerald-900/10' : 'bg-black/40 border-white/10'}`}>
                            <button onClick={() => setTheme('dark')} className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-black'}`}><Moon className="w-4 h-4" /></button>
                            <button onClick={() => setTheme('light')} className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-white text-orange-500 shadow-lg' : 'text-zinc-500 hover:text-white'}`}><Sun className="w-4 h-4" /></button>
                        </div>

                        <div className={`hidden md:flex rounded-full p-1 border backdrop-blur-md ${isLight ? 'bg-white/50 border-emerald-900/10' : 'bg-black/40 border-white/10'}`}>
                            <button onClick={toggleBlur} className={`p-2 rounded-full transition-all ${isBlurred ? 'bg-zinc-800 text-white shadow-lg' : (isLight ? 'text-zinc-400 hover:text-emerald-600' : 'text-zinc-500 hover:text-white')}`}>
                                {isBlurred ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className={`flex rounded-full p-1 border backdrop-blur-md items-center ${isLight ? 'bg-white/50 border-emerald-900/10' : 'bg-black/40 border-white/10'}`}>
                            <Globe className={`w-4 h-4 ml-2 mr-1 ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`} />
                            <button onClick={() => setLanguage('fr')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'fr' ? 'bg-emerald-500 text-white' : 'text-zinc-500'}`}>FR</button>
                            <button onClick={() => setLanguage('es')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'es' ? 'bg-orange-500 text-white' : 'text-zinc-500'}`}>ES</button>
                        </div>

                        <Dialog open={openTx} onOpenChange={setOpenTx}>
                            <DialogTrigger asChild>
                                <Button className={`${isLight ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-white text-black hover:bg-zinc-200'} font-black rounded-full h-12 px-6 shadow-xl hover:scale-105 transition-all`}>
                                    <Plus className="mr-2 w-5 h-5" /> {t.dialog.newTx}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className={isLight ? "bg-white/90 backdrop-blur-3xl border-emerald-900/10 text-slate-800 rounded-3xl p-8" : "bg-zinc-950/90 backdrop-blur-3xl border-white/10 text-white rounded-3xl p-8"}>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black uppercase mb-4">{t.dialog.newTx}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                    <Input placeholder={t.dialog.label} className={inputStyle} value={txForm.label} onChange={e => setTxForm({ ...txForm, label: e.target.value })} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input type="number" placeholder={t.dialog.amount} className={inputStyle} value={txForm.amount} onChange={e => setTxForm({ ...txForm, amount: e.target.value })} />
                                        <Select value={txForm.type} onValueChange={val => setTxForm({ ...txForm, type: val })}>
                                            <SelectTrigger className={selectStyle}>
                                                <SelectValue placeholder={t.dialog.type} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="depense">{t.dialog.expense}</SelectItem>
                                                <SelectItem value="revenu">{t.dialog.income}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Select value={txForm.category} onValueChange={val => setTxForm({ ...txForm, category: val })}>
                                        <SelectTrigger className={selectStyle}>
                                            <SelectValue placeholder={t.dialog.category} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Alimentation">Alimentation</SelectItem>
                                            <SelectItem value="Voiture">Voiture</SelectItem>
                                            <SelectItem value="Loyer/Charges">Loyer/Charges</SelectItem>
                                            <SelectItem value="Loisir">Loisir</SelectItem>
                                            <SelectItem value="Autre">Autre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={handleAddTx} className={`w-full h-14 font-black rounded-xl text-lg shadow-xl mt-2 ${isLight ? 'bg-white text-black hover:bg-zinc-200' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>{t.dialog.add}</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="p-4 md:p-10 pt-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
