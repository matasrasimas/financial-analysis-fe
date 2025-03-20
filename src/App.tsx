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
        <>
            {isNavbarVisible && <Navbar/>}
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/transactions" element={<Transactions/>}/>
                <Route path="/organization" element={<Organization/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/export" element={<Export/>}/>
                <Route path="/automatic-transactions" element={<AutomaticTransactions/>}/>
                <Route path="/image-transactions" element={<ImageTransactions/>}/>
                <Route path="/org-units/:id" element={<OrgUnitEdit/>}/>
                <Route path="/org-unit-create" element={<OrgUnitCreate/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='*' element={<NotFound/>}/>
            </Routes>
        </>
    );
}

export default App;