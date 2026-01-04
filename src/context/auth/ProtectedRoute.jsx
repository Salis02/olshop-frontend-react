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
        // Check for role or role_name property (handle both formats)
        const userRole = user?.role?.name || user?.role_name || user?.role;

        console.log('ProtectedRoute - User:', user);
        console.log('ProtectedRoute - Detected Role:', userRole);
        console.log('ProtectedRoute - Allowed Roles:', allowedRoles);

        if (!userRole || !allowedRoles.includes(userRole)) {
            // Redirect to home or unauthorized page
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
}