import React, {useEffect, useState} from 'react';
import './styles.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faCircleUser,
} from '@fortawesome/free-solid-svg-icons';
import {} from '@fortawesome/free-solid-svg-icons'
import {User, UserProfileError} from "../../types.ts";
import {useAuth} from "../../auth/AuthContext.tsx";
import Cookies from "js-cookie";

const Profile = () => {
    const {user, setUser} = useAuth();

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
        phoneNumber: '',
    })
    const [showSnackbar, setShowSnackbar] = useState(false);

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
        const errors: UserProfileError = {
            firstName: userProfile.firstName ? '' : 'Vardas yra privalomas',
            lastName: userProfile.lastName ? '' : 'Pavardė yra privaloma',
            phoneNumber: userProfile.phoneNumber && !/^\+\d{8,15}$/.test(userProfile.phoneNumber) ? 'Tel. yra neteisingas' : '',
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
                    setUser({
                        id: userProfile.id,
                        firstName: userProfile.firstName,
                        lastName: userProfile.lastName,
                        email: userProfile.email,
                        phoneNumber: userProfile.phoneNumber,
                    });
                    setShowSnackbar(true); // Show snackbar

                    setTimeout(() => {
                        setShowSnackbar(false); // Hide after 3s
                    }, 3000);
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };

    return (
        <div className="flex flex-col w-full items-center h-full">
            <div className="flex flex-col w-4/5 items-start justify-center my-5">

            </div>
            <div className='profile-container'>
                <div className='flex flex-col w-full mt-10 items-center'>
                    <FontAwesomeIcon icon={faCircleUser} className="text-[120px]"/>
                    <div className='flex flex-col w-4/5 mt-3 items-center justify-center'>
                        <h2 className='full-name-text text-center whitespace-normal break-words w-full'>{user.firstName} {user.lastName}</h2>
                        <h2 className='email-text'>{user.email}</h2>
                    </div>
                </div>
                <div className='h-full w-[2px] bg-gray-200'></div>
                <div className='flex flex-col w-full mt-5'>
                    <h2 className='profile-header'>Paskyros nustatymai</h2>
                    <form onSubmit={handleSubmit} className='flex flex-col w-full mt-5 gap-1 px-5'>

                        <div className='flex w-full flex-col w-full items-start h-[80px]'>
                            <label className='profile-input-label' htmlFor='firstName'>Vardas:</label>
                            <input
                                type='text'
                                className={`profile-input ${userProfileError.firstName ? 'border-red-500 border-[1px]' : 'border-[#dddddd] border-[1px]'}`}
                                name='firstName'
                                value={userProfile.firstName}
                                onChange={handleUserProfileChange}
                            />
                            {userProfileError.firstName && (
                                <p className='text-red-500 text-[14px]'>{userProfileError.firstName}</p>
                            )}
                        </div>

                        <div className='flex w-full flex-col w-full items-start h-[80px]'>
                            <label className='profile-input-label' htmlFor='lastName'>Pavardė:</label>
                            <input
                                type='text'
                                className={`profile-input ${userProfileError.lastName ? 'border-red-500 border-[1px]' : 'border-[#dddddd] border-[1px]'}`}
                                name='lastName'
                                value={userProfile.lastName}
                                onChange={handleUserProfileChange}
                            />
                            {userProfileError.lastName && (
                                <p className='text-red-500 text-[14px]'>{userProfileError.lastName}</p>
                            )}
                        </div>

                        <div className='flex w-full flex-col w-full items-start h-[80px]'>
                            <label className='profile-input-label' htmlFor='phoneNumber'>Tel. nr:</label>
                            <input
                                type='text'
                                className={`profile-input ${userProfileError.phoneNumber ? 'border-red-500 border-[1px]' : 'border-[#dddddd] border-[1px]'}`}
                                name='phoneNumber'
                                value={userProfile.phoneNumber}
                                onChange={handleUserProfileChange}
                            />
                            {userProfileError.phoneNumber && (
                                <p className='text-red-500 text-[14px]'>{userProfileError.phoneNumber}</p>
                            )}
                        </div>

                        <div className='flex flex justify-center items-center w-full my-5'>
                            <button
                                type='submit'
                                className='bg-[#00592b] w-[125px] h-[40px] text-white font-bold text-[16px] rounded-md cursor-pointer hover:text-yellow-500'>
                                Saugoti
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {showSnackbar && (
                <div className="snackbar">
                    Profilis sėkmingai atnaujintas!
                </div>
            )}
        </div>
    );
}
export default Profile;