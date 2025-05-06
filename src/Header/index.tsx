import {useAuth} from "../auth/AuthContext.tsx";
import './styles.css'

const Header = () => {
    const { organization } = useAuth();

    return (
        <div className="z-10 flex flex-row bg-[#00473b] w-full h-[38px] items-center pl-10 sticky top-0 border-[#00372b] border-b-[1px]">
            <h2 className='header-text cursor-pointer'>{organization.title}</h2>
        </div>
    );
}

export default Header;