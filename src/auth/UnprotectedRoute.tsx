import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const UnprotectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return children;
};

export default UnprotectedRoute;