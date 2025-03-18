import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faChartSimple, faEnvelope, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {Link, NavLink} from "react-router-dom";

const PrimaryNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <nav className="flex items-center flex-row bg-[#00473b] w-full h-[48px] relative">
            <div
                className="flex items-center justify-center flex-row border-r-[3px] border-r-[#00373b] w-[360px] h-full gap-5">
                <div className="lg:block hidden">
                    <FontAwesomeIcon icon={faChartSimple} className="text-white text-[30px]"/>
                </div>
                <h2 className="text-white md:text-[20px] text-[15px] font-bold  font-(family-name:--roboto-font) mx-2">Finansai</h2>
            </div>
            <div className="md:hidden flex w-full ml-8 relative h-full">
                <button onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faBars} className="text-white text-[25px] cursor-pointer"/>
                </button>
                {isMenuOpen && (
                    <ul className="md:hidden flex flex-col border-black border-[3px] rounded-lg bg-gray-300 absolute top-10 z-[5] w-[150px]">
                        <Link
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            to="/profile"
                            className="flex items-center px-5 border-b-black border-b-[3px] py-1 justify-center hover:font-bold">
                            <h3 className="text-black text-[18px] font-(family-name:--roboto-font)">Vardenis Pavardenis</h3>
                        </Link>
                        <Link
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            to="/organization"
                            className="flex items-center px-5 border-b-black border-b-[3px] py-1 justify-center hover:font-bold">
                            <h3 className="text-black text-[18px] font-(family-name:--roboto-font)">Organizacija</h3>
                        </Link>
                        <li
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center px-5 py-1 justify-center hover:font-bold cursor-pointer">
                            <h3 className="text-black text-[18px] font-(family-name:--roboto-font)">Atsijungti</h3>
                        </li>
                    </ul>
                )}

            </div>
            <ul className="md:flex hidden flex-col md:flex-row w-full h-full">

                <NavLink
                    to="/profile"
                    className={({ isActive }) => `flex items-center flex-row gap-2 px-5 hover:bg-(--navbar-item-on-hover-bg) ${isActive && 'bg-(--navbar-item-on-hover-bg)'}`}>
                    <div className="lg:block hidden">
                        <FontAwesomeIcon icon={faUserCircle} className="text-white text-[25px]"/>
                    </div>
                    <h3 className="text-white text-[18px] font-(family-name:--roboto-font)">Vardenis Pavardenis</h3>
                </NavLink>

                <NavLink
                    to="/organization"
                    className={({ isActive }) => `flex items-center px-5 hover:bg-(--navbar-item-on-hover-bg) ${isActive && 'bg-(--navbar-item-on-hover-bg)'}`}>
                    <h3 className="text-white text-[18px] font-(family-name:--roboto-font)">Organizacija</h3>
                </NavLink>
                <li className="flex items-center px-5 hover:bg-(--navbar-item-on-hover-bg) cursor-pointer">
                    <h3 className="text-white text-[18px] font-(family-name:--roboto-font)">Atsijungti</h3>
                </li>
            </ul>
            <Link to='/emails' className="absolute right-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-white text-[28px] hover:text-[32px]"/>
            </Link>
        </nav>
    );
}

export default PrimaryNavbar;