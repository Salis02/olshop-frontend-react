import { useState } from 'react';
import { productVariantApi } from '../../../api';
import { showToast, showConfirm } from '../../../utils/toast';
import { Plus, Trash2, Edit2, X, Save } from 'lucide-react';

export const ProductVariantManager = ({ productUuid, variants, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(null); // ID of variant being edited
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price_adjustment: 0,
        stock_adjustment: 0
    });

    const resetForm = () => {
        setFormData({ name: '', price_adjustment: 0, stock_adjustment: 0 });
        setIsEditing(null);
        setIsCreating(false);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await productVariantApi.update(productUuid, isEditing, formData);
                showToast.success('Variant updated');
            } else {
                await productVariantApi.create(productUuid, formData);
                showToast.success('Variant created');
            }
            onUpdate();
            resetForm();
        } catch (error) {
            console.error(error);
            showToast.error(error.message || 'Failed to save variant');
        }
    };

    const handleEdit = (variant) => {
        setFormData({
            name: variant.name,
            price_adjustment: variant.price_adjustment || 0,
            stock_adjustment: variant.stock_adjustment || 0
        });
        setIsEditing(variant.id);
        setIsCreating(false);
    };

    const handleDelete = (id) => {
        showConfirm('Delete this variant?', async () => {
            try {
                await productVariantApi.remove(productUuid, id);
                showToast.success('Variant deleted');
                onUpdate();
            } catch (error) {
                showToast.error('Failed to delete variant');
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
                {!isCreating && !isEditing && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Variant
                    </button>
                )}
            </div>

            {/* Form */}
            {(isCreating || isEditing) && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">{isEditing ? 'Edit Variant' : 'New Variant'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Name (e.g., Red, XL)</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Price Adjustment (+/-)</label>
                            <input
                                type="number"
                                value={formData.price_adjustment}
                                onChange={(e) => setFormData({ ...formData, price_adjustment: parseFloat(e.target.value) })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Stock Adjustment (+/-)</label>
                            <input
                                type="number"
                                value={formData.stock_adjustment}
                                onChange={(e) => setFormData({ ...formData, stock_adjustment: parseInt(e.target.value) })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={resetForm}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </button>
                    </div>
                </div>
            )}

            {/* List */}
            {variants && variants.length > 0 ? (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Adj.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Adj.</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {variants.map((variant) => (
                                <tr key={variant.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{variant.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.price_adjustment || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.stock_adjustment || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(variant)} className="text-blue-600 hover:text-blue-900 mr-4">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(variant.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 py-4">No variants added.</p>
            )}
        </div>
    );
};
