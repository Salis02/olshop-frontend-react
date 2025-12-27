import { useState, useEffect } from "react";
import { Layout } from "../../components/layout/Layout";
import { orderApi } from "../../api";
import { Package, ChevronRight, Calendar, DollarSign, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await orderApi.getAll({ page });
                setOrders(response.data);
                setPagination(response.pagination);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [page]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold mb-8">Order History</h1>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                        {error}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                        <p className="mt-2 text-gray-500">Go shopping and make your first order!</p>
                        <div className="mt-6">
                            <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark">
                                Shop Now
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.uuid} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                            <div className="p-2 bg-primary bg-opacity-10 rounded-full">
                                                <Package className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Order ID</p>
                                                <p className="font-semibold text-gray-900">#{order.uuid.substring(0, 8)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-600">
                                        <div className="space-y-1 mb-4 md:mb-0">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <DollarSign className="w-4 h-4 mr-2" />
                                                Total: Rp {parseInt(order.total_price).toLocaleString()}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2" />
                                                {order.products?.length || 0} Items
                                            </div>
                                        </div>
                                        <Link
                                            to={`/orders/${order.uuid}`}
                                            className="flex items-center text-primary font-medium hover:text-primary-dark"
                                        >
                                            View Details <ChevronRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 border rounded-l-lg disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                    disabled={page === pagination.totalPages}
                                    className="px-4 py-2 border-t border-b border-r rounded-r-lg disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};
