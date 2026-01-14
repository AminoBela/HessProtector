import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Siren, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ApiService } from "@/services/apiClient";
import { useAuth } from "@/hooks/useAuth";

interface PanicModalProps {
    language: string;
    isLight: boolean;
}

export function PanicModal({ language, isLight }: PanicModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<any>(null);
    const { token } = useAuth();

    const t = language === 'fr'
        ? { btn: "URGENCE", title: "ALERTE ROUGE", subtitle: "Activation du Protocole de Survie", loading: "Analyse de la situation critique...", close: "Fermer" }
        : { btn: "EMERGENCIA", title: "ALERTA ROJA", subtitle: "Activando Protocolo de Supervivencia", loading: "Analizando situación crítica...", close: "Cerrar" };

    const handlePanic = async () => {
        setLoading(true);
        setPlan(null);
        try {
            const res = await ApiService.post('/smart-prompt', { type: "emergency", budget: 0, days: 5 }, token || "");
            setPlan(res.prompt);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={handlePanic}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest shadow-[0_0_15px_rgba(225,29,72,0.6)] animate-pulse border-2 border-rose-400"
                >
                    <Siren className="w-5 h-5 mr-2" /> {t.btn}
                </Button>
            </DialogTrigger>
            <DialogContent className={`${isLight ? "bg-white border-rose-200" : "bg-zinc-950 border-rose-900"} max-w-lg border-2 shadow-[0_0_50px_rgba(225,29,72,0.2)]`}>
                <DialogHeader>
                    <DialogTitle className="text-center flex flex-col items-center gap-2">
                        <AlertTriangle className="w-16 h-16 text-rose-500 animate-bounce" />
                        <span className="text-3xl font-black uppercase text-rose-600 tracking-tighter">{t.title}</span>
                        <span className="text-xs uppercase font-bold tracking-[0.5em] opacity-50">{t.subtitle}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    {loading && (
                        <div className="text-center py-10 space-y-4">
                            <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="font-bold text-rose-400 animate-pulse">{t.loading}</p>
                        </div>
                    )}

                    {plan && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 text-center">
                                <p className="text-lg font-black text-rose-500 italic">&quot;{plan.motivational_speech}&quot;</p>
                            </div>

                            <div className="space-y-3">
                                {plan.steps.map((step: any, i: number) => (
                                    <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${isLight ? 'bg-rose-50 border-rose-100' : 'bg-rose-950/20 border-rose-900/50'}`}>
                                        <div className="text-2xl">{step.icon}</div>
                                        <div>
                                            <p className={`font-bold ${isLight ? 'text-rose-900' : 'text-rose-100'}`}>{step.action}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
