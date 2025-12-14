import { ReviewCard } from './ReviewCard';
import { Star } from 'lucide-react';

export const ReviewList = ({ reviews, isLoading }) => {
    if (isLoading) {
        return (
            <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full" />
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-1/6" />
                            </div>
                        </div>
                        <div className="h-16 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">No reviews yet</p>
                <p className="text-gray-400 text-sm mt-1">
                    Be the first to review this product!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    );
};