import { ReactNode } from 'react'

export interface LayoutProps {
    children: ReactNode
    currentView?: string
    onNavigate?: (view: string) => void
}

export interface ButtonProps {
    children: ReactNode
    onClick?: () => void
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    disabled?: boolean
    className?: string
    type?: 'button' | 'submit' | 'reset'
}

export interface CardProps {
    children: ReactNode
    className?: string
    onClick?: () => void
}

export interface InputProps {
    type?: string
    value?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    min?: number
    max?: number
    step?: number
}

export interface SelectOption {
    value: string
    label: string
}

export interface SelectProps {
    options: SelectOption[]
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    disabled?: boolean
    className?: string
}

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: ReactNode
}

export interface LoadingState {
    isLoading: boolean
    error: string | null
}

export interface AsyncState<T> extends LoadingState {
    data: T | null
}
