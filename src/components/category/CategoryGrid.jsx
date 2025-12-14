import { CategoryCard } from "./CategoryCard";
import { Skeleton } from "../common/Loading"

export const CategoryGrid = ({ categories, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                        <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
                        <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                        <Skeleton className="h-3 w-1/2 mx-auto" />
                    </div>
                ))}
            </div>
        )
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                    No categories found
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
                <CategoryCard
                    key={category.id}
                    category={category}
                    productCount={category._count?.products || 0}
                />
            ))}
        </div>
    )
}