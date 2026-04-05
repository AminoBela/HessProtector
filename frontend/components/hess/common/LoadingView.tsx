import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export function LoadingView() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white overflow-hidden relative">
            {/* Soft background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-emerald-500/10 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center gap-6 z-10"
            >
                <div className="relative">
                    <motion.div
                        animate={{
                            boxShadow: ["0px 0px 0px 0px rgba(16, 185, 129, 0)", "0px 0px 40px 10px rgba(16, 185, 129, 0.2)", "0px 0px 0px 0px rgba(16, 185, 129, 0)"]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center backdrop-blur-xl"
                    >
                        <Shield className="w-10 h-10 text-emerald-400" />
                    </motion.div>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-xl font-black uppercase tracking-widest bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                        HessProtector
                    </h1>
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="flex items-center gap-1"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
