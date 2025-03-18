import '../../App.css'
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

const NotFound = () => {
    return (
        <div className='flex min-h-[80vh] items-center justify-center'>
            <div className='flex flex-col items-center justify-center'>
                <h2 className='main-header text-[4em]'>page not found</h2>
                <Link
                    to='/'
                    className='flex flex-row gap-3 font-bold text-[35px] underline underline-offset-2 self-start hover:text-blue-500 w-full justify-center items-center'>
                    <div className='block'>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <h2>Go back</h2>
                </Link>
            </div>
        </div>
    );
}

export default NotFound;