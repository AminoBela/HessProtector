import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, Trash2 } from "lucide-react"

interface HistoryViewProps {
    data: any;
    handleDeleteTx: (id: number) => void;
    language: string;
    theme: string;
}

export function HistoryView({ data, handleDeleteTx, language, theme }: HistoryViewProps) {
    const isLight = theme === 'light';
    const cardGlass = isLight
        ? "bg-white/70 backdrop-blur-xl border-emerald-900/5 shadow-xl text-slate-800 rounded-3xl overflow-hidden hover:bg-white/80 transition-colors duration-500"
        : "bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-2xl text-white rounded-3xl overflow-hidden hover:bg-zinc-900/50 transition-colors duration-500";

    const itemBg = isLight ? "bg-white border-emerald-900/5 hover:bg-emerald-50/50" : "bg-white/5 border-white/5 hover:bg-white/10";
    const bigTextColor = isLight ? "text-slate-800" : "text-white";
    const subTextColor = isLight ? "text-slate-500" : "text-zinc-500";
    const trashColor = isLight ? "text-slate-400 hover:text-rose-500" : "text-zinc-600 hover:text-rose-400";

    return (
        <Card className={`border-0 ${cardGlass}`}>
            <CardContent className="p-8">
                <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-3">
                        {data.transactions.length === 0 ? <div className={`text-center mt-10 ${subTextColor}`}>Aucun historique</div> : data.transactions.map((tx: any) => (
                            <div key={tx.id} className={`flex justify-between items-center p-5 rounded-2xl border transition-all ${itemBg}`}>
                                <div className="flex items-center gap-5">
                                    <div className={`p-3 rounded-xl ${tx.type === 'revenu' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className={`font-bold text-lg ${bigTextColor}`}>{tx.label}</div>
                                        <div className={`text-xs uppercase font-bold tracking-wider ${subTextColor}`}>{tx.date} • {tx.category}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className={`font-mono text-xl font-bold ${tx.type === 'revenu' ? 'text-emerald-500' : 'text-rose-500'}`}>{tx.type === 'revenu' ? '+' : '-'}{tx.amount.toFixed(2)}€</span>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTx(tx.id)}>
                                        <Trash2 className={`w-5 h-5 ${trashColor}`} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )

}
