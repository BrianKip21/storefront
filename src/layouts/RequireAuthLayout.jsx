import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import LoadingSpinner from "../components/LoadingSpinner";

export default function RequireAuthLayout() {
    const user = useAuthStore((s) => s.user);
    const loading = useAuthStore((s) => s.loading);
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return <Outlet />;
}
