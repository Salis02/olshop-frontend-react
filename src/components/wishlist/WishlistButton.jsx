import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';

export const WishlistButton = ({ productId, className = '', size = 'md' }) => {
    const { isAuthenticated } = useAuth();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const inWishlist = isInWishlist(productId);

    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if authenticated
        if (!isAuthenticated) {
            showToast.error('Please login to add to wishlist');
            navigate('/login');
            return;
        }

        setIsLoading(true);
        const result = await toggleWishlist(productId);

        if (result.success) {
            if (inWishlist) {
                showToast.success('Removed from wishlist');
            } else {
                showToast.success('Added to wishlist');
            }
        } else {
            showToast.error(result.message);
        }

        setIsLoading(false);
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`
                transition-all duration-200
                ${inWishlist
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-red-500'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
            `}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart
                className={`${sizes[size]} ${inWishlist ? 'fill-current' : ''}`}
            />
        </button>
    );
};