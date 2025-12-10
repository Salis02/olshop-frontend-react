import { useState, useEffect } from "react";
import { Layout } from "../../components/layout/Layout";
import { ProductGrid } from "../../components/product/ProductGrid";
import { productApi } from "../../api";
import { Search, SlidersHorizontal } from "lucide-react";

export const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        sort: 'created_at',
        order: 'desc',
        page: 1,
        limit: 12,
    })

    const [pagination, setPagination] = useState(null)

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await productApi.getAll(filters);
            setProducts(response.data);
            setPagination(response.pagination);
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters({ ...filters, page: 1 })
    }

    const handleSortChange = (e) => {
        setFilters({ ...filters, sort: e.target.value, page: 1 });
    }

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900mb-2">All Products</h1>
                    <p className="text-gray-600">Browse our collection of amazing products.</p>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">

                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex items-center w-full md:w-1/2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search product"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <Search className="absolute right-3 top-2.5 text-gray-300 w-5 h-5" />
                            </div>
                        </form>

                        {/* Sort */}
                        <div className="flex items-center space-x-3">
                            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                            <select
                                value={filters.sort}
                                onChange={handleSortChange}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="created_at">Newest</option>
                                <option value="name">Name (A-Z)</option>
                                <option value="price">Price (Low to High)</option>
                                <option value="rating">Rating</option>
                            </select>
                        </div>

                    </div>
                </div>

                {/* Error Messagae */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Product Grid */}
                <ProductGrid products={products} isLoading={isLoading} />

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            {[...Array(pagination.totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-4 py-2 border rounded-lg ${pagination.page === index + 1
                                        ? 'bg-primary text-white border-primary'
                                        : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}