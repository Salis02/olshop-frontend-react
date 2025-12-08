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

                {/* Logo */}
                <Link to='/' className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-primary">
                        SANS ECOMMERCE
                    </div>
                </Link>

                {/* Search Bar - Hidden on mobile */}
                
            </div>
        </nav>
    )
}