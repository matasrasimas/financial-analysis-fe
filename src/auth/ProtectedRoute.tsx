import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "../Navbar";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, organization, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if(!organization) {
        return <Navigate to="/organization-create" />;
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    );
};

export default ProtectedRoute;