import { useState, useEffect } from "react";
import { Layout } from "../../components/layout/Layout";
import { useAuth } from "../../hooks/useAuth";
import { ProductGrid } from "../../components/product/ProductGrid";
import { productApi } from "../../api";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const HomePage = () => {
    const { user } = useAuth();
    const [FeaturedProducts, setFeaturedProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchFeaturedProducts();
    }, [])

    const fetchFeaturedProducts = async () => {
        try {
            setIsLoading(true)

            const response = await productApi.getAll({
                limit: 8,
                sort: 'created_at',
                order: 'desc',
            });
            setFeaturedProducts(response.data)
        } catch (err) {
            console.error('Failed to fetch products: ', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-lg text-gray-600">
                        Discover amazing products at great prices
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl font-bold text-primary mb-2">0</div>
                        <div className="text-gray-600">Items in Cart</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl font-bold text-primary mb-2">0</div>
                        <div className="text-gray-600">Wishlist</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl font-bold text-primary mb-2">0</div>
                        <div className="text-gray-600">Orders</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">$0</div>
                        <div className="text-gray-600">Total Spent</div>
                    </div>
                </div>

                {/* Featured Categories */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Shop by Category
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Electronics', 'Fashion', 'Home & Living', 'Sports'].map((category) => (
                            <div
                                key={category}
                                className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <div className="text-4xl mb-3">📦</div>
                                <h3 className="font-semibold text-gray-900">{category}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Featured Products */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Featured Products
                    </h2>
                    <Link
                        to="/products"
                        className="flex items-center space-x-2 text-primary hover:text-blue-600 font-medium"
                    >
                        <span>View All</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
                <ProductGrid products={FeaturedProducts} isLoading={isLoading} />
            </div>
        </Layout>
    )
}