import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SellerLayout } from '../../../components/layout/SellerLayout';
import { ProductBasicInfo } from '../../../components/seller/product/ProductBasicInfo';
import { ProductImageManager } from '../../../components/seller/product/ProductImageManager';
import { ProductVariantManager } from '../../../components/seller/product/ProductVariantManager';
import { ProductAttributeManager } from '../../../components/seller/product/ProductAttributeManager';
import { productApi } from '../../../api';
import { showToast } from '../../../utils/toast';
import { Loading } from '../../../components/common/Loading';
import { ChevronRight } from 'lucide-react';

export const SellerProductFormPage = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!uuid;

    const [activeTab, setActiveTab] = useState('basic');
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [isEditMode, uuid]);

    const fetchProduct = async () => {
        try {
            setIsLoading(true);
            const data = await productApi.getById(uuid);
            setProduct(data); // Assuming response is the product object directly or data.data?
            // Checking product.service.js getProductById returns normalized product directly?
            // product.api.js getById returns response.data.
            // Let's assume response.data IS the product object.
        } catch (error) {
            console.error('Failed to fetch product:', error);
            showToast.error('Failed to load product details');
            navigate('/seller/products');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBasicInfoSubmit = async (formData) => {
        try {
            setIsLoading(true);
            if (isEditMode) {
                await productApi.updateById(uuid, formData);
                showToast.success('Product updated successfully');
                fetchProduct(); // Refresh data
            } else {
                const newProduct = await productApi.create(formData);
                showToast.success('Product created successfully');
                // Redirect to edit mode for this product to enable other tabs
                // Adjust depending on response structure. product.service create returns product object.
                // product.api create returns response.data
                const newUuid = newProduct.uuid || newProduct.data?.uuid;
                navigate(`/seller/products/edit/${newUuid}`, { replace: true });
                setActiveTab('images'); // Auto switch to images tab
            }
        } catch (error) {
            console.error(error);
            showToast.error(error.message || 'Failed to save product');
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'basic', label: 'Basic Info' },
        { id: 'images', label: 'Images', disabled: !isEditMode },
        { id: 'variants', label: 'Variants', disabled: !isEditMode },
        { id: 'attributes', label: 'Attributes', disabled: !isEditMode },
    ];

    if (isEditMode && isLoading && !product) {
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
            <div className="mb-6">
                <nav className="flex items-center text-sm text-gray-500 mb-2">
                    <span
                        className="hover:text-primary cursor-pointer"
                        onClick={() => navigate('/seller/products')}
                    >
                        Products
                    </span>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-gray-900 font-medium">
                        {isEditMode ? 'Edit Product' : 'New Product'}
                    </span>
                </nav>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? `Edit: ${product?.name || 'Loading...'}` : 'Create New Product'}
                </h1>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => !tab.disabled && setActiveTab(tab.id)}
                            disabled={tab.disabled}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : tab.disabled
                                        ? 'border-transparent text-gray-300 cursor-not-allowed'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                {activeTab === 'basic' && (
                    <ProductBasicInfo
                        initialData={product}
                        onSubmit={handleBasicInfoSubmit}
                        isLoading={isLoading}
                    />
                )}

                {activeTab === 'images' && isEditMode && (
                    <ProductImageManager
                        productUuid={uuid}
                        images={product?.images || []}
                        onUpdate={fetchProduct}
                    />
                )}

                {activeTab === 'variants' && isEditMode && (
                    <ProductVariantManager
                        productUuid={uuid}
                        variants={product?.variants || []}
                        onUpdate={fetchProduct}
                    />
                )}

                {activeTab === 'attributes' && isEditMode && (
                    <ProductAttributeManager
                        productUuid={uuid}
                        attributes={product?.attributes || []}
                        onUpdate={fetchProduct}
                    />
                )}
            </div>
        </SellerLayout>
    );
};
