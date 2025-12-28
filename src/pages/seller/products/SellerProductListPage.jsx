import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SellerLayout } from '../../../components/layout/SellerLayout';
import { Button } from '../../../components/common/Button';
import { Loading } from '../../../components/common/Loading';
import { useAuth } from '../../../hooks/useAuth';
import { productApi } from '../../../api';
import { showConfirm, showToast } from '../../../utils/toast'; // Fixed import path
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';

export const SellerProductListPage = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await productApi.getAll({ limit: 1000 }); // Fetch many to filter client-side

            // Filter products owned by this seller
            // Note: Ideally backend should support filtering by seller_id
            let myProducts = response.data || [];
            if (user?.uuid) {
                myProducts = myProducts.filter(p => p.created_by === user.uuid);
            }

            setProducts(myProducts);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            showToast.error('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (uuid) => {
        showConfirm('Are you sure you want to delete this product?', async () => {
            try {
                await productApi.softDeleteById(uuid);
                showToast.success('Product deleted successfully');
                fetchProducts();
            } catch (error) {
                showToast.error(error.message || 'Failed to delete product');
            }
        });
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    if (isLoading) {
        return (
            <SellerLayout>
                <div className="flex justify-center items-center h-64">
                    <Loading />
                </div>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
                    <p className="text-gray-600">Manage your product catalog</p>
                </div>
                <Link to="/seller/products/new">
                    <Button>
                        <Plus className="w-5 h-5 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.uuid} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img
                                                        className="h-10 w-10 rounded-lg object-cover"
                                                        src={product.images?.[0]?.url || '/placeholder.jpg'}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-sm text-gray-500">SKU: {product.sku || '-'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' :
                                                    product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.category?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    to={`/products/${product.uuid}`}
                                                    className="text-gray-400 hover:text-gray-600"
                                                    title="View"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                                <Link
                                                    to={`/seller/products/edit/${product.uuid}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.uuid)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SellerLayout>
    );
};
