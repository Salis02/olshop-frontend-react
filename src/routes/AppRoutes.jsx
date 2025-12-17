import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../context/auth/ProtectedRoute';
import { PublicRoutes } from '../context/auth/PublicRoutes';

// Auth pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// ProtectedRoute component
import { HomePage } from '../pages/home/HomePage';
import { NotFoundPage } from '../pages/error/NotFoundPage';
import { ProductListPage } from '../pages/products/ProductListPage';
import { ProductDetailPage } from '../pages/products/ProductDetailPage';
import { CategoriesPage } from '../pages/categories/CategoriesPage';

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
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>

                </Route>

                {/* 404 - Handle route with no handle */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}