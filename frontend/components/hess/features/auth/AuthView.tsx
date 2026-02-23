import { useState, KeyboardEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User, Mail, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Translations } from "@/lib/i18n";
import { AnimatedBackground } from "@/components/hess/common/AnimatedBackground";

interface AuthViewProps {
  onLogin: (u: string, p: string) => Promise<boolean>;
  onRegister: (u: string, p: string, e: string) => Promise<boolean>;
  language: string;
  theme: string;
}

export function AuthView({
  onLogin,
  onRegister,
  language,
  theme,
}: AuthViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [regForm, setRegForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [sloganIndex, setSloganIndex] = useState(0);

  const t = Translations[language as keyof typeof Translations].auth;

  const slogans = [
    t.subtitle || "Gérez vos finances avec élégance.",
    "Reprenez le contrôle de votre budget.",
    "L'intelligence artificielle au service de votre portefeuille.",
    "Analysez, économisez, prospérez."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % slogans.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slogans.length]);

  const isLight = theme === "light";

  const inputStyle = isLight
    ? "bg-transparent border-0 border-b-[3px] border-slate-200 focus:border-emerald-500 rounded-none px-2 text-slate-900 placeholder:text-slate-400 focus:ring-0 transition-[border-color,box-shadow] !h-14 text-2xl font-bold w-full"
    : "bg-transparent border-0 border-b-[3px] border-white/10 focus:border-emerald-500 rounded-none px-2 text-white placeholder:text-zinc-600 focus:ring-0 transition-[border-color,box-shadow] !h-14 text-2xl font-bold w-full";

  const triggerError = (msg: string) => {
    setError(msg);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    const success = await onLogin(loginForm.username, loginForm.password);
    if (!success) triggerError(t.error || "Identifiants incorrects");
    setIsLoading(false);
  };

  const handleRegister = async () => {
    if (regForm.password !== regForm.confirm) {
      triggerError("Les mots de passe ne correspondent pas");
      return;
    }
    if (!regForm.username || !regForm.password || !regForm.email) {
      triggerError("Tous les champs sont obligatoires");
      return;
    }
    setIsLoading(true);
    setError("");
    const success = await onRegister(
      regForm.username,
      regForm.password,
      regForm.email,
    );
    if (!success) triggerError(t.error || "Inscription échouée");
    setIsLoading(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (activeTab === "login") {
        handleLogin();
      } else {
        handleRegister();
      }
    }
  };

  return (
    <div className={`relative flex min-h-screen w-full overflow-hidden ${isLight ? "bg-slate-50" : "bg-zinc-950"}`}>

      {/* Global Animated Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground themeId="default" isLight={isLight} />
        {/* Subtle overlay to ensure text legibility on the left side */}
        <div className={`absolute inset-0 ${isLight ? "bg-white/30" : "bg-zinc-950/40"}`} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex w-full h-screen">

        {/* Left Side: Branding (Hidden on mobile) */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-16">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl bg-gradient-to-br from-emerald-400 to-cyan-500">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <span className={`text-4xl font-black tracking-tighter ${isLight ? "text-slate-900" : "text-white"}`}>
              Hess<span className="text-emerald-500">Protector</span>
            </span>
          </div>

          <div className="mb-20">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-6xl xl:text-7xl font-black tracking-tight leading-[1.1] mb-6 ${isLight ? "text-slate-900" : "text-white"}`}
            >
              Maîtrisez <br /> votre budget.
            </motion.h1>
            <div className="h-24 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.p
                  key={sloganIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className={`text-2xl font-medium ${isLight ? "text-slate-700" : "text-zinc-300"}`}
                >
                  {slogans[sloganIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Side: Glass Form Panel */}
        <div className={`w-full lg:w-[500px] xl:w-[600px] flex flex-col justify-center min-h-screen p-8 sm:p-12 lg:p-16 shadow-2xl overflow-y-auto ${isLight ? "bg-white/80 border-l border-white/50 backdrop-blur-2xl" : "bg-zinc-950/80 border-l border-white/10 backdrop-blur-2xl"}`}>

          {/* Mobile Header (Hidden on Desktop) */}
          <div className="flex lg:hidden items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-emerald-400 to-cyan-500">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className={`text-3xl font-black tracking-tighter ${isLight ? "text-slate-900" : "text-white"}`}>
              Hess<span className="text-emerald-500">Protector</span>
            </span>
          </div>

          <div className="w-full max-w-md mx-auto">
            {/* Tabs */}
            <div className="flex gap-8 mb-12 border-b-2 border-transparent">
              {(["login", "register"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setError("");
                  }}
                  className={`text-2xl font-black pb-2 transition-colors duration-300 relative ${activeTab === tab
                    ? (isLight ? "text-slate-900" : "text-white")
                    : (isLight ? "text-slate-400 hover:text-slate-600" : "text-zinc-500 hover:text-zinc-300")
                    }`}
                >
                  {tab === "login" ? t.loginTitle : t.registerTitle}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabUnderlineAuth"
                      className="absolute -bottom-[2px] left-0 right-0 h-1 bg-emerald-500 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 px-4 py-3 bg-red-500/10 border-l-4 border-red-500 text-red-500 font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Form Fields */}
            <div className="relative min-h-[350px]">
              <AnimatePresence mode="wait">
                {activeTab === "login" ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-10 absolute inset-0 pt-2"
                  >
                    <div className="relative group min-h-[4rem]">
                      <Input
                        className={`peer ${inputStyle}`}
                        placeholder=" "
                        value={loginForm.username}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      />
                      <label className={`pointer-events-none absolute left-2 transition-all peer-focus:-top-7 peer-focus:text-sm peer-focus:text-emerald-500 ${loginForm.username ? "-top-7 text-sm text-emerald-500" : "top-2 text-xl " + (isLight ? "text-slate-400" : "text-zinc-500")}`}>
                        {t.username}
                      </label>
                      <User className={`absolute right-2 top-4 w-6 h-6 transition-colors ${isLight ? "text-slate-300 group-focus-within:text-emerald-500" : "text-zinc-600 group-focus-within:text-emerald-500"}`} />
                    </div>

                    <div className="relative group min-h-[4rem]">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className={`peer ${inputStyle}`}
                        placeholder=" "
                        value={loginForm.password}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      />
                      <label className={`pointer-events-none absolute left-2 transition-all peer-focus:-top-7 peer-focus:text-sm peer-focus:text-emerald-500 ${loginForm.password ? "-top-7 text-sm text-emerald-500" : "top-2 text-xl " + (isLight ? "text-slate-400" : "text-zinc-500")}`}>
                        {t.password}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-2 top-4 transition-colors ${isLight ? "text-slate-400 hover:text-emerald-600" : "text-zinc-500 hover:text-emerald-400"}`}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <Button
                      onClick={handleLogin}
                      disabled={isLoading || !loginForm.username || !loginForm.password}
                      className="w-full h-16 rounded-2xl bg-emerald-500 text-white hover:bg-slate-900 dark:hover:bg-white dark:hover:text-black transition-all font-black mt-8 text-xl tracking-wide group"
                    >
                      <span className="flex items-center justify-center">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <> {t.loginBtn} <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" /> </>}
                      </span>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-10 absolute inset-0 pt-2"
                  >
                    <div className="relative group min-h-[4rem]">
                      <Input
                        className={`peer ${inputStyle}`}
                        placeholder=" "
                        value={regForm.username}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                      />
                      <label className={`pointer-events-none absolute left-2 transition-all peer-focus:-top-7 peer-focus:text-sm peer-focus:text-emerald-500 ${regForm.username ? "-top-7 text-sm text-emerald-500" : "top-2 text-xl " + (isLight ? "text-slate-400" : "text-zinc-500")}`}>
                        {t.username}
                      </label>
                      <User className={`absolute right-2 top-4 w-6 h-6 transition-colors ${isLight ? "text-slate-300 group-focus-within:text-emerald-500" : "text-zinc-600 group-focus-within:text-emerald-500"}`} />
                    </div>

                    <div className="relative group min-h-[4rem]">
                      <Input
                        className={`peer ${inputStyle}`}
                        placeholder=" "
                        value={regForm.email}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      />
                      <label className={`pointer-events-none absolute left-2 transition-all peer-focus:-top-7 peer-focus:text-sm peer-focus:text-emerald-500 ${regForm.email ? "-top-7 text-sm text-emerald-500" : "top-2 text-xl " + (isLight ? "text-slate-400" : "text-zinc-500")}`}>
                        {t.email}
                      </label>
                      <Mail className={`absolute right-2 top-4 w-6 h-6 transition-colors ${isLight ? "text-slate-300 group-focus-within:text-emerald-500" : "text-zinc-600 group-focus-within:text-emerald-500"}`} />
                    </div>

                    <div className="flex gap-6 min-h-[4rem]">
                      <div className="relative w-1/2 group">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className={`peer ${inputStyle}`}
                          placeholder=" "
                          value={regForm.password}
                          onKeyDown={handleKeyDown}
                          onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        />
                        <label className={`pointer-events-none absolute left-2 transition-all peer-focus:-top-7 peer-focus:text-sm peer-focus:text-emerald-500 ${regForm.password ? "-top-7 text-sm text-emerald-500" : "top-2 text-xl " + (isLight ? "text-slate-400" : "text-zinc-500")}`}>
                          {t.password}
                        </label>
                      </div>
                      <div className="relative w-1/2 group">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className={`peer ${inputStyle}`}
                          placeholder=" "
                          value={regForm.confirm}
                          onKeyDown={handleKeyDown}
                          onChange={(e) => setRegForm({ ...regForm, confirm: e.target.value })}
                        />
                        <label className={`pointer-events-none absolute left-2 transition-all peer-focus:-top-7 peer-focus:text-sm peer-focus:text-emerald-500 ${regForm.confirm ? "-top-7 text-sm text-emerald-500" : "top-2 text-xl " + (isLight ? "text-slate-400" : "text-zinc-500")}`}>
                          Confirmer
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-2 top-4 transition-colors ${isLight ? "text-slate-400 hover:text-emerald-600" : "text-zinc-500 hover:text-emerald-400"}`}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={handleRegister}
                      disabled={isLoading || !regForm.username || !regForm.password || !regForm.confirm}
                      className="w-full h-16 rounded-2xl bg-emerald-500 text-white hover:bg-slate-900 dark:hover:bg-white dark:hover:text-black transition-all font-black mt-2 text-xl tracking-wide group"
                    >
                      <span className="flex items-center justify-center">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <> {t.registerBtn} <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" /> </>}
                      </span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
