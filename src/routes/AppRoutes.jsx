import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// Auth pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// ProtectedRoute component
import { HomePage } from '../pages/home/HomePage';
import { NotFoundPage } from '../pages/error/NotFoundPage';
import { PublicRoutes } from '../components/auth/PublicRoutes';
import { ProductListPage } from '../pages/products/ProductListPage';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicRoutes />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductListPage />} />
                </Route>

                {/* 404 - Handle route with no handle */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}