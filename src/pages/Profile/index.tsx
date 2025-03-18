import React, { useState } from 'react';
import './styles.css';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome';
import {
    faIdCard,
    faCircleUser,
    faPhone,
    faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-solid-svg-icons'
import {UserProfile} from "../../types.ts";

const Profile = () => {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        id: crypto.randomUUID(),
        firstName: "John",
        lastName: "Doe",
        phone: "69420",
        email: "johndoe@gmail.com",
    });

    const handleUserProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserProfile({...userProfile, [e.target.name]: e.target.value});
    }

    // useEffect(() => {
    //     if(loggedUser.id !== userId && loggedUser.role !== 'ADMIN') {
    //         navigate('/')
    //         return
    //     }

    //     const fetchData = async () => {
    //
    //         try {
    //
    //             const usersResponse = await fetch(`${API_URL}/api/users`);
    //             if (!usersResponse.ok) throw new Error('Failed to fetch posts');
    //             const users = await usersResponse.json();
    //
    //             const user = users.find(u => u.id === userId);
    //             console.log(user)
    //             if (!user) {
    //                 console.error(`User with id ${userId} not found`);
    //                 navigate('/');
    //                 return;
    //             }
    //
    //             if(loggedUser.id !== userId && loggedUser.role !== 'ADMIN') {
    //                 navigate('/')
    //                 return
    //             }
    //
    //             setUser(user)
    //
    //         } catch (error) {
    //             console.error('Error fetching data:', error.message);
    //         }
    //     };
    //
    //     fetchData();
    // }, []);


    // const handleAccountDeletion = async () => {
    //     try {
    //         const jwt = Cookies.get('jwt')
    //         const response = await fetch(`${API_URL}/api/users/${userId}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${jwt}`
    //             },
    //             credentials: 'include',
    //         });
    //
    //         if (response.ok) {
    //             if(loggedUser.role == 'ADMIN') {
    //                 navigate('/profiles')
    //                 return
    //             }
    //
    //             Cookies.remove("jwt")
    //             navigate('/')
    //             window.location.reload();
    //
    //         } else {
    //             console.error('Error removing post:', response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Error removing post:', error);
    //     }
    // };


    return (
        <div className='flex flex-col w-full items-center justify-center mt-5'>
            <h2 className='main-header text-[2em] sm:text-[3em]'>Paskyros konfigūracija</h2>
            <div className='flex flex-col w-11/12 sm:w-4/5 md:w-3/5 lg:w-2/5 my-8 py-6 gap-8 items-center bg-stone-300 border-2 border-gray-800 rounded-lg shadow-lg shadow-inner'>
                <div className='flex flex-col items-center justify-center gap-5'>
                    <div className="w-11/12 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCircleUser} className="text-[90px]" />
                    </div>
                </div>

                <div className='flex flex-col w-full items-center justify-center gap-10'>

                    <div className='flex flex-row gap-3 items-center justify-center text-[22px] w-4/5'>
                        <div className='flex flex-row justify-between items-center gap-5'>
                            <div className='hidden md:block'>
                                <FontAwesomeIcon icon={faIdCard} className='text-gray-800 text-[30px]' />
                            </div>
                            <div className='flex flex-col gap-3 w-full'>
                                <div className='flex flex-row gap-3 items-center'>
                                    <label htmlFor='firstName' className='font-sans w-24'>Vardas:</label>
                                    <input
                                        name='firstName'
                                        value={userProfile.firstName}
                                        onChange={handleUserProfileChange}
                                        className='font-sans font-bold border-b-[3px] focus:outline-none w-[250px]'/>
                                </div>
                                <div className='flex flex-row gap-3 items-center'>
                                    <label htmlFor='lastName' className='font-sans w-24'>Pavardė:</label>
                                    <input
                                        type='text'
                                        name='lastName'
                                        value={userProfile.lastName}
                                        onChange={handleUserProfileChange}
                                        className='font-sans font-bold border-b-[3px] focus:outline-none w-[250px]'/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-row gap-3 text-[22px] items-center justify-center w-4/5'>
                        <div className='flex flex-row justify-center items-center gap-5'>
                            <div className='hidden md:block'>
                                <FontAwesomeIcon icon={faPhone} className='text-gray-800 text-[30px]'/>
                            </div>
                            <div className='flex flex-row gap-3 items-center w-full'>
                                <label htmlFor='phone' className='font-sans w-24'>Tel. nr:</label>
                                <input
                                    type='text'
                                    name='phone'
                                    value={userProfile.phone}
                                    onChange={handleUserProfileChange}
                                    className='font-sans font-bold border-b-[3px] focus:outline-none w-[250px]'/>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-row gap-3 justify-center text-[22px] w-4/5'>
                        <div className='flex flex-row justify-between items-center gap-5'>
                            <div className='hidden md:block'>
                                <FontAwesomeIcon icon={faEnvelope} className='text-gray-800 text-[30px]'/>
                            </div>
                            <div className='flex flex-row gap-3 items-center w-full'>
                                <label htmlFor='email' className='font-sans'>El. paštas:</label>
                                <input
                                    type='text'
                                    name='email'
                                    value={userProfile.email}
                                    onChange={handleUserProfileChange}
                                    className='font-sans font-bold border-b-[3px] focus:outline-none w-[250px]'/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Profile;