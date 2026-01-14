import { Transaction, PantryItem, RecurringItem, GoalItem, Profile, Achievement } from './models'

export interface DashboardData {
    transactions: Transaction[]
    pantry: PantryItem[]
    recurring: RecurringItem[]
    goals: GoalItem[]
    profile: Profile | null
    balance: number
    upcoming_bills: number
    safe_balance: number
    income: number
    expense: number
    monthly_burn: number
    categories: Record<string, number>
    xp: number
    rank: string
    next_rank_xp: number
    prediction: PredictionData
    achievements: Achievement[]
    is_setup: boolean
}

export interface PredictionData {
    end_balance: number
    status: 'safe' | 'warning' | 'danger'
    message: string
}

export interface ApiResponse<T> {
    data?: T
    status?: string
    error?: string
}

export interface PromptRequest {
    type: 'emergency' | 'meal_plan' | 'recipe'
    budget: number
    days: number
    meals: string[]
    language: 'fr' | 'es'
    current_plan?: string
}

export interface PromptResponse {
    prompt?: {
        title?: string
        emoji?: string
        steps?: Array<{ icon: string; action: string }>
        motivational_speech?: string
        analysis?: string
        meals?: Array<{ day: string; lunch?: string; dinner?: string }>
        shopping_list?: Array<{ item: string; price: string }>
        total_estimated_cost?: string
        tips?: string[]
    }
    error?: string
}

export interface AnalyticsData {
    daily_data: Array<{
        day: number
        income: number
        expense: number
    }>
    category_data: Array<{
        name: string
        value: number
        limit: number
        percent: number
    }>
    top_expenses: Array<{
        label: string
        amount: number
        date: string
    }>
    stats: {
        income: number
        expense: number
        net: number
        savings_rate: number
    }
}

export interface AuditResponse {
    analysis?: {
        score: number
        title: string
        roast: string
        pros: string[]
        cons: string[]
        tips: Array<{ icon: string; tip: string }>
    }
    error?: string
}
