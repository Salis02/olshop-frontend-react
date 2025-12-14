import { Link } from 'react-router-dom'

export const CategoryCard = ({ category, productCount = 0 }) => {
    return (
        <Link
            to={`/product?category_id=${category.id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300 group"
        >
            <div className="text-center">
                {/* Icon placeholder - bisa diganti dengan image jika ada */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                    📦
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition">
                    {category.name}
                </h3>

                {category.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {category.description}
                    </p>
                )}

                <p className="text-sm text-gray-500">
                    {productCount} {productCount === 1 ? 'Product' : 'Products'}
                </p>
            </div>
        </Link>
    )
}