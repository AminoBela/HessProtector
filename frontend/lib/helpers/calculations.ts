import { Transaction } from '@/types'

export function calculateBalance(transactions: Transaction[]): number {
    return transactions.reduce((acc, tx) => {
        return tx.type === 'revenu' ? acc + tx.amount : acc - tx.amount
    }, 0)
}

export function calculateTotalIncome(transactions: Transaction[]): number {
    return transactions
        .filter((tx) => tx.type === 'revenu')
        .reduce((acc, tx) => acc + tx.amount, 0)
}

export function calculateTotalExpense(transactions: Transaction[]): number {
    return transactions
        .filter((tx) => tx.type === 'depense')
        .reduce((acc, tx) => acc + tx.amount, 0)
}

export function calculateSavingsRate(income: number, expense: number): number {
    if (income === 0) return 0
    return ((income - expense) / income) * 100
}

export function groupByCategory(transactions: Transaction[]): Record<string, number> {
    return transactions
        .filter((tx) => tx.type === 'depense')
        .reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount
            return acc
        }, {} as Record<string, number>)
}

export function calculateMonthlyAverage(transactions: Transaction[], months: number = 3): number {
    if (months === 0) return 0
    const total = calculateTotalExpense(transactions)
    return total / months
}
