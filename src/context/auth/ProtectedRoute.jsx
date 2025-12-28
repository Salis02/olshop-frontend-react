import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loading } from "../../components/common/Loading";

export const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return <Loading fullScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        // Check for role or role_name property
        const userRole = user?.role || user?.role_name;

        if (!userRole || !allowedRoles.includes(userRole)) {
            // Redirect to home or unauthorized page
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
}