export interface User {
    id: number
    username: string
    email?: string
}

export interface Transaction {
    id?: number
    label: string
    amount: number
    type: 'revenu' | 'depense'
    category: string
    date: string
}

export interface PantryItem {
    id?: number
    item: string
    qty: string
    category: string
    expiry: string
    added_date: string
}

export interface RecurringItem {
    id?: number
    label: string
    amount: number
    day: number
    type: 'depense' | 'revenu'
}

export interface GoalItem {
    id?: number
    label: string
    target: number
    saved: number
    deadline: string
}

export interface Profile {
    id?: number
    supermarket: string
    diet: string
    initial_balance: number
    unlocked_themes?: string
    active_theme?: string
}

export interface BudgetLimit {
    id?: number
    category: string
    amount: number
}

export interface PlanItem {
    id?: number
    name: string
    content: string
    created_at: string
}

export interface Achievement {
    id: string
    icon: string
    name: string
    desc: string
    locked?: boolean
}
