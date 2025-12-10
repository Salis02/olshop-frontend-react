import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loading } from "../../components/common/Loading";

const PublicRoutes = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return (<Loading fullScreen />);

    if (isAuthenticated) return <Navigate to="/" replace />;

    return <Outlet />;
};

export { PublicRoutes };