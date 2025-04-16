import React, {useEffect, useState} from 'react';
import './styles.css';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome';
import {
    faIdCard,
    faCircleUser,
    faPhone,
    faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-solid-svg-icons'
import {User, UserCreate, UserProfileError} from "../../types.ts";
import {useAuth} from "../../auth/AuthContext.tsx";
import Cookies from "js-cookie";

const Profile = () => {
    const { user } = useAuth();

    const [userProfile, setUserProfile] = useState<User>({
        id: user.id ? user.id : '',
        firstName: user.firstName ? user.firstName : '',
        lastName: user.lastName ? user.lastName : '',
        email: user.email ? user.email : '',
        phoneNumber: user.phoneNumber ? user.phoneNumber : '',
    });

    const [userProfileError, setUserProfileError] = useState<UserProfileError>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    })

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

    const handleUserProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserProfile({...userProfile, [e.target.name]: e.target.value});
    }

    const validateFields = () => {
        let emailError = ''
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.email))
            emailError = 'Netinkamas el. paštas'
        if (users.some(u => u.id !== userProfile.id && u.email === userProfile.email))
            emailError = 'Naudotojas su tokiu el. paštu jau egzistuoja'

        const errors: UserCreate = {
            firstName: userProfile.firstName ? '' : 'Vardas yra privalomas',
            lastName: userProfile.lastName ? '' : 'Pavardė yra privaloma',
            phoneNumber: userProfile.phoneNumber && !/^\+\d{8,15}$/.test(userProfile.phoneNumber) ? 'Tel. yra neteisingas' : '',
            email: emailError,
        };
        setUserProfileError(errors);
        return Object.values(errors).every(error => error === '');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateFields()) {
            try {
                const response = await fetch("http://localhost:8080/api/users", {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        {
                            id: userProfile.id,
                            firstName: userProfile.firstName,
                            lastName: userProfile.lastName,
                            phoneNumber: userProfile.phoneNumber == null || userProfile.phoneNumber.length === 0 ? null : user.phoneNumber,
                            email: userProfile.email,
                        }
                    )
                });
                if (response.status === 204) {
                    window.location.href = '/';
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };

    return (
        <div className='flex flex-col w-full items-center justify-center mt-5'>
            <h2 className='main-header text-[2em] sm:text-[3em]'>Paskyros konfigūracija</h2>
            <div className='flex flex-col w-11/12 sm:w-4/5 md:w-3/5 lg:w-2/5 my-8 py-6 items-center bg-stone-300 border-2 border-gray-800 rounded-lg shadow-lg shadow-inner'>
                <div className='flex flex-col items-center justify-center mb-[50px]'>
                    <div className="w-11/12 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCircleUser} className="text-[90px]" />
                    </div>
                </div>

                <form className='flex flex-col w-full items-center justify-center' onSubmit={handleSubmit}>
                    <div className='flex flex-col text-[22px] items-center justify-center w-full h-[80px]'>
                        <div className='flex flex-row justify-center items-center gap-5'>
                            <div className='hidden md:block'>
                                <FontAwesomeIcon icon={faIdCard} className='text-gray-800 text-[30px]'/>
                            </div>
                            <div className='flex flex-row items-center w-full gap-3'>
                                <label htmlFor='firstName' className='font-sans w-24'>Vardas:</label>
                                <input
                                    type='text'
                                    name='firstName'
                                    value={userProfile.firstName}
                                    onChange={handleUserProfileChange}
                                    className={`font-sans font-bold border-b-[3px] focus:outline-none w-[250px] ${userProfileError.firstName ? 'border-red-500' : 'border-black'}`}/>
                            </div>
                        </div>
                        <p className='text-red-500 text-[20px] min-h-[40px]'>{userProfileError.firstName}</p>
                    </div>

                    <div className='flex flex-col text-[22px] items-center justify-center w-full h-[80px]'>
                        <div className='flex flex-row justify-center items-center gap-5'>
                            <div className='hidden md:block'>
                                <FontAwesomeIcon icon={faIdCard} className='text-gray-800 text-[30px]'/>
                            </div>
                            <div className='flex flex-row items-center w-full gap-3'>
                                <label htmlFor='lastName' className='font-sans w-24'>Pavardė:</label>
                                <input
                                    type='text'
                                    name='lastName'
                                    value={userProfile.lastName}
                                    onChange={handleUserProfileChange}
                                    className={`font-sans font-bold border-b-[3px] focus:outline-none w-[250px] ${userProfileError.lastName ? 'border-red-500' : 'border-black'}`}/>
                            </div>
                        </div>
                        <p className='text-red-500 text-[20px] min-h-[40px]'>{userProfileError.lastName}</p>
                    </div>

                    <div className='flex flex-col text-[22px] items-center justify-center w-full h-[80px]'>
                        <div className='flex flex-row justify-center items-center gap-3'>
                            <div className='hidden md:block'>
                                <FontAwesomeIcon icon={faPhone} className='text-gray-800 text-[30px]'/>
                            </div>
                            <div className='flex flex-row items-center w-full'>
                                <label htmlFor='phoneNumber' className='font-sans w-24'>Tel. nr:</label>
                                <input
                                    type='text'
                                    name='phoneNumber'
                                    value={userProfile.phoneNumber}
                                    onChange={handleUserProfileChange}
                                    className={`font-sans font-bold border-b-[3px] focus:outline-none w-[250px] ${userProfileError.phoneNumber ? 'border-red-500' : 'border-black'}`}/>
                            </div>
                        </div>
                        <p className='text-red-500 text-[20px] min-h-[40px]'>{userProfileError.phoneNumber}</p>
                    </div>

                    <div className='flex flex-col text-[22px] items-center justify-center w-full h-[80px]'>
                        <div className='flex flex-row justify-center items-center gap-3'>
                            <div className='hidden md:block'>
                                <FontAwesomeIcon icon={faEnvelope} className='text-gray-800 text-[30px]'/>
                            </div>
                            <div className='flex flex-row items-center w-full gap-3'>
                                <label htmlFor='email' className='font-sans w-24'>El. paštas:</label>
                                <input
                                    type='email'
                                    name='email'
                                    value={userProfile.email}
                                    onChange={handleUserProfileChange}
                                    className={`font-sans font-bold border-b-[3px] focus:outline-none w-[250px] ${userProfileError.email ? 'border-red-500' : 'border-black'}`}/>
                            </div>
                        </div>
                        <p className='text-red-500 text-[20px] min-h-[40px]'>{userProfileError.email}</p>
                    </div>



                    <div className='flex flex justify-center items-center w-full my-5'>
                        <button
                            type='submit'
                            className='bg-black w-[200px] h-[50px] text-white font-bold text-[20px] rounded-md cursor-pointer hover:text-yellow-500'>
                            Saugoti
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
export default Profile;