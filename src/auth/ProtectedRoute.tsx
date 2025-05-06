import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "../Navbar";
import Header from "../Header";
import Navbar1 from "../Navbar1";

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
        <div className='flex flex-col w-screen min-h-screen bg-gray-100'>
            <Header />
            <div className='flex flex-row w-screen h-full'>
                <Navbar1/>
                <div className='flex w-full h-full ml-[250px] justify-center'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ProtectedRoute;