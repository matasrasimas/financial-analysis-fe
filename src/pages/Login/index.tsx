import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faLock} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

const Login = () => {
    return (
        <div className='flex flex-row justify-center bg-[#00b795] w-full h-screen items-center'>
            <div className='flex flex-col w-[500px] h-[450px] bg-white'>

                <div className='flex w-full h-[50px] bg-[#00574b] items-center justify-center'>
                    <h2 className='text-white font-bold font-sans text-[20px]'>Prisijungimas</h2>
                </div>

                <div className='flex flex-col gap-8 my-10'>
                    <div className='flex flex-row w-full h-[55px] px-8'>
                        <div className='bg-[#00574b] w-[55px] h-full flex justify-center items-center'>
                            <FontAwesomeIcon icon={faEnvelope} className='text-white text-[25px]' />
                        </div>
                        <input
                            type='email'
                            className='w-full h-full border-gray-500 border-2 pl-5 text-[20px]'
                            placeholder='El. paštas'
                        />
                    </div>
                    <div className='flex flex-row w-full h-[55px] px-8'>
                        <div className='bg-[#00574b] w-[55px] h-full flex justify-center items-center'>
                            <FontAwesomeIcon icon={faLock} className='text-white text-[25px]' />
                        </div>
                        <input
                            type='password'
                            className='w-full h-full border-gray-500 border-2 pl-5 text-[20px]'
                            placeholder='Slaptažodis'
                        />
                    </div>
                </div>

                <div className='flex flex justify-center items-center w-full mb-10'>
                    <button className='bg-[#00574b] w-[200px] h-[50px] text-white font-bold text-[20px] rounded-md cursor-pointer hover:text-yellow-500'>
                        Prisijungti
                    </button>
                </div>

                <div className='flex flex-row w-full px-5 text-[20px] gap-2 items-center justify-center'>
                    <h2 className='break-words whitespace-normal'>Neturite paskyros?
                    </h2>
                    <Link
                        to='/register'
                        className='text-[#00574b] font-bold underline hover:text-[#00877b]'
                    >
                        Susikurti dabar
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Login;

