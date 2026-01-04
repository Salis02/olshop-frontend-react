import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ShoppingCart, User, Menu, X, Search, Heart } from 'lucide-react';
import { useCart } from "../../hooks/useCart";
import { showConfirm, showToast } from "../../utils/toast";
import { useWishlist } from '../../hooks/useWishlist'

export const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart()
    const { wishlistCount } = useWishlist();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const handleLogout = async () => {
        showConfirm('Are you sure want to logout?', async () => {
            await logout();
            showToast.success('Logged out successfully')
            navigate('/login');
        })
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    const userRole = user?.role?.name || user?.role_name || user?.role;
    const isSellerOrAdmin = userRole === 'SELLER' || userRole === 'ADMIN';
    const isAdmin = userRole === 'ADMIN';

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="text-2xl font-bold text-primary">
                            🛍️ SANSHOP
                        </div>
                    </Link>

                    {/* Search Bar - Hidden on mobile */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/products" className="text-gray-700 hover:text-primary transition">
                            Products
                        </Link>
                        <Link to="/categories" className="text-gray-700 hover:text-primary transition">
                            Categories
                        </Link>

                        {isSellerOrAdmin && (
                            <Link to="/seller" className="text-gray-700 hover:text-primary transition font-medium">
                                Seller Panel
                            </Link>
                        )}

                        {isAdmin && (
                            <Link to="/admin/coupons" className="text-gray-700 hover:text-primary transition font-medium">
                                Admin Panel
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <>
                                {/* Wishlist */}
                                <Link to="/wishlist" className="relative text-gray-700 hover:text-primary transition">
                                    <Heart className="w-6 h-6" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Cart */}
                                <Link to="/cart" className="relative text-gray-700 hover:text-primary transition">
                                    <ShoppingCart className="w-6 h-6" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-primary transition"
                                    >
                                        <User className="w-6 h-6" />
                                        <span className="text-sm font-medium">{user?.name}</span>
                                    </button>

                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                            {isSellerOrAdmin && (
                                                <Link
                                                    to="/seller"
                                                    className="block px-4 py-2 text-sm text-primary font-medium hover:bg-gray-100"
                                                    onClick={() => setIsProfileDropdownOpen(false)}
                                                >
                                                    Seller Dashboard
                                                </Link>
                                            )}
                                            {(user?.role === 'ADMIN' || user?.role_name === 'ADMIN') && (
                                                <>
                                                    <Link
                                                        to="/admin/coupons"
                                                        className="block px-4 py-2 text-sm text-purple-600 font-medium hover:bg-gray-100"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                    >
                                                        Manage Coupons
                                                    </Link>
                                                    <Link
                                                        to="/admin/events"
                                                        className="block px-4 py-2 text-sm text-purple-600 font-medium hover:bg-gray-100"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                    >
                                                        Manage Events
                                                    </Link>
                                                    <hr className="my-2" />
                                                </>
                                            )}
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                My Orders
                                            </Link>
                                            <Link
                                                to="/addresses"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                Addresses
                                            </Link>
                                            <hr className="my-2" />
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-primary transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden text-gray-700 hover:text-primary"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden pb-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-3 space-y-3">
                        <Link
                            to="/products"
                            className="block text-gray-700 hover:text-primary transition"
                            onClick={toggleMobileMenu}
                        >
                            Products
                        </Link>
                        <Link
                            to="/categories"
                            className="block text-gray-700 hover:text-primary transition"
                            onClick={toggleMobileMenu}
                        >
                            Categories
                        </Link>

                        {isSellerOrAdmin && (
                            <Link
                                to="/seller"
                                className="block text-primary font-medium hover:text-blue-700 transition"
                                onClick={toggleMobileMenu}
                            >
                                Seller Dashboard
                            </Link>
                        )}

                        {(user?.role === 'ADMIN' || user?.role_name === 'ADMIN') && (
                            <>
                                <Link
                                    to="/admin/coupons"
                                    className="block text-purple-600 font-medium hover:text-purple-700 transition"
                                    onClick={toggleMobileMenu}
                                >
                                    Manage Coupons
                                </Link>
                                <Link
                                    to="/admin/events"
                                    className="block text-purple-600 font-medium hover:text-purple-700 transition"
                                    onClick={toggleMobileMenu}
                                >
                                    Manage Events
                                </Link>
                            </>
                        )}

                        {isAuthenticated ? (
                            <>
                                {/* Wishlist */}
                                <Link to="/wishlist" className="relative text-gray-700 hover:text-primary transition flex items-center space-x-2">
                                    <Heart className="w-6 h-6" />
                                    <span>Wishlist ({wishlistCount})</span>
                                </Link>

                                <Link
                                    to="/cart"
                                    className="block text-gray-700 hover:text-primary transition flex items-center space-x-2"
                                    onClick={toggleMobileMenu}
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                    <span>Cart ({cartCount})</span>
                                </Link>
                                <Link
                                    to="/profile"
                                    className="block text-gray-700 hover:text-primary transition"
                                    onClick={toggleMobileMenu}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/orders"
                                    className="block text-gray-700 hover:text-primary transition"
                                    onClick={toggleMobileMenu}
                                >
                                    My Orders
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        toggleMobileMenu();
                                    }}
                                    className="block w-full text-left text-red-600 hover:text-red-700 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block text-gray-700 hover:text-primary transition"
                                    onClick={toggleMobileMenu}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block bg-primary text-white px-4 py-2 rounded-lg text-center hover:bg-blue-600 transition"
                                    onClick={toggleMobileMenu}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}