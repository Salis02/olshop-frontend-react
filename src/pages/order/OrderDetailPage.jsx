import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import { orderApi } from "../../api";
import { ArrowLeft, MapPin, CreditCard, Package, Truck } from "lucide-react";

export const OrderDetailPage = () => {
    const { uuid } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                setLoading(true);
                const response = await orderApi.getById(uuid);
                setOrder(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [uuid]);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    if (error || !order) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                        {error || 'Order not found'}
                    </div>
                    <Link to="/orders" className="text-primary mt-4 inline-block">← Back to Orders</Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Link to="/orders" className="inline-flex items-center text-gray-600 hover:text-primary">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column: Order Details */}
                    <div className="flex-1 space-y-6">
                        {/* Order Header */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.uuid.substring(0, 8)}</h1>
                                    <p className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                                </div>
                                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold uppercase text-sm">
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-semibold flex items-center">
                                    <Package className="w-5 h-5 mr-2" /> Items
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.products?.map((item) => (
                                    <div key={item.id} className="p-6 flex items-center">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                                            <p className="text-sm text-gray-500">Qty: {item.qty} x Rp {parseInt(item.price).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right font-medium">
                                            Rp {(item.qty * item.price).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary & Info */}
                    <div className="md:w-1/3 space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>Rp {parseInt(order.total_price).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span>Rp 0</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">Rp {parseInt(order.total_price).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2" /> Shipping Address
                            </h2>
                            <p className="font-medium">{order.address?.name}</p>
                            <p className="text-gray-600 text-sm mt-1">{order.address?.street}</p>
                            <p className="text-gray-600 text-sm">{order.address?.city}, {order.address?.state} {order.address?.zip_code}</p>
                            <p className="text-gray-600 text-sm">{order.address?.country}</p>
                            <p className="text-gray-600 text-sm mt-2">Phone: {order.address?.phone}</p>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2" /> Payment
                            </h2>
                            <p className="text-gray-600">Transfer Bank</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
