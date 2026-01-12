import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// Removed unused Tabs imports
import { Lock, User, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Translations } from "@/lib/i18n";

interface AuthViewProps {
    onLogin: (u: string, p: string) => Promise<boolean>;
    onRegister: (u: string, p: string, e: string) => Promise<boolean>;
    language: string;
    theme: string;
}

export function AuthView({ onLogin, onRegister, language, theme }: AuthViewProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [regForm, setRegForm] = useState({ username: "", email: "", password: "", confirm: "" });
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    const t = Translations[language as keyof typeof Translations].auth;
    const isLight = theme === 'light';

    const cardGlass = isLight
        ? "bg-white/70 backdrop-blur-3xl border-emerald-900/10 shadow-2xl"
        : "bg-black/60 backdrop-blur-3xl border-white/10 shadow-2xl";

    const inputStyle = isLight
        ? "bg-white/50 border-emerald-900/10 text-slate-800 focus:ring-emerald-500/50 transition-all duration-300"
        : "bg-zinc-900/50 border-white/10 text-white focus:ring-emerald-500/50 transition-all duration-300";

    const triggerError = (msg: string) => {
        setError(msg);
        setShake(true);
        setTimeout(() => setShake(false), 500);
    }

    const handleLogin = async () => {
        setIsLoading(true);
        setError("");
        const success = await onLogin(loginForm.username, loginForm.password);
        if (!success) triggerError(t.error || "Login Failed");
        setIsLoading(false);
    };

    const handleRegister = async () => {
        if (regForm.password !== regForm.confirm) {
            triggerError("Les mots de passe ne correspondent pas");
            return;
        }
        setIsLoading(true);
        setError("");
        const success = await onRegister(regForm.username, regForm.password, regForm.email);
        if (!success) triggerError(t.error || "Registration Failed");
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 font-sans overflow-hidden">
            {/* Background Elements to add depth */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700" />

            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    x: shake ? [0, -10, 10, -10, 10, 0] : 0
                }}
                transition={{
                    default: { type: "spring", duration: 0.6, bounce: 0.3 },
                    x: { type: "tween", duration: 0.5, ease: "easeInOut" }
                }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`text-5xl font-black mb-3 tracking-tighter ${isLight ? 'text-slate-900' : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-300% animate-gradient'}`}
                    >
                        HessProtector
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`text-lg font-medium tracking-wide ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}
                    >
                        {t.subtitle}
                    </motion.p>
                </div>

                <div className={`p-1 bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-2xl flex relative mb-6 border border-white/5`}>
                    {(['login', 'register'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setError(""); }}
                            className={`flex-1 relative py-3 text-sm font-bold uppercase tracking-wider transition-colors duration-300 z-10 ${activeTab === tab
                                ? (isLight ? 'text-white' : 'text-black')
                                : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-500 hover:text-zinc-300')
                                }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className={`absolute inset-0 rounded-xl ${isLight ? 'bg-slate-900' : 'bg-white'}`}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab === 'login' ? t.loginTitle : t.registerTitle}</span>
                        </button>
                    ))}
                </div>

                <Card className={`border-0 rounded-[2.5rem] overflow-hidden ${cardGlass} transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]`}>
                    <CardHeader className="text-center pb-2 pt-8">
                        <CardTitle className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
                            {t.welcome}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2 px-8 pb-10">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    key="error-box"
                                    initial={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: 16, scale: 1 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.9 }}
                                    className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center flex items-center justify-center gap-2"
                                >
                                    <span className="text-lg">⚠️</span> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <AnimatePresence mode="wait" initial={false}>
                                {activeTab === 'login' ? (
                                    <motion.div
                                        key="login"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="flex flex-col gap-6"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <Label className={`ml-1 text-sm uppercase tracking-wide font-bold min-h-[20px] ${isLight ? "text-slate-500" : "text-zinc-500"}`}>{t.username}</Label>
                                            <div className="relative group">
                                                <User className={`absolute left-4 top-4 w-5 h-5 transition-colors ${isLight ? 'text-slate-400 group-focus-within:text-emerald-600' : 'text-zinc-500 group-focus-within:text-emerald-400'}`} />
                                                <Input
                                                    className={`pl-12 h-14 rounded-2xl text-base font-medium shadow-sm ${inputStyle}`}
                                                    placeholder="Admin"
                                                    value={loginForm.username}
                                                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label className={`ml-1 text-sm uppercase tracking-wide font-bold min-h-[20px] ${isLight ? "text-slate-500" : "text-zinc-500"}`}>{t.password}</Label>
                                            <div className="relative group">
                                                <Lock className={`absolute left-4 top-4 w-5 h-5 transition-colors ${isLight ? 'text-slate-400 group-focus-within:text-emerald-600' : 'text-zinc-500 group-focus-within:text-emerald-400'}`} />
                                                <Input
                                                    type="password"
                                                    className={`pl-12 h-14 rounded-2xl text-base font-medium shadow-sm ${inputStyle}`}
                                                    placeholder="••••••••"
                                                    value={loginForm.password}
                                                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <Button onClick={handleLogin} disabled={isLoading} className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-white shadow-lg shadow-emerald-900/20 mt-4 text-base tracking-wide">
                                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{t.loginBtn} <ArrowRight className="w-5 h-5 ml-2" /></>}
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="register"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="flex flex-col gap-5"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <Label className={`ml-1 text-sm uppercase tracking-wide font-bold min-h-[20px] ${isLight ? "text-slate-500" : "text-zinc-500"}`}>{t.username}</Label>
                                            <div className="relative group">
                                                <User className={`absolute left-4 top-4 w-5 h-5 transition-colors ${isLight ? 'text-slate-400 group-focus-within:text-cyan-600' : 'text-zinc-500 group-focus-within:text-cyan-400'}`} />
                                                <Input
                                                    className={`pl-12 h-14 rounded-2xl text-base font-medium shadow-sm ${inputStyle}`}
                                                    placeholder="Nouvel Utilisateur"
                                                    value={regForm.username}
                                                    onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label className={`ml-1 text-sm uppercase tracking-wide font-bold min-h-[20px] ${isLight ? "text-slate-500" : "text-zinc-500"}`}>{t.email}</Label>
                                            <div className="relative group">
                                                <Mail className={`absolute left-4 top-4 w-5 h-5 transition-colors ${isLight ? 'text-slate-400 group-focus-within:text-cyan-600' : 'text-zinc-500 group-focus-within:text-cyan-400'}`} />
                                                <Input
                                                    className={`pl-12 h-14 rounded-2xl text-base font-medium shadow-sm ${inputStyle}`}
                                                    placeholder="exemple@email.com"
                                                    value={regForm.email}
                                                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <Label className={`ml-1 text-sm uppercase tracking-wide font-bold min-h-[20px] ${isLight ? "text-slate-500" : "text-zinc-500"}`}>{t.password}</Label>
                                                <Input
                                                    type="password"
                                                    className={`h-14 rounded-2xl text-base font-medium shadow-sm ${inputStyle}`}
                                                    placeholder="••••••••"
                                                    value={regForm.password}
                                                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className={`ml-1 text-sm uppercase tracking-wide font-bold truncate block min-h-[20px] ${isLight ? "text-slate-500" : "text-zinc-500"}`} title={t.confirmPassword}>{t.confirmPassword}</Label>
                                                <Input
                                                    type="password"
                                                    className={`h-14 rounded-2xl text-base font-medium shadow-sm ${inputStyle}`}
                                                    placeholder="••••••••"
                                                    value={regForm.confirm}
                                                    onChange={(e) => setRegForm({ ...regForm, confirm: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <Button onClick={handleRegister} disabled={isLoading} className="w-full h-14 rounded-2xl bg-cyan-600 hover:bg-cyan-500 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-white shadow-lg shadow-cyan-900/20 mt-4 text-base tracking-wide">
                                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{t.registerBtn} <ArrowRight className="w-5 h-5 ml-2" /></>}
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

