import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "../common/Loading";

export const ProductGrid = ({ products, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {
                products.map(product => (
                    <ProductCard key={product.uuid} product={product} />
                ))
            }
        </div >
    )
}