import { Layout } from "../../components/layout/Layout";
import { useAuth } from "../../hooks/useAuth";

export const HomePage = () => {
    const { user } = useAuth();
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

                {/* Products Section - Coming Soon */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Featured Products
                    </h2>
                    <div className="bg-gray-100 rounded-lg p-12 text-center">
                        <p className="text-gray-600">
                            Products will be loaded here soon...
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}