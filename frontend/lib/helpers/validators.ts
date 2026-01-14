export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function validateAmount(amount: number): { isValid: boolean; error?: string } {
    if (amount <= 0) {
        return { isValid: false, error: 'Le montant doit être positif' }
    }
    if (amount > 1000000) {
        return { isValid: false, error: 'Le montant semble trop élevé' }
    }
    return { isValid: true }
}

export function validateDate(dateString: string): boolean {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
}

export function validateRequired(value: string | number): { isValid: boolean; error?: string } {
    if (value === '' || value === null || value === undefined) {
        return { isValid: false, error: 'Ce champ est requis' }
    }
    return { isValid: true }
}

export function validateLength(
    value: string,
    min: number,
    max: number
): { isValid: boolean; error?: string } {
    if (value.length < min) {
        return { isValid: false, error: `Minimum ${min} caractères` }
    }
    if (value.length > max) {
        return { isValid: false, error: `Maximum ${max} caractères` }
    }
    return { isValid: true }
}
