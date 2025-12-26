export const EmptyState = ({
    icon,
    title,
    description,
    action,
    actionLabel
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {icon && (
                <div className="mb-4 text-gray-400">
                    {icon}
                </div>
            )}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-gray-600 mb-6 max-w-md">
                    {description}
                </p>
            )}
            {action && actionLabel && (
                <button
                    onClick={action}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

// Preset empty states for common scenarios
export const EmptyCart = ({ onStartShopping }) => (
    <EmptyState
        icon={
            <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        }
        title="Your cart is empty"
        description="Looks like you haven't added any items to your cart yet. Start shopping to fill it up!"
        action={onStartShopping}
        actionLabel="Start Shopping"
    />
);

export const EmptyWishlist = ({ onBrowseProducts }) => (
    <EmptyState
        icon={
            <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        }
        title="Your wishlist is empty"
        description="Save items you love to your wishlist and keep track of them easily."
        action={onBrowseProducts}
        actionLabel="Browse Products"
    />
);

export const EmptySearchResults = ({ searchTerm, onClearSearch }) => (
    <EmptyState
        icon={
            <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        }
        title="No results found"
        description={searchTerm ? `We couldn't find any products matching "${searchTerm}". Try different keywords.` : "No products found matching your criteria."}
        action={onClearSearch}
        actionLabel="Clear Search"
    />
);

export const EmptyOrders = () => (
    <EmptyState
        icon={
            <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        }
        title="No orders yet"
        description="You haven't placed any orders yet. Start shopping and your orders will appear here."
    />
);
