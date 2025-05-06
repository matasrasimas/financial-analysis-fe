import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faLock, faPhone, faUser} from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";
import {User, UserCreate} from "../../types.ts";
import {useEffect, useState} from "react";

const Register = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<UserCreate>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        repeatPassword: '',
    });

    const [userError, setUserError] = useState<UserCreate>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        repeatPassword: '',
    });

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/users", {
                    method: "GET",
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateFields = () => {
        let emailError = ''
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
            emailError = 'Netinkamas el. paštas'
        if (users.some(u => u.email === user.email))
            emailError = 'Naudotojas su tokiu el. paštu jau egzistuoja'

        const errors: UserCreate = {
            firstName: user.firstName ? '' : 'Vardas yra privalomas',
            lastName: user.lastName ? '' : 'Pavardė yra privaloma',
            phoneNumber: user.phoneNumber && !/^\+\d{8,15}$/.test(user.phoneNumber) ? 'Tel. yra neteisingas' : '',
            email: emailError,
            password: user.password.length >= 6 ? '' : 'Slaptažodis turi būti bent 6 simbolių',
            repeatPassword: user.password === user.repeatPassword ? '' : 'Slaptažodžiai nesutampa',
        };
        setUserError(errors);
        return Object.values(errors).every(error => error === '');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateFields()) {
            try {
                const response = await fetch("http://localhost:8080/api/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            phoneNumber: user.phoneNumber.length === 0 ? null : user.phoneNumber,
                            email: user.email,
                            password: user.password,
                        }
                    )
                });
                if (response.status === 204) {
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };

    return (
        <div className='flex flex-row justify-center bg-[#00b795] w-full h-screen items-center'>
            <div className='flex flex-col w-[500px] h-[620px] bg-white'>

                <div className='flex w-full h-[35px] bg-[#00574b] items-center justify-center'>
                    <h2 className='text-white font-bold font-sans text-[16px]'>Registracija</h2>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col gap-2 mt-5'>
                    <div className='flex flex-col h-[70px] bg-white'>
                        <div className='flex flex-row w-full h-[40px] px-8'>
                            <div className='bg-[#00574b] w-[40px] h-full flex justify-center items-center'>
                                <FontAwesomeIcon icon={faUser} className='text-white text-[20px]' />
                            </div>
                            <input
                                type='text'
                                name='firstName'
                                value={user.firstName}
                                onChange={handleInputChange}
                                className={`w-full h-full border-2 pl-5 text-[16px] ${userError.firstName ? 'border-red-500' : 'border-gray-500'}`}
                                placeholder='Vardas'
                            />
                        </div>
                        {userError.firstName && (
                            <p className='text-red-500 text-md mt-1 px-2'>{userError.firstName}</p>
                        )}
                    </div>

                    <div className='flex flex-col h-[70px] bg-white'>
                        <div className='flex flex-row w-full h-[40px] px-8'>
                            <div className='bg-[#00574b] w-[40px] h-full flex justify-center items-center'>
                                <FontAwesomeIcon icon={faUser} className='text-white text-[20px]' />
                            </div>
                            <input
                                type='text'
                                name='lastName'
                                value={user.lastName}
                                onChange={handleInputChange}
                                className={`w-full h-full border-2 pl-5 text-[16px] ${userError.lastName ? 'border-red-500' : 'border-gray-500'}`}
                                placeholder='Pavardė'
                            />
                        </div>
                        {userError.lastName && (
                            <p className='text-red-500 text-md mt-1 px-2'>{userError.lastName}</p>
                        )}
                    </div>

                    <div className='flex flex-col h-[70px] bg-white'>
                        <div className='flex flex-row w-full h-[40px] px-8'>
                            <div className='bg-[#00574b] w-[40px] h-full flex justify-center items-center'>
                                <FontAwesomeIcon icon={faPhone} className='text-white text-[20px]' />
                            </div>
                            <input
                                type='text'
                                name='phoneNumber'
                                value={user.phoneNumber}
                                onChange={handleInputChange}
                                className={`w-full h-full border-2 pl-5 text-[16px] ${userError.phoneNumber ? 'border-red-500' : 'border-gray-500'}`}
                                placeholder='Tel. nr'
                            />
                        </div>
                        {userError.phoneNumber && (
                            <p className='text-red-500 text-md mt-1 px-2'>{userError.phoneNumber}</p>
                        )}
                    </div>

                    <div className='flex flex-col h-[70px] bg-white'>
                        <div className='flex flex-row w-full h-[40px] px-8'>
                            <div className='bg-[#00574b] w-[40px] h-full flex justify-center items-center'>
                                <FontAwesomeIcon icon={faEnvelope} className='text-white text-[20px]' />
                            </div>
                            <input
                                type='email'
                                name='email'
                                value={user.email}
                                onChange={handleInputChange}
                                className={`w-full h-full border-2 pl-5 text-[16px] ${userError.email ? 'border-red-500' : 'border-gray-500'}`}
                                placeholder='El. paštas'
                            />
                        </div>
                        {userError.email && (
                            <p className='text-red-500 text-md mt-1 px-2'>{userError.email}</p>
                        )}
                    </div>

                    <div className='flex flex-col h-[70px] bg-white'>
                        <div className='flex flex-row w-full h-[40px] px-8'>
                            <div className='bg-[#00574b] w-[40px] h-full flex justify-center items-center'>
                                <FontAwesomeIcon icon={faLock} className='text-white text-[20px]' />
                            </div>
                            <input
                                type='password'
                                name='password'
                                value={user.password}
                                onChange={handleInputChange}
                                className={`w-full h-full border-2 pl-5 text-[16px] ${userError.password ? 'border-red-500' : 'border-gray-500'}`}
                                placeholder='Slaptažodis'
                            />
                        </div>
                        {userError.password && (
                            <p className='text-red-500 text-md mt-1 px-2'>{userError.password}</p>
                        )}
                    </div>

                    <div className='flex flex-col h-[70px] bg-white'>
                        <div className='flex flex-row w-full h-[40px] px-8'>
                            <div className='bg-[#00574b] w-[40px] h-full flex justify-center items-center'>
                                <FontAwesomeIcon icon={faLock} className='text-white text-[20px]' />
                            </div>
                            <input
                                type='password'
                                name='repeatPassword'
                                value={user.repeatPassword}
                                onChange={handleInputChange}
                                className={`w-full h-full border-2 pl-5 text-[16px] ${userError.repeatPassword ? 'border-red-500' : 'border-gray-500'}`}
                                placeholder='Pakartoti slaptažodį'
                            />
                        </div>
                        {userError.repeatPassword && (
                            <p className='text-red-500 text-md mt-1 px-2'>{userError.repeatPassword}</p>
                        )}
                    </div>


                    <div className='flex flex justify-center items-center w-full mb-5'>
                        <button
                            type='submit'
                            className='bg-[#00574b] w-[150px] h-[30px] text-white font-bold text-[16px] rounded-md cursor-pointer hover:text-yellow-500'
                        >
                            Kurti paskyrą
                        </button>
                    </div>
                </form>

                <div className='flex flex-row w-full px-5 text-[16px] gap-2 items-center justify-center'>
                    <h2 className='break-words whitespace-normal'>Jau turite paskyrą?
                    </h2>
                    <Link
                        to='/login'
                        className='text-[#00574b] font-bold underline hover:text-[#00877b]'
                    >
                        Prisijungti
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Register;

