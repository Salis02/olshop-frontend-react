import { useState, useEffect } from "react";
import { Layout } from '../../components/layout/Layout';
import { CategoryGrid } from '../../components/category/CategoryGrid';
import { categoryApi } from '../../api';

export const CategoriesPage = () => {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await categoryApi.getAll()
            setCategories(response)

        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Shop by Category
                    </h1>
                    <p className="text-gray-600">
                        Browse products by category
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Categories Grid */}
                <CategoryGrid categories={categories} isLoading={isLoading} />
            </div>
        </Layout>
    )
}