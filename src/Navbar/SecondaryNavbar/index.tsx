import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faCaretDown, faCaretUp, faEnvelope, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import {OrgUnit} from "../../types.ts";
import Cookies from "js-cookie";
import {useAuth} from "../../auth/AuthContext.tsx";


const SecondaryNavbar = () => {
    const {organization, orgUnit} = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    useEffect(() => {
        const fetchOrgUnits = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/organizations/${organization.id}/org-units`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrgUnits(data);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchOrgUnits();
    }, [organization.id]);

    const switchActiveOrgUnit = (orgUnitId: string) => {
        Cookies.set("active-org-unit", orgUnitId);
        window.location.href = '/'
    }

    return (
        <nav className="flex items-center flex-row bg-[#00776b] w-full h-[38px]">
            <div className="flex flex-col items-center justify-center border-r-[3px] border-r-[#00473b] w-[360px] h-full relative">
                <div
                    className="flex cursor-pointer hover:font-extrabold items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <h2 className="text-white text-[18px] font-(family-name:--roboto-font) mx-2">{orgUnit.title}</h2>
                    <div>
                        <FontAwesomeIcon icon={isDropdownOpen ? faCaretUp : faCaretDown} className="text-white md:text-[30px] text-[25px]"/>
                    </div>
                </div>
                {isDropdownOpen && (
                    <div className="flex flex-col bg-gray-300 w-full absolute top-10 border-black border-[3px]">
                        {orgUnits.map((unit) => {
                            return <div
                                key={unit.id}
                                className="flex items-center px-5 border-b-black border-b-[3px] py-1 justify-center hover:font-bold hover:cursor-pointer"
                                onClick={() => switchActiveOrgUnit(unit.id)}
                            >
                                <h3 className="text-black text-[18px] font-(family-name:--roboto-font)">{unit.title}</h3>
                            </div>
                        })}
                    </div>
                )}
            </div>
            <div className="md:hidden flex w-full ml-8 relative h-full">
                <button onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faBars} className="text-white text-[20px] cursor-pointer"/>
                </button>
                {isMenuOpen && (
                    <ul className="md:hidden flex flex-col border-black border-[3px] rounded-lg bg-gray-300 absolute top-10 w-[150px]">
                        <Link onClick={() => setIsMenuOpen(!isMenuOpen)} to="/" className="flex items-center px-5 border-b-black border-b-[3px] py-1 justify-center hover:font-bold">
                            <h3 className="text-black text-[18px] font-(family-name:--roboto-font)">Pagrindinis</h3>
                        </Link>
                        <Link onClick={() => setIsMenuOpen(!isMenuOpen)} to="/transactions" className="flex items-center px-5 border-b-black border-b-[3px] py-1 justify-center hover:font-bold">
                            <h3 className="text-black text-[18px] font-(family-name:--roboto-font)">Transakcijos</h3>
                        </Link>
                        <Link onClick={() => setIsMenuOpen(!isMenuOpen)} to="/export" className="flex items-center px-5 py-1 justify-center hover:font-bold">
                            <h3 className="text-black text-[18px] font-(family-name:--roboto-font)">Eksportas</h3>
                        </Link>
                    </ul>
                )}

            </div>
            <ul className="md:flex hidden flex-col md:flex-row w-full h-full">
                <NavLink
                    to="/"
                    className={({ isActive }) => `flex items-center flex-row px-5 hover:bg-(--navbar-item-on-hover-bg) ${isActive && 'bg-(--navbar-item-on-hover-bg)'}`}>
                    <h3 className="text-white text-[18px] font-(family-name:--roboto-font)">Pagrindinis</h3>
                </NavLink>
                <NavLink
                    to="/transactions"
                    className={({ isActive }) => `flex items-center flex-row px-5 hover:bg-(--navbar-item-on-hover-bg) ${isActive && 'bg-(--navbar-item-on-hover-bg)'}`}>
                    <h3 className="text-white text-[18px] font-(family-name:--roboto-font)">Transakcijos</h3>
                </NavLink>
                <NavLink
                    to="/export"
                    className={({ isActive }) => `flex items-center flex-row px-5 hover:bg-(--navbar-item-on-hover-bg) ${isActive && 'bg-(--navbar-item-on-hover-bg)'}`}>
                    <h3 className="text-white text-[18px] font-(family-name:--roboto-font)">Eksportas</h3>
                </NavLink>
            </ul>
        </nav>
    );
}

export default SecondaryNavbar;