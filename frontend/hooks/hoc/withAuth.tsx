import { ComponentType, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function withAuth<P extends object>(Component: ComponentType<P>) {
    return function AuthenticatedComponent(props: P) {
        const router = useRouter()

        useEffect(() => {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/')
            }
        }, [router])

        return <Component {...props} />
    }
}
