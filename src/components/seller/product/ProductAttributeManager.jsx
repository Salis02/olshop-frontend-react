import { useState } from 'react';
import { productAttributeApi } from '../../../api';
import { showToast, showConfirm } from '../../../utils/toast';
import { Plus, Trash2, Edit2, Save } from 'lucide-react';

export const ProductAttributeManager = ({ productUuid, attributes, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        key: '',
        value: ''
    });

    const resetForm = () => {
        setFormData({ key: '', value: '' });
        setIsEditing(null);
        setIsCreating(false);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await productAttributeApi.update(productUuid, isEditing, formData);
                showToast.success('Attribute updated');
            } else {
                await productAttributeApi.create(productUuid, formData);
                showToast.success('Attribute created');
            }
            onUpdate();
            resetForm();
        } catch (error) {
            console.error(error);
            showToast.error(error.message || 'Failed to save attribute');
        }
    };

    const handleEdit = (attr) => {
        setFormData({
            key: attr.key,
            value: attr.value
        });
        setIsEditing(attr.id);
        setIsCreating(false);
    };

    const handleDelete = (id) => {
        showConfirm('Delete this attribute?', async () => {
            try {
                await productAttributeApi.remove(productUuid, id);
                showToast.success('Attribute deleted');
                onUpdate();
            } catch (error) {
                showToast.error('Failed to delete attribute');
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Product Attributes</h3>
                {!isCreating && !isEditing && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Attribute
                    </button>
                )}
            </div>

            {/* Form */}
            {(isCreating || isEditing) && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">{isEditing ? 'Edit Attribute' : 'New Attribute'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Attribute Name (e.g., Material)</label>
                            <input
                                type="text"
                                value={formData.key}
                                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Value (e.g., Cotton)</label>
                            <input
                                type="text"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
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
            {attributes && attributes.length > 0 ? (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attribute</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {attributes.map((attr) => (
                                <tr key={attr.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attr.key}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attr.value}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(attr)} className="text-blue-600 hover:text-blue-900 mr-4">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(attr.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 py-4">No attributes added.</p>
            )}
        </div>
    );
};
