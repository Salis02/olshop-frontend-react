export const Loading = () => {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    }

    const spinner = (
        <div
            className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}
        />
    )

    if (fullScreen) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                {spinner}
            </div>
        )
    }

    return spinner;
}

// Skeleton Loader Component
export const Skeleton = ({ className = '' }) => {
    return (
        <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
    )
}

export const ProductCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
    )
}