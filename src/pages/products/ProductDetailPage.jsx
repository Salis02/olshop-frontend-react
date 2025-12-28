import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import { Button } from "../../components/common/Button";
import { Loading } from "../../components/common/Loading";
import { ReviewList } from '../../components/review/ReviewList';
import { ReviewForm } from '../../components/review/ReviewForm';
import { productApi } from "../../api";
import { reviewApi } from '../../api';
import {
    ShoppingCart,
    Heart,
    Star,
    Minus,
    Plus,
    ChevronLeft,
    Package,
    Shield,
    Truck
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { WishlistButton } from '../../components/wishlist/WishlistButton'
import { showToast } from "../../utils/toast";

export const ProductDetailPage = () => {
    const { uuid } = useParams()
    const navigate = useNavigate()
    const { addItemToCart } = useCart()

    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [reviews, setReviews] = useState([])
    const [isLoadingReviews, setIsLoadingReviews] = useState(false)
    const [isAddingToCart, setIsAddingToCart] = useState(false)

    useEffect(() => {
        if (!uuid) return;

        fetchProductDetail();
        fetchReviews();
    }, [uuid]);


    const fetchProductDetail = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await productApi.getById(uuid)
            setProduct(response)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchReviews = async () => {
        try {
            setIsLoadingReviews(true)
            const response = await reviewApi.getByProduct(uuid)
            setReviews(response)
        } catch (err) {
            console.error('Failed to fetch reviews: ', err)
        } finally {
            setIsLoadingReviews(false)
        }
    }

    const handleReviewSubmitSuccess = () => {
        fetchReviews()
        showToast.success('Review submitted successfully')
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price)
    }

    const calculateAverageRating = () => {
        if (!product?.reviews || product.reviews.length === 0) return 0;
        const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0)
        return (sum / product.reviews.length).toFixed(1)
    }

    const handleQuantityChange = (type) => {
        if (type === 'increment' && quantity < product.stock) {
            setQuantity(quantity + 1)
        } else if (type === 'decrement' && quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    const handleAddToCart = async () => {
        setIsAddingToCart(true);

        const toastId = showToast.loading('Adding to cart...')
        const result = await addItemToCart(product.uuid, null, quantity);
        showToast.dismiss(toastId)

        if (result.success) {
            showToast.success(`Added ${quantity} ${product.name} to cart!`);
        } else {
            showToast.error(result.message);
        }
        setIsAddingToCart(false);
    };

    const handleAddToWishlist = () => {
        console.log('Add to wishlist:', product.uuid)
        showToast.success('Added to wishlist')
    }


    if (isLoading) {
        return (
            <Layout>
                <Loading fullScreen />
            </Layout>
        )
    }

    if (error || !product) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
                        <Button onClick={() => navigate('/products')}>
                            Back to Products
                        </Button>
                    </div>
                </div>
            </Layout>
        )
    }

    const images = product.images?.length > 0 ? product.images : [{ url: '/placeholder.jpg' }]
    const avgRating = calculateAverageRating()

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-primary">Products</Link>
                    <span>/</span>
                    <span className="text-gray-900">{product.name}</span>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-6 transition"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                {/* Product Detail Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Left: Images */}
                    <div>
                        {/* Main Image */}
                        <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square">
                            <img
                                src={images[selectedImage]?.url || '/placeholder.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = '/placeholder.jpg';
                                }}
                            />
                        </div>

                        {/* Thumbnail Images */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`border-2 rounded-lg overflow-hidden aspect-square ${selectedImage === index
                                            ? 'border-primary'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/placeholder.jpg';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div>
                        {/* Category */}
                        <div className="text-sm text-gray-500 mb-2">
                            {product.category?.name || 'Uncategorized'} • Sold by {product.creator?.name || 'Official Store'}
                        </div>

                        {/* Product Name */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, index) => (
                                    <Star
                                        key={index}
                                        className={`w-5 h-5 ${index < Math.round(avgRating)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-gray-600">
                                {avgRating} ({product.reviews?.length || 0} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-primary">
                                {formatPrice(product.price)}
                            </span>
                        </div>

                        {/* Stock Status */}
                        <div className="mb-6">
                            {product.stock > 0 ? (
                                <div className="flex items-center text-green-600">
                                    <Package className="w-5 h-5 mr-2" />
                                    <span className="font-medium">In Stock ({product.stock} available)</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-red-600">
                                    <Package className="w-5 h-5 mr-2" />
                                    <span className="font-medium">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {product.description || 'No description available.'}
                            </p>
                        </div>

                        {/* Variants (if available) */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Variants</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:border-primary hover:text-primary transition"
                                        >
                                            {variant.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quantity</h3>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange('decrement')}
                                        disabled={quantity <= 1}
                                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange('increment')}
                                        disabled={quantity >= product.stock}
                                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <span className="text-gray-600">
                                    Max: {product.stock}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 mb-8">
                            <Button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                isLoading={isAddingToCart}
                                className="flex-1"
                                size="lg"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Add to Cart
                            </Button>
                            <div className="p-3 border-2 border-gray-300 rounded-lg hover:border-primary transition">
                                <WishlistButton productId={uuid} size="lg" />
                            </div>
                        </div>

                        {/* Features */}
                        <div className="border-t pt-6 space-y-4">
                            <div className="flex items-start space-x-3">
                                <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">Free Shipping</h4>
                                    <p className="text-sm text-gray-600">On orders over Rp 100.000</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                                    <p className="text-sm text-gray-600">100% secure payment</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                                    <p className="text-sm text-gray-600">30 days return policy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Attributes */}
                {product.attributes && product.attributes.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {product.attributes.map((attr) => (
                                <div key={attr.id} className="flex border-b border-gray-200 py-2">
                                    <span className="font-medium text-gray-700 w-1/3">{attr.name}:</span>
                                    <span className="text-gray-600 w-2/3">{attr.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Customer Reviews ({reviews.length})
                    </h2>

                    {/* Review Form */}
                    <div className="mb-8">
                        <ReviewForm
                            productId={uuid}
                            onSubmitSuccess={handleReviewSubmitSuccess}
                        />
                    </div>

                    {/* Reviews List */}
                    <ReviewList reviews={reviews} isLoading={isLoadingReviews} />
                </div>
            </div>
        </Layout>
    )
}