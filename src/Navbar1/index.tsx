import {useAuth} from "../auth/AuthContext.tsx";
import {Link, NavLink, useNavigate} from "react-router-dom";
import {useState} from "react";
import Cookies from "js-cookie";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBars, faChartLine,
    faChartSimple,
    faCircleUser, faEnvelope, faFileExcel,
    faHouse,
    faMoneyBillTransfer, faPowerOff, faRobot,
    faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import './styles.css'

const Navbar1 = () => {
    const {user, setIsAuthenticated, setUser, setOrganization, setOrgUnit} = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const handleLogout = () => {
        Cookies.remove("jwt");
        Cookies.remove("active-org-unit");
        setIsAuthenticated(false);
        setUser(null);
        setOrganization(null);
        setOrgUnit(null);
        navigate('/login');
    };

    return (
        <nav className="main-navbar">

            <NavLink
                to="/profile"
                className={({isActive}) => `navbar-item flex w-full max-w-full items-center h-[50px] ${isActive ? 'bg-[#E2FFDD] text-[17px] font-bold text-[#0D5200]' : 'bg-white text-[16px] font-normal text-[#333333]'}`}>
                <FontAwesomeIcon icon={faCircleUser}/>
                <label className="whitespace-normal break-words ml-2">Profilis</label>
                <p>{import.meta.env.VITE_secret_message}</p>
            </NavLink>

            <NavLink
                to="/"
                className={({isActive}) => `navbar-item flex w-full max-w-full items-center h-[50px] ${isActive ? 'bg-[#E2FFDD] text-[17px] font-bold text-[#0D5200]' : 'bg-white text-[16px] font-normal text-[#333333]'}`}>
                <FontAwesomeIcon icon={faHouse}/>
                <label className="whitespace-normal break-words ml-2">Organizacijos</label>
            </NavLink>

            <NavLink
                to="/transactions"
                className={({isActive}) => `navbar-item flex w-full max-w-full items-center h-[50px] ${isActive ? 'bg-[#E2FFDD] text-[17px] font-bold text-[#0D5200]' : 'bg-white text-[16px] font-normal text-[#333333]'}`}>
                <FontAwesomeIcon icon={faMoneyBillTransfer}/>
                <label className="whitespace-normal break-words ml-2">Transakcijos</label>
            </NavLink>

            <NavLink
                to="/export"
                className={({isActive}) => `navbar-item flex w-full max-w-full items-center h-[50px] ${isActive ? 'bg-[#E2FFDD] text-[17px] font-bold text-[#0D5200]' : 'bg-white text-[16px] font-normal text-[#333333]'}`}>
                <FontAwesomeIcon icon={faFileExcel}/>
                <label className="whitespace-normal break-words ml-2">Eksportuoti</label>
            </NavLink>

            <NavLink
                to="/invitations"
                className={({isActive}) => `navbar-item flex w-full max-w-full items-center h-[50px] ${isActive ? 'bg-[#E2FFDD] text-[17px] font-bold text-[#0D5200]' : 'bg-white text-[16px] font-normal text-[#333333]'}`}>
                <FontAwesomeIcon icon={faEnvelope} />
                <label className="whitespace-normal break-words ml-2">Pakvietimai</label>
            </NavLink>

            <NavLink
                to="/dashboard"
                className={({isActive}) => `navbar-item flex w-full max-w-full items-center h-[50px] ${isActive ? 'bg-[#E2FFDD] text-[17px] font-bold text-[#0D5200]' : 'bg-white text-[16px] font-normal text-[#333333]'}`}>
                <FontAwesomeIcon icon={faChartLine}/>
                <label className="whitespace-normal break-words ml-2">Suvestinė</label>
            </NavLink>

            <NavLink
                to="/ai"
                className={({isActive}) => `navbar-item flex w-full max-w-full items-center h-[50px] ${isActive ? 'bg-[#E2FFDD] text-[17px] font-bold text-[#0D5200]' : 'bg-white text-[16px] font-normal text-[#333333]'}`}>
                <FontAwesomeIcon icon={faRobot}/>
                <label className="whitespace-normal break-words ml-2">AI asistentas</label>
            </NavLink>

            <div
                onClick={() => handleLogout()}
                className="logout-item flex w-full items-center bg-gray-300 h-[50px]">
                <FontAwesomeIcon icon={faPowerOff}/>
                <label className='cursor-pointer'>Atsijungti</label>
            </div>

            {/*<div*/}
            {/*    className="flex items-center justify-center flex-row border-r-[3px] border-r-[#00373b] w-[390px] h-full gap-5">*/}
            {/*    <div className="lg:block hidden">*/}
            {/*        <FontAwesomeIcon icon={faChartSimple} className="text-white text-[25px]"/>*/}
            {/*    </div>*/}
            {/*    <h2 className="text-white text-[20px] font-bold  font-(family-name:--roboto-font) mx-2">Finansai</h2>*/}
            {/*</div>*/}
            {/*<div className="md:hidden flex w-full ml-8 relative h-full">*/}
            {/*    <button onClick={toggleMenu}>*/}
            {/*        <FontAwesomeIcon icon={faBars} className="text-white text-[25px] cursor-pointer"/>*/}
            {/*    </button>*/}
            {/*    {isMenuOpen && (*/}
            {/*        <ul className="md:hidden flex flex-col border-black border-[3px] rounded-lg bg-gray-300 absolute top-10 z-[5] w-[150px]">*/}
            {/*            <Link*/}
            {/*                onClick={() => setIsMenuOpen(!isMenuOpen)}*/}
            {/*                to="/profile"*/}
            {/*                className="flex items-center px-5 border-b-black border-b-[3px] py-1 justify-center hover:font-bold">*/}
            {/*                {user && (*/}
            {/*                    <h3 className="text-white text-[16px] font-(family-name:--roboto-font)">*/}
            {/*                        {user.firstName} {user.lastName}*/}
            {/*                    </h3>*/}
            {/*                )}*/}
            {/*            </Link>*/}
            {/*            <Link*/}
            {/*                onClick={() => setIsMenuOpen(!isMenuOpen)}*/}
            {/*                to="/organization"*/}
            {/*                className="flex items-center px-5 border-b-black border-b-[3px] py-1 justify-center hover:font-bold">*/}
            {/*                <h3 className="text-black text-[18px] font-(family-name:--roboto-font)">Organizacija</h3>*/}
            {/*            </Link>*/}
            {/*            <li*/}
            {/*                onClick={handleLogout}*/}
            {/*                className="flex items-center px-5 py-1 justify-center hover:font-bold cursor-pointer">*/}
            {/*                <h3 className="text-black text-[18px] font-(family-name:--roboto-font)">Atsijungti</h3>*/}
            {/*            </li>*/}
            {/*        </ul>*/}
            {/*    )}*/}

            {/*</div>*/}
            {/*<ul className="md:flex hidden flex-col md:flex-row w-full h-full">*/}

            {/*    <NavLink*/}
            {/*        to="/profile"*/}
            {/*        className={({ isActive }) => `flex items-center flex-row gap-2 px-5 hover:bg-(--navbar-item-on-hover-bg) ${isActive && 'bg-(--navbar-item-on-hover-bg)'}`}>*/}
            {/*        <div className="lg:block hidden">*/}
            {/*            <FontAwesomeIcon icon={faUserCircle} className="text-white text-[20px]"/>*/}
            {/*        </div>*/}
            {/*        {user && (*/}
            {/*            <h3 className="text-white text-[18px] font-(family-name:--roboto-font)">*/}
            {/*                {user.firstName} {user.lastName}*/}
            {/*            </h3>*/}
            {/*        )}*/}
            {/*    </NavLink>*/}

            {/*    <NavLink*/}
            {/*        to="/organization"*/}
            {/*        className={({ isActive }) => `flex items-center px-5 hover:bg-(--navbar-item-on-hover-bg) ${isActive && 'bg-(--navbar-item-on-hover-bg)'}`}>*/}
            {/*        <h3 className="text-white text-[18px] font-(family-name:--roboto-font)">Organizacija</h3>*/}
            {/*    </NavLink>*/}
            {/*</ul>*/}
            {/*<li*/}
            {/*    className="flex items-center px-5 hover:bg-(--navbar-item-on-hover-bg) cursor-pointer h-[48px]"*/}
            {/*    onClick={handleLogout}*/}
            {/*>*/}
            {/*    <h3 className="text-white text-[18px] font-(family-name:--roboto-font)">Atsijungti</h3>*/}
            {/*</li>*/}
        </nav>
    );
}

export default Navbar1;