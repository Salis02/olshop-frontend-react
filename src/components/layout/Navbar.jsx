import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ShoppingCart, User, Menu, X, Search, Heart } from 'lucide-react';

export const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

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

                        {isAuthenticated ? (
                            <>
                                {/* Wishlist */}
                                <Link to="/wishlist" className="relative text-gray-700 hover:text-primary transition">
                                    <Heart className="w-6 h-6" />
                                </Link>

                                {/* Cart */}
                                <Link to="/cart" className="relative text-gray-700 hover:text-primary transition">
                                    <ShoppingCart className="w-6 h-6" />
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        0
                                    </span>
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

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/wishlist"
                                    className="block text-gray-700 hover:text-primary transition"
                                    onClick={toggleMobileMenu}
                                >
                                    Wishlist
                                </Link>
                                <Link
                                    to="/cart"
                                    className="block text-gray-700 hover:text-primary transition"
                                    onClick={toggleMobileMenu}
                                >
                                    Cart
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