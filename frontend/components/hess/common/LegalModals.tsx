import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LegalModalProps {
    title: string;
    trigger: React.ReactNode;
    content: string;
    isLight: boolean;
}

export function LegalModal({ title, trigger, content, isLight }: LegalModalProps) {
    const glass = isLight
        ? "bg-white/90 backdrop-blur-xl border-emerald-900/10 text-slate-800"
        : "bg-zinc-950/90 backdrop-blur-xl border-white/10 text-white";

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className={`max-w-2xl max-h-[80vh] ${glass} border-0 shadow-2xl rounded-3xl`}>
                <DialogHeader>
                    <DialogTitle className={`text-2xl font-black uppercase tracking-tight ${isLight ? 'text-emerald-700' : 'text-emerald-500'}`}>{title}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] w-full pr-4">
                    <div className="space-y-4 text-sm leading-relaxed p-2">
                        {content.split('\n').map((line, i) => (
                            <p key={i} className={`${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                                {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                                    part.startsWith('**') && part.endsWith('**') ? (
                                        <strong key={j} className="font-black text-emerald-500">{part.slice(2, -2)}</strong>
                                    ) : (
                                        part
                                    )
                                )}
                            </p>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export const LEGAL_TEXT = {
    privacy: `
**Politique de Confidentialité - HessProtector**

1. **Collecte des Données**
   Nous collectons uniquement les données nécessaires au fonctionnement de l'application :
   - Transactions financières (montant, date, label)
   - Préférences alimentaires (pour le Coach IA)
   - Objectifs d'épargne
   - Données d'authentification (email hashé)

2. **Utilisation des Données**
   Vos données sont utilisées pour :
   - Générer vos tableaux de bord financiers
   - Alimenter l'IA (Gemini) pour le coaching personnalisé
   - Sauvegarder vos préférences

3. **Protection des Données**
   Toutes les données sensibles sont chiffrées. Nous ne vendons jamais vos données à des tiers.
   
4. **Vos Droits (RGPD)**
   Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de portabilité et d'effacement de vos données.
   Vous pouvez exercer ces droits directement depuis les paramètres de l'application.

5. **Cookies**
   Nous utilisons uniquement des cookies techniques nécessaires au maintien de votre session.
    `,
    terms: `
**Conditions Générales d'Utilisation**

1. **Acceptation**
   En utilisant HessProtector, vous acceptez ces conditions.

2. **Service**
   HessProtector est un outil d'aide à la gestion financière. Les conseils prodigués par l'IA sont donnés à titre indicatif et ne constituent pas un conseil financier professionnel.

3. **Responsabilité**
   Nous ne saurions être tenus responsables des décisions financières prises sur la base des informations fournies par l'application.

4. **Compte Utilisateur**
   Vous êtes responsable de la confidentialité de vos identifiants. Toute action effectuée depuis votre compte est réputée être effectuée par vous.

5. **Modification**
   Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront notifiés des changements importants.
    `
};
