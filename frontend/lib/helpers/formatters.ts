export function formatCurrency(amount: number, currency: string = '€'): string {
    return `${amount.toFixed(2)}${currency}`
}

export function formatDate(dateString: string, locale: string = 'fr-FR'): string {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export function formatShortDate(dateString: string, locale: string = 'fr-FR'): string {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
    })
}

export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return 'Hier'
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
    return formatDate(dateString)
}

export function formatPercentage(value: number, decimals: number = 0): string {
    return `${value.toFixed(decimals)}%`
}
