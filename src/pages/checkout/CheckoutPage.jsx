import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { useCart } from '../../hooks/useCart';
import { addressApi, orderApi, paymentApi, couponApi } from '../../api';
import { showToast } from '../../utils/toast';
import { MapPin, CreditCard, Tag, Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';

export const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, loading: cartLoading } = useCart();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
    const [loading, setLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(true);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setAddressLoading(true);
            const response = await addressApi.getAll();
            setAddresses(response.data || []);

            // Auto-select default address
            const defaultAddr = response.data?.find(addr => addr.is_default);
            if (defaultAddr) {
                setSelectedAddress(defaultAddr.id);
            } else if (response.data?.length > 0) {
                setSelectedAddress(response.data[0].id);
            }
        } catch (error) {
            showToast.error('Failed to load addresses');
        } finally {
            setAddressLoading(false);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            showToast.error('Please enter a coupon code');
            return;
        }

        try {
            const response = await couponApi.validate(couponCode);
            if (response.success) {
                setAppliedCoupon(response.data);
                showToast.success('Coupon applied successfully!');
            }
        } catch (error) {
            showToast.error(error.response?.data?.message || 'Invalid coupon code');
            setAppliedCoupon(null);
        }
    };

    const calculateDiscount = () => {
        if (!appliedCoupon || !cart?.total) return 0;

        if (appliedCoupon.discount_type === 'percentage') {
            return (cart.total * appliedCoupon.value) / 100;
        }
        return appliedCoupon.value;
    };

    const calculateTotal = () => {
        const subtotal = cart?.total || 0;
        const discount = calculateDiscount();
        const shipping = 0; // Free shipping
        return subtotal - discount + shipping;
    };

    const handleCheckout = async () => {
        if (!selectedAddress) {
            showToast.error('Please select a shipping address');
            return;
        }

        if (!cart?.items || cart.items.length === 0) {
            showToast.error('Your cart is empty');
            return;
        }

        try {
            setLoading(true);

            // Create order
            const orderData = {
                shipping_address_id: selectedAddress,
                coupon_id: appliedCoupon?.id || null,
                payment_method: paymentMethod,
                items: cart.items.map(item => ({
                    product_id: item.product_id,
                    variant_id: item.variant_id || null,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const orderResponse = await orderApi.create(orderData);

            if (orderResponse.success) {
                const orderId = orderResponse.data.uuid;

                // Create payment
                const paymentData = {
                    order_id: orderId,
                    provider: paymentMethod,
                    amount: calculateTotal()
                };

                const paymentResponse = await paymentApi.create(paymentData);

                if (paymentResponse.success) {
                    showToast.success('Order placed successfully!');

                    // Redirect based on payment method
                    if (paymentResponse.data.redirect_url) {
                        window.location.href = paymentResponse.data.redirect_url;
                    } else {
                        navigate(`/orders/${orderId}`);
                    }
                }
            }
        } catch (error) {
            showToast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    if (cartLoading || addressLoading) {
        return (
            <Layout>
                <Loading fullScreen />
            </Layout>
        );
    }

    if (!cart?.items || cart.items.length === 0) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Your cart is empty
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Add some products before checkout
                    </p>
                    <Link to="/products">
                        <Button>Browse Products</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/cart"
                        className="inline-flex items-center text-primary hover:text-blue-600 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Cart
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2" />
                                Shipping Address
                            </h2>

                            {addresses.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 mb-4">No addresses found</p>
                                    <Link to="/profile/addresses/new">
                                        <Button size="sm">Add Address</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {addresses.map((address) => (
                                        <label
                                            key={address.id}
                                            className={`block p-4 border-2 rounded-lg cursor-pointer transition ${selectedAddress === address.id
                                                    ? 'border-primary bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="address"
                                                value={address.id}
                                                checked={selectedAddress === address.id}
                                                onChange={() => setSelectedAddress(address.id)}
                                                className="sr-only"
                                            />
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {address.label}
                                                        {address.is_default && (
                                                            <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded">
                                                                Default
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {address.recipient_name} - {address.phone}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {address.address_line}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {address.city}, {address.province} {address.postal_code}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2" />
                                Payment Method
                            </h2>

                            <div className="space-y-3">
                                <label className="block p-4 border-2 rounded-lg cursor-pointer transition border-primary bg-blue-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="bank_transfer"
                                        checked={paymentMethod === 'bank_transfer'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className="flex items-center">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">Bank Transfer</p>
                                            <p className="text-sm text-gray-600">Pay via bank transfer</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Coupon Code */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Tag className="w-5 h-5 mr-2" />
                                Discount Coupon
                            </h2>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Enter coupon code"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    disabled={appliedCoupon}
                                />
                                <Button
                                    onClick={handleApplyCoupon}
                                    variant="outline"
                                    disabled={appliedCoupon}
                                >
                                    {appliedCoupon ? 'Applied' : 'Apply'}
                                </Button>
                            </div>

                            {appliedCoupon && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-green-800">{appliedCoupon.code}</p>
                                        <p className="text-sm text-green-600">
                                            {appliedCoupon.discount_type === 'percentage'
                                                ? `${appliedCoupon.value}% discount`
                                                : `${formatPrice(appliedCoupon.value)} discount`}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setAppliedCoupon(null);
                                            setCouponCode('');
                                        }}
                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                                            {item.product?.images?.[0] && (
                                                <img
                                                    src={item.product.images[0].path}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {item.quantity} x {formatPrice(item.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(cart.total || 0)}</span>
                                </div>

                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-{formatPrice(calculateDiscount())}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">FREE</span>
                                </div>

                                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">{formatPrice(calculateTotal())}</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <Button
                                onClick={handleCheckout}
                                className="w-full mt-6"
                                size="lg"
                                disabled={loading || !selectedAddress}
                                loading={loading}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </Button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                By placing your order, you agree to our terms and conditions
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
