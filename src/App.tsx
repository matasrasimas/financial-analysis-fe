import './index.css'
import Navbar from "./Navbar";
import {matchPath, Route, Routes, useLocation} from "react-router-dom";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Export from "./pages/Export";
import AutomaticTransactions from "./pages/AutomaticTransactions";
import ImageTransactions from "./pages/ImageTransactions";
import Organization from "./pages/Organization";
import NotFound from "./pages/NotFound";
import OrgUnitEdit from "./pages/Organization/OrgUnitEdit";
import OrgUnitCreate from "./pages/Organization/OrgUnitCreate";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute.tsx";
import {AuthProvider} from "./auth/AuthContext.tsx";
import UnprotectedRoute from "./auth/UnprotectedRoute.tsx";
import OrganizationCreate from "./pages/OrganizationCreate";

const App = () => {
    const location = useLocation();

    const validRoutes = [
        "/",
        "/transactions",
        "/organization",
        "/profile",
        "/export",
        "/automatic-transactions",
        "/image-transactions",
        "/org-units/:id",
        "/org-unit-create"
    ];

    const isNavbarVisible = validRoutes.some((route) => matchPath(route, location.pathname))

    return (
        <AuthProvider>
            {/*{isNavbarVisible && <Navbar />}*/}
            <Routes>
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
                <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                <Route path="/organization" element={<ProtectedRoute><Organization /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/export" element={<ProtectedRoute><Export /></ProtectedRoute>} />
                <Route path="/automatic-transactions" element={<ProtectedRoute><AutomaticTransactions /></ProtectedRoute>} />
                <Route path="/image-transactions" element={<ProtectedRoute><ImageTransactions /></ProtectedRoute>} />
                <Route path="/org-units/:id" element={<ProtectedRoute><OrgUnitEdit /></ProtectedRoute>} />
                <Route path="/org-unit-create" element={<ProtectedRoute><OrgUnitCreate /></ProtectedRoute>} />
                <Route path="/organization-create" element={<OrganizationCreate />} />

                {/* Public Routes */}
                <Route path="/login" element={<UnprotectedRoute><Login /></UnprotectedRoute>} />
                <Route path="/register" element={<UnprotectedRoute><Register /></UnprotectedRoute>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;