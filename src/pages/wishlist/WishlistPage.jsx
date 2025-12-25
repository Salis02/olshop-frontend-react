import { Layout } from '../../components/layout/Layout';
import { useWishlist } from '../../hooks/useWishlist';
import { WishlistCard } from '../../components/wishlist/WishlistCard';
import { Loading } from '../../components/common/Loading';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';

export const WishlistPage = () => {
    const { wishlist, loading } = useWishlist();

    if (loading) {
        return (
            <Layout>
                <Loading fullScreen />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/products"
                        className="inline-flex items-center text-primary hover:text-blue-600 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <p className="text-gray-600 mt-2">
                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
                    </p>
                </div>

                {/* Empty Wishlist */}
                {wishlist.length === 0 ? (
                    <div className="text-center py-16">
                        <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Save your favorite products here!
                        </p>
                        <Link
                            to="/products"
                            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    /* Wishlist Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((item) => (
                            <WishlistCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};