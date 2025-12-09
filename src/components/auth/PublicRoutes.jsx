import { Navigate, Outlet } from "react-router-dom";
import { Loading } from "../common/Loading";
import { useAuth } from "../../hooks/useAuth";

const PublicRoutes = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return (<Loading fullScreen />);

    if (isAuthenticated) return <Navigate to="/" replace />;

    return <Outlet />;
};

export { PublicRoutes };