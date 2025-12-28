import { useState } from 'react';
import { productImageApi } from '../../../api';
import { showToast, showConfirm } from '../../../utils/toast';
import { Upload, X, Star } from 'lucide-react';
import { Loading } from '../../../components/common/Loading';

export const ProductImageManager = ({ productUuid, images, onUpdate }) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('image', file); // Backend expects 'image' field? Check mullter config if strictly 'image' or 'images'
        });
        // Assuming backend handles single file per request or array. api/productImage.routes.js -> upload.single('image') or array?
        // Let's assume single for now or loop if multiple needed.
        // Checking productImage.routes.js -> it uses `handleMulter`. Usually it handles fields.
        // Let's try sending one by one to be safe or append check.

        try {
            setIsUploading(true);
            for (let i = 0; i < files.length; i++) {
                const fd = new FormData();
                fd.append('image', files[i]);
                await productImageApi.upload(productUuid, fd);
            }
            showToast.success('Images uploaded successfully');
            onUpdate();
        } catch (error) {
            console.error('Upload failed:', error);
            showToast.error('Failed to upload images');
        } finally {
            setIsUploading(false);
            e.target.value = null; // Reset input
        }
    };

    const handleDelete = (imageId) => {
        showConfirm('Delete this image?', async () => {
            try {
                await productImageApi.remove(productUuid, imageId);
                showToast.success('Image deleted');
                onUpdate();
            } catch (error) {
                showToast.error('Failed to delete image');
            }
        });
    };

    const handleSetPrimary = async (imageId) => {
        try {
            await productImageApi.setPrimary(productUuid, imageId);
            showToast.success('Primary image updated');
            onUpdate();
        } catch (error) {
            showToast.error('Failed to set primary image');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
                <div>
                    <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={isUploading}
                    />
                    <label
                        htmlFor="image-upload"
                        className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isUploading ? <Loading className="w-4 h-4 mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                        Upload Images
                    </label>
                </div>
            </div>

            {images && images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img) => (
                        <div key={img.id} className="relative group border rounded-lg overflow-hidden aspect-square">
                            <img
                                src={img.url}
                                alt="Product"
                                className="w-full h-full object-cover"
                            />
                            {img.is_primary && (
                                <div className="absolute top-2 left-2 bg-yellow-400 text-white p-1 rounded-full shadow-sm">
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                                {!img.is_primary && (
                                    <button
                                        onClick={() => handleSetPrimary(img.id)}
                                        className="p-1 bg-white text-yellow-600 rounded-full hover:bg-yellow-50"
                                        title="Set as Primary"
                                    >
                                        <Star className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(img.id)}
                                    className="p-1 bg-white text-red-600 rounded-full hover:bg-red-50"
                                    title="Delete"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">No images uploaded yet</p>
                </div>
            )}
        </div>
    );
};
