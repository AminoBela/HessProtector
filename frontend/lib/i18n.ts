export const Translations = {
    fr: {
        common: {
            loading: "Chargement...",
            error: "Erreur",
            save: "Sauvegarder",
            cancel: "Annuler",
            delete: "Supprimer",
            edit: "Éditer",
            back: "Retour",
            confirm: "Confirmer",
            finish: "Terminer",
            update: "Mettre à jour",
            generating: "Génération...",
            success: "Succès",
            days: "jours"
        },
        auth: {
            loginTitle: "Connexion",
            registerTitle: "Inscription",
            username: "Nom d'utilisateur",
            email: "Email (Optionnel)",
            password: "Mot de passe",
            confirmPassword: "Confirmation",
            loginBtn: "Se Connecter",
            registerBtn: "Créer un Compte",
            switchLogin: "Déjà un compte ? Se connecter",
            switchRegister: "Pas de compte ? S'inscrire",
            welcome: "Bienvenue sur HessProtector",
            subtitle: "Gère ta thune comme un pro.",
            error: "Erreur",
            success: "Succès"
        },
        sidebar: {
            dashboard: "Tableau de Bord",
            coach: "Coach IA",
            recurring: "Calendrier",
            pantry: "Frigo & Scan",
            goals: "Épargne",
            history: "Historique",
            settings: "Paramètres",
            analytics: "Analyses"
        },
        analytics: {
            title: "Analyses",
            month: "Mois",
            year: "Année",
            kpi: {
                income: "Revenus",
                expense: "Dépenses",
                net: "Net",
                savings: "Épargne"
            },
            charts: {
                daily: "Évolution Journalière",
                category: "Par Catégorie"
            },
            topExpenses: "Top Dépenses"
        },
        header: {
            dashboard: "Tableau de Bord",
            coach: "Coach Cuisine IA",
            recurring: "Charges Fixes",
            pantry: "Traçabilité & Stocks",
            goals: "Objectifs & Épargne",
            history: "Historique des Flux",
            settings: "Configuration",
            analytics: "Analyses & Audit"
        },
        dashboard: {
            netBalance: "Solde Net",
            annual: "Annuel",
            incoming: "Entrées",
            outgoing: "Sorties",
            balance: "Bilan",
            surplus: "Excédent",
            deficit: "Déficit",
            perDay: "Reste / Jour",
            daysLeft: "j restants",
            target: "Cible",
            evolution: "Évolution",
            categories: "Dépenses par Catégorie",
            activities: "Dernières Activités",
            loading: "Chargement...",
            noData: "Aucune donnée disponible",
            bank: "Banque",
            toPay: "À payer ce mois",
            safeBalance: "Solde de sécurité",
            incomeVsExpense: "Revenus vs Dépenses"
        },
        coach: {
            title: "Coach Cuisine",
            subtitle: (diet: string) => `Basé sur ton régime ${diet}`,
            budget: "Budget Courses",
            days: "Durée du plan",
            lunch: "Déjeuner",
            dinner: "Dîner",
            generate: "Générer un Plan",
            recalc: "Recalculer avec IA",
            analysis: "Analyse du Coach",
            shopping: "Liste de Courses",
            powered: "Propulsé par Gemini 2.0 Flash",
            savedTitle: "Plans Sauvegardés",
            load: "Charger",
            noPlans: "Aucun plan sauvegardé pour le moment.",
            saveDialogTitle: "Sauvegarder ce plan",
            saveDialogDesc: "Donnez un nom mémorable à ce planning.",
            placeholderName: "Ex: Semaine Healthy #1",
            deleteTitle: "Supprimer ce plan ?",
            deleteDesc: "Cette action est irréversible.",
            successSave: "Plan enregistré avec succès !",
            emptyState: "Laisse l'IA gérer tes repas et ton budget.",
            accessSaved: "Retrouve tes anciens plans via l'historique."
        },
        pantry: {
            title: "Mon Frigo",
            subtitle: "Gère tes stocks et scanne tes tickets.",
            scanBtn: "Scanner un Ticket",
            scanDesc: "Prends une photo, l'IA détecte tout.",
            addItem: "Ajouter un produit manuel",
            itemPlaceholder: "Ex: Pâtes, Riz...",
            qtyPlaceholder: "Qté",
            expiry: "DLC",
            category: "Catégorie",
            add: "Ajouter",
            empty: "Ton frigo est vide. Fais les courses !",
            scanning: "Analyse du ticket en cours...",
            categories: {
                Autre: "Autre",
                Viandes: "Viandes & Poissons",
                Legumes: "Fruits & Légumes",
                Laitiers: "Produits Laitiers",
                Epicerie: "Épicerie",
                Boisson: "Boissons",
                Surgeles: "Surgelés",
                Hygiene: "Hygiène",
                Maison: "Maison"
            }
        },
        goals: {
            title: "Mes Objectifs",
            subtitle: "Épargne pour tes projets futurs.",
            newGoal: "Nouvel Objectif",
            target: "Cible",
            saved: "Épargné",
            add: "Ajouter",
            empty: "Aucun objectif défini. Commence maintenant !",
            congrats: "Félicitations ! Objectif atteint 🎉"
        },
        recurring: {
            title: "Charges Fixes",
            subtitle: "Loyers, abonnements, factures...",
            newRec: "Nouvelle Charge",
            day: "Jour",
            amount: "Montant",
            add: "Ajouter",
            empty: "Aucune charge fixe. C'est louche...",
            total: "Total Mensuel",
            amountPlace: "Montant (€)",
            dayPlace: "Jour (1-31)",
            weekDays: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
            fixe: "Fixe",
            sub: "Abonnement",
            labelPlace: "Nom (Netflix, Loyer)"
        },
        history: {
            title: "Historique",
            subtitle: "Toutes tes transactions passées.",
            empty: "Aucune transaction pour le moment."
        },
        settings: {
            title: "Paramètres",
            subtitle: "Gestion globale de ton compte et de tes préférences.",
            tabs: {
                general: "Général",
                account: "Compte",
                legal: "Légal & RGPD"
            },
            general: {
                supermarket: "Supermarché Préféré (pour les prix)",
                diet: "Régime Alimentaire",
                theme: "Thème",
                language: "Langue",
                save: "Enregistrer"
            },
            account: {
                title: "Sécurité du Compte",
                email: "Email (Non modifiable)",
                password: "Changer le mot de passe",
                newPassword: "Nouveau mot de passe",
                delete: "Supprimer le compte",
                deleteDesc: "Action irréversible. Toutes vos données seront effacées.",
                deleteConfirm: "Êtes-vous sûr de vouloir supprimer votre compte ?,Cette action est définitive.",
                logout: "Se déconnecter"
            },
            legal: {
                title: "Données & Confidentialité",
                export: "Exporter mes données (JSON)",
                exportDesc: "Téléchargez une copie complète de vos données.",
                terms: "Conditions d'utilisation",
                privacy: "Politique de confidentialité",
                read: "Lire"
            }
        },
        rank: {
            title: "Rang Actuel",
            next: "Prochain Rang",
            xp: "XP"
        },
        dialog: {
            newTx: "Nouvelle Transaction",
            label: "Libellé",
            amount: "Montant",
            type: "Type",
            category: "Catégorie",
            expense: "Dépense",
            income: "Revenu",
            add: "Valider la transaction",
            scanTotal: "Total détecté",
            addToExpenses: "Ajouter aux dépenses ?",
            expenseAdded: "Dépense ajoutée !"
        },
        audit: {
            title: "Analyse du Coach",
            score: "Score du Mois",
            roast: "Le Verdict 🔥",
            tips: "Conseils Stratégiques 💡",
            button: "Lancer l'Audit IA",
            analyzing: "Analyse en cours..."
        },
        setup: {
            step1: "Initialisation",
            step2: "Charges Fixes",
            step3: "Ton Profil",
            balance: "Solde Actuel",
            next: "Suivant",
            start: "Lancer HessProtector",
            billName: "Nom (ex: Loyer)",
            billAmount: "€"
        }
    },
    es: {
        common: {
            loading: "Cargando...",
            error: "Error",
            save: "Guardar",
            cancel: "Cancelar",
            delete: "Eliminar",
            edit: "Editar",
            back: "Atrás",
            confirm: "Confirmar",
            finish: "Terminar",
            update: "Actualizar",
            generating: "Generando...",
            success: "Éxito",
            days: "días"
        },
        auth: {
            loginTitle: "Iniciar Sesión",
            registerTitle: "Registro",
            username: "Nombre de usuario",
            email: "Email (Opcional)",
            password: "Contraseña",
            confirmPassword: "Confirmar Contraseña",
            loginBtn: "Entrar",
            registerBtn: "Crear Cuenta",
            switchLogin: "¿Ya tienes cuenta? Entrar",
            switchRegister: "¿No tienes cuenta? Registrarse",
            welcome: "Bienvenido a HessProtector",
            subtitle: "Gestiona tu dinero como un pro.",
            error: "Error",
            success: "Éxito"
        },
        nav: {
            dashboard: "Panel de Control",
            coach: "Chef IA",
            recurring: "Calendario",
            pantry: "Despensa",
            goals: "Metas",
            history: "Historial",
            settings: "Ajustes",
            analytics: "Análisis"
        },
        sidebar: {
            dashboard: "Panel Principal",
            coach: "Chef IA",
            recurring: "Calendario",
            pantry: "Despensa",
            goals: "Metas",
            history: "Historial",
            settings: "Ajustes",
            analytics: "Análisis"
        },
        analytics: {
            title: "Análisis",
            month: "Mes",
            year: "Año",
            kpi: {
                income: "Ingresos",
                expense: "Gastos",
                net: "Neto",
                savings: "Ahorro"
            },
            charts: {
                daily: "Evolución Diaria",
                category: "Por Categoría"
            },
            topExpenses: "Top Gastos"
        },
        header: {
            dashboard: "Panel Financiero",
            coach: "Chef de Cocina IA",
            recurring: "Gastos Fijos",
            pantry: "Inventario & Escáner",
            goals: "Estrategia de Ahorro",
            history: "Historial de Movimientos",
            settings: "Configuración Global",
            analytics: "Análisis y Auditoría"
        },
        dashboard: {
            netBalance: "Saldo Neto",
            annual: "Anual",
            incoming: "Entradas",
            outgoing: "Salidas",
            balance: "Balance",
            surplus: "Superávit",
            deficit: "Déficit",
            perDay: "Restante / Día",
            daysLeft: "d restantes",
            target: "Meta",
            evolution: "Evolución",
            categories: "Gastos por Categoría",
            activities: "Últimas Actividades",
            loading: "Cargando datos...",
            noData: "Sin datos disponibles",
            bank: "Banco",
            toPay: "A pagar este mes",
            safeBalance: "Saldo Seguro",
            incomeVsExpense: "Ingresos vs Gastos"
        },
        coach: {
            title: "Chef de Cocina",
            subtitle: (diet: string) => `Basado en tu dieta ${diet}`,
            budget: "Presupuesto",
            days: "Duración",
            lunch: "Almuerzo",
            dinner: "Cena",
            generate: "Generar Plan",
            recalc: "Recalcular con IA",
            analysis: "Análisis del Chef",
            shopping: "Lista de Compras",
            powered: "",
            savedTitle: "Planes Guardados",
            load: "Cargar",
            noPlans: "No hay planes guardados.",
            saveDialogTitle: "Guardar este plan",
            saveDialogDesc: "Ponle un nombre para encontrarlo después.",
            placeholderName: "Ej: Semana Sana #1",
            deleteTitle: "¿Borrar plan?",
            deleteDesc: "Esta acción no se puede deshacer.",
            successSave: "¡Plan guardado!",
            emptyState: "Deja que la IA organice tus comidas.",
            accessSaved: "Accede a tus planes anteriores en el historial."
        },
        pantry: {
            title: "Mi Despensa",
            subtitle: "Gestiona tu stock y escanea recibos.",
            scanBtn: "Escanear Recibo",
            scanDesc: "Toma una foto, la IA detecta todo.",
            addItem: "Añadir producto manual",
            itemPlaceholder: "Ej: Pasta, Arroz...",
            qtyPlaceholder: "Cant.",
            expiry: "Caducidad",
            category: "Categoría",
            add: "Añadir",
            empty: "Tu despensa está vacía. ¡Ve de compras!",
            scanning: "Analizando recibo...",
            categories: {
                Autre: "Otro",
                Viandes: "Carnes & Pescados",
                Legumes: "Frutas & Verduras",
                Laitiers: "Lácteos",
                Epicerie: "Despensa",
                Boisson: "Bebidas",
                Surgeles: "Congelados",
                Hygiene: "Higiene",
                Maison: "Hogar"
            }
        },
        goals: {
            title: "Mis Metas",
            subtitle: "Ahorra para tus proyectos futuros.",
            newGoal: "Nueva Meta",
            target: "Objetivo",
            saved: "Ahorrado",
            add: "Añadir",
            empty: "Sin metas definidas. ¡Empieza ahora!",
            congrats: "¡Felicidades! Meta alcanzada 🎉"
        },
        recurring: {
            title: "Gastos Fijos",
            subtitle: "Alquiler, suscripciones, facturas...",
            newRec: "Nuevo Gasto",
            day: "Día",
            amount: "Monto",
            add: "Añadir",
            empty: "Sin gastos fijos. Sospechoso...",
            total: "Total Mensual",
            amountPlace: "Monto (€)",
            dayPlace: "Día (1-31)",
            weekDays: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
            fixe: "Fijo",
            sub: "Suscripción",
            labelPlace: "Nombre (Netflix, Alquiler)"
        },
        history: {
            title: "Historial",
            subtitle: "Todas tus transacciones pasadas.",
            empty: "Sin transacciones por el momento."
        },
        settings: {
            title: "Ajustes",
            subtitle: "Gestión global de tu cuenta y preferencias.",
            tabs: {
                general: "General",
                account: "Cuenta",
                legal: "Legal & RGPD"
            },
            general: {
                supermarket: "Supermercado Favorito",
                diet: "Dieta",
                theme: "Tema",
                language: "Idioma",
                save: "Guardar Cambios"
            },
            account: {
                title: "Seguridad de la Cuenta",
                email: "Email (No modificable)",
                password: "Cambiar contraseña",
                newPassword: "Nueva contraseña",
                delete: "Eliminar cuenta",
                deleteDesc: "Acción irreversible. Todos tus datos serán borrados.",
                deleteConfirm: "¿Seguro que quieres eliminar tu cuenta?,Esta acción es definitiva.",
                logout: "Cerrar sesión"
            },
            legal: {
                title: "Datos & Privacidad",
                export: "Exportar mis datos (JSON)",
                exportDesc: "Descarga una copia completa de tus datos.",
                terms: "Términos de uso",
                privacy: "Política de privacidad",
                read: "Leer"
            }
        },
        rank: {
            title: "Rango Actual",
            next: "Siguiente Rango",
            xp: "XP"
        },
        dialog: {
            newTx: "Nueva Transacción",
            label: "Concepto",
            amount: "Monto",
            type: "Tipo",
            category: "Categoría",
            expense: "Gasto",
            income: "Ingreso",
            add: "Validar",
            scanTotal: "Total detectado",
            addToExpenses: "¿Añadir a gastos?",
            expenseAdded: "¡Gasto añadido!"
        },
        audit: {
            title: "Análisis del Coach",
            score: "Puntuación",
            roast: "Veredicto 🔥",
            tips: "Consejos 💡",
            button: "Iniciar Auditoría IA",
            analyzing: "Analizando..."
        },
        setup: {
            step1: "Inicialización",
            step2: "Gastos Fijos",
            step3: "Tu Perfil",
            balance: "Saldo Actual",
            next: "Siguiente",
            start: "Iniciar HessProtector",
            billName: "Nombre (ej: Alquiler)",
            billAmount: "€"
        }
    }
}
