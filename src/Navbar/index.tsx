import PrimaryNavbar from "./PrimaryNavbar";
import SecondaryNavbar from "./SecondaryNavbar";

const Navbar = () => {
    return (
        <div className="flex flex-col w-full">
            <PrimaryNavbar />
            <SecondaryNavbar />
        </div>
    );
}

export default Navbar;