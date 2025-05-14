import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faLock} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {UserLogin} from "../../types.ts";
import {useState} from "react";
import Cookies from "js-cookie";

const Login = () => {
    const [userLogin, setUserLogin] = useState<UserLogin>({
        email: '',
        password: ''
    });

    const [userLoginError, setUserLoginError] = useState<UserLogin>({
        email: '',
        password: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserLogin(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateFields = () => {
        const errors: UserLogin = {
            email: userLogin.email ? '' : 'Prašome įvesti šį lauką',
            password: userLogin.password ? '' : 'Prašome įvesti šį lauką',
        };
        setUserLoginError(errors);
        return Object.values(errors).every(error => error === '');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateFields()) {
            try {
                const response = await fetch("http://localhost:8080/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            email: userLogin.email,
                            password: userLogin.password,
                        }
                    )
                });
                if (response.status === 420) {
                    const data = await response.json();
                    setUserLoginError({email: '  ', password: data.message})
                }
                else if (response.status === 200) {
                    const data = await response.json();
                    Cookies.set("jwt", data.token);
                    Cookies.set("active-org", data.activeOrg);
                    window.location.href = '/';
                }

            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };

    return (
        <div className='flex flex-row justify-center bg-[#00b795] w-full h-screen items-center'>
            <div className='flex flex-col w-[500px] h-[350px] bg-white'>

                <div className='flex w-full h-[35px] bg-[#00574b] items-center justify-center'>
                    <h2 className='text-white font-bold font-sans text-[16px]'>Prisijungimas</h2>
                </div>

                <form id="login-form" className='flex flex-col gap-3 mt-10' onSubmit={handleSubmit}>
                    <div className='flex flex-col w-full h-[70px]'>
                        <div className='flex flex-row w-full h-[40px] px-8'>
                            <div className='bg-[#00574b] w-[40px] h-full flex justify-center items-center'>
                                <FontAwesomeIcon icon={faEnvelope} className='text-white text-[20px]' />
                            </div>
                            <input
                                type='email'
                                name='email'
                                value={userLogin.email}
                                onChange={handleInputChange}
                                className={`w-full h-full border-2 pl-5 text-[16px] ${userLoginError.email ? 'border-red-500' : 'border-gray-500'}`}
                                placeholder='El. paštas'
                            />
                        </div>
                        {userLoginError.email && (
                            <p className='text-red-500 text-md mt-1 px-2'>{userLoginError.email}</p>
                        )}
                    </div>

                    <div className='flex flex-col w-full h-[70px]'>
                        <div className='flex flex-row w-full h-[40px] px-8'>
                            <div className='bg-[#00574b] w-[40px] h-full flex justify-center items-center'>
                                <FontAwesomeIcon icon={faLock} className='text-white text-[20px]' />
                            </div>
                            <input
                                type='password'
                                name='password'
                                value={userLogin.password}
                                onChange={handleInputChange}
                                className={`w-full h-full border-2 pl-5 text-[16px] ${userLoginError.password ? 'border-red-500' : 'border-gray-500'}`}
                                placeholder='Slaptažodis'
                            />
                        </div>
                        {userLoginError.password && (
                            <p id='login-error-text' className='text-red-500 text-md mt-1 px-2'>{userLoginError.password}</p>
                        )}
                    </div>

                    <div className='flex flex justify-center items-center w-full mb-5'>
                        <button
                            id='login-btn'
                            type='submit'
                            className='bg-[#00574b] w-[150px] h-[30px] text-white font-bold text-[16px] rounded-md cursor-pointer hover:text-yellow-500'>
                            Prisijungti
                        </button>
                    </div>
                </form>

                <div className='flex flex-row w-full px-5 text-[16px] gap-2 items-center justify-center'>
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

