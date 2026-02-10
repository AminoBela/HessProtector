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
        LOGIN: '/api/login',
        REGISTER: '/api/register',
    },
    DASHBOARD: '/api/dashboard',
    TRANSACTIONS: '/api/transactions',
    PANTRY: '/api/pantry',
    RECURRING: '/api/recurring',
    GOALS: '/api/goals',
    COACH: '/api/coach/prompt',
    ANALYTICS: '/api/analytics',
} as const
