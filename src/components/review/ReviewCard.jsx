import { Star } from 'lucide-react';

export const ReviewCard = ({ review }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    <div>
                        <div className="font-semibold text-gray-900">
                            {review.user?.name || 'Anonymous'}
                        </div>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                                <Star
                                    key={index}
                                    className={`w-4 h-4 ${index < review.rating
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <span className="text-sm text-gray-500">
                    {formatDate(review.created_at)}
                </span>
            </div>

            {review.comment && (
                <p className="text-gray-600 mt-3 leading-relaxed">
                    {review.comment}
                </p>
            )}
        </div>
    );
};