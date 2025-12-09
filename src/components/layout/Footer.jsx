import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">🛍️ ShopName</h3>
                        <p className="text-sm mb-4">
                            Your trusted online shopping destination for quality products at great prices.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-white transition">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-white transition">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-white transition">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/about" className="hover:text-white transition">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="hover:text-white transition">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/categories" className="hover:text-white transition">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-white transition">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/help" className="hover:text-white transition">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="hover:text-white transition">
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className="hover:text-white transition">
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-white transition">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-white transition">
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span>123 Shopping Street, Jakarta, Indonesia</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 flex-shrink-0" />
                                <span>+62 812-3456-7890</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 flex-shrink-0" />
                                <span>support@shopname.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
                    <p>&copy; {new Date().getFullYear()} ShopName. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}