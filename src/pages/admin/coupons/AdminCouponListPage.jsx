import { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout/Layout';
import { couponApi } from '../../../api';
import { showToast, showConfirm } from '../../../utils/toast';
import { Plus, Edit, Trash2, Tag, Calendar } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Loading } from '../../../components/common/Loading';

export const AdminCouponListPage = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discount_type: 'percentage',
        value: '',
        max_usage: '',
        min_order: '',
        expires_at: ''
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const response = await couponApi.getAll();
            setCoupons(response.data || []);
        } catch (error) {
            showToast.error('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCoupon) {
                await couponApi.update(editingCoupon.id, formData);
                showToast.success('Coupon updated successfully');
            } else {
                await couponApi.create(formData);
                showToast.success('Coupon created successfully');
            }

            setShowModal(false);
            resetForm();
            fetchCoupons();
        } catch (error) {
            showToast.error(error.response?.data?.message || 'Failed to save coupon');
        }
    };

    const handleDelete = async (id) => {
        showConfirm('Are you sure you want to delete this coupon?', async () => {
            try {
                await couponApi.delete(id);
                showToast.success('Coupon deleted successfully');
                fetchCoupons();
            } catch (error) {
                showToast.error('Failed to delete coupon');
            }
        });
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            description: coupon.description || '',
            discount_type: coupon.discount_type,
            value: coupon.value,
            max_usage: coupon.max_usage,
            min_order: coupon.min_order || '',
            expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingCoupon(null);
        setFormData({
            code: '',
            description: '',
            discount_type: 'percentage',
            value: '',
            max_usage: '',
            min_order: '',
            expires_at: ''
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Coupons</h1>
                    <Button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Coupon
                    </Button>
                </div>

                {/* Coupons List */}
                {coupons.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No coupons yet</h3>
                        <p className="mt-2 text-gray-500">Create your first coupon to get started</p>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Discount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usage
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Expires
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {coupons.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Tag className="w-5 h-5 text-primary mr-2" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {coupon.code}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {coupon.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-semibold text-green-600">
                                                {coupon.discount_type === 'percentage'
                                                    ? `${coupon.value}%`
                                                    : formatPrice(coupon.value)}
                                            </span>
                                            {coupon.min_order && (
                                                <div className="text-xs text-gray-500">
                                                    Min: {formatPrice(coupon.min_order)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {coupon.current_usage} / {coupon.max_usage}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {new Date(coupon.expires_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(coupon)}
                                                className="text-primary hover:text-blue-700 mr-4"
                                            >
                                                <Edit className="w-4 h-4 inline" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(coupon.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="w-4 h-4 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold mb-4">
                                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Coupon Code
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        rows="2"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Discount Type
                                        </label>
                                        <select
                                            value={formData.discount_type}
                                            onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Value
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Usage
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.max_usage}
                                            onChange={(e) => setFormData({ ...formData, max_usage: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Order (optional)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.min_order}
                                            onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Expires At
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.expires_at}
                                        onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" className="flex-1">
                                        {editingCoupon ? 'Update' : 'Create'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};
