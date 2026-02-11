import { ComponentType } from 'react'

interface WithLoadingProps {
    isLoading: boolean
}

export function withLoading<P extends object>(
    Component: ComponentType<P>,
    LoadingComponent: ComponentType = () => <div className="flex items-center justify-center p-8">Loading...</div>
) {
    return function WrappedComponent(props: P & WithLoadingProps) {
        const { isLoading, ...restProps } = props

        if (isLoading) {
            return <LoadingComponent />
        }

        return <Component {...(restProps as P)} />
    }
}
