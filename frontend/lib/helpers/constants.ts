export const CATEGORIES = [
    'Alimentation',
    'Transport',
    'Logement',
    'Loisirs',
    'Santé',
    'Vêtements',
    'Éducation',
    'Autre',
] as const

export const TRANSACTION_TYPES = {
    INCOME: 'revenu',
    EXPENSE: 'depense',
} as const

export const PANTRY_CATEGORIES = [
    'Viandes',
    'Légumes',
    'Fruits',
    'Laitiers',
    'Épicerie',
    'Boissons',
    'Surgelés',
    'Hygiène',
    'Maison',
    'Autre',
] as const

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'] as const

export const DIETS = ['Omnivore', 'Végétarien', 'Végétalien', 'Sans Gluten'] as const

export const SUPERMARKETS = [
    'Carrefour',
    'Auchan',
    'Leclerc',
    'Intermarché',
    'Lidl',
    'Aldi',
    'Autre',
] as const

export const LANGUAGES = {
    FR: 'fr',
    EN: 'en',
} as const

export const CACHE_KEYS = {
    DASHBOARD: 'dashboard_data',
    USER: 'user_data',
    GOALS: 'goals',
    PANTRY: 'pantry',
    TRANSACTIONS: 'transactions',
} as const

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
    },
    DASHBOARD: '/dashboard',
    TRANSACTIONS: '/transactions',
    PANTRY: '/pantry',
    RECURRING: '/recurring',
    GOALS: '/goals',
    COACH: '/coach/prompt',
    ANALYTICS: '/analytics',
} as const
