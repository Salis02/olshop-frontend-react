import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../context/auth/ProtectedRoute';
import { PublicRoutes } from '../context/auth/PublicRoutes';

// Auth pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';

// ProtectedRoute component
import { HomePage } from '../pages/home/HomePage';
import { NotFoundPage } from '../pages/error/NotFoundPage';
import { ProductListPage } from '../pages/products/ProductListPage';
import { ProductDetailPage } from '../pages/products/ProductDetailPage';
import { CategoriesPage } from '../pages/categories/CategoriesPage';
import { CartPage } from '../pages/cart/CartPage';
import { WishlistPage } from '../pages/wishlist/WishlistPage';
import { ProfilePage } from '../pages/user/ProfilePage';
import { OrderHistoryPage } from '../pages/order/OrderHistoryPage';
import { OrderDetailPage } from '../pages/order/OrderDetailPage';
import { CheckoutPage } from '../pages/checkout/CheckoutPage';

// Seller pages
import { SellerDashboardPage } from '../pages/seller/SellerDashboardPage';
import { SellerProductListPage } from '../pages/seller/products/SellerProductListPage';
import { SellerProductFormPage } from '../pages/seller/products/SellerProductFormPage';
import { SellerShipmentListPage } from '../pages/seller/shipments/SellerShipmentListPage';

// Admin pages
import { AdminCouponListPage } from '../pages/admin/coupons/AdminCouponListPage';
import { AdminEventListPage } from '../pages/admin/events/AdminEventListPage';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/products/:uuid" element={<ProductDetailPage />} />

                {/* Public Routes */}
                <Route element={<PublicRoutes />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/orders" element={<OrderHistoryPage />} />
                    <Route path="/orders/:uuid" element={<OrderDetailPage />} />
                </Route>

                {/* Seller Routes */}
                <Route element={<ProtectedRoute allowedRoles={['SELLER', 'ADMIN']} />}>
                    <Route path="/seller" element={<SellerDashboardPage />} />
                    <Route path="/seller/products" element={<SellerProductListPage />} />
                    <Route path="/seller/products/new" element={<SellerProductFormPage />} />
                    <Route path="/seller/products/edit/:uuid" element={<SellerProductFormPage />} />
                    <Route path="/seller/shipments" element={<SellerShipmentListPage />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route path="/admin/coupons" element={<AdminCouponListPage />} />
                    <Route path="/admin/events" element={<AdminEventListPage />} />
                </Route>

                {/* 404 - Handle route with no handle */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}