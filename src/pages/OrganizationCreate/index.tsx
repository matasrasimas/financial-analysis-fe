import {useNavigate} from "react-router-dom";
import {useAuth} from "../../auth/AuthContext.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faHashtag,
    faLocationDot,
    faMessage,
} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import type {OrganizationCreate} from "../../types.ts";
import Cookies from "js-cookie";

const OrganizationCreate = () => {
    const navigate = useNavigate();
    const {isAuthenticated, user, organization } = useAuth();

    if (!isAuthenticated || !user) {
        navigate('/login');
    }
    if (organization) {
        navigate('/')
    }

    const [organizationCreate, setOrganizationCreate] = useState<OrganizationCreate>({
        title: '',
        code: '',
        address: ''
    })

    const [orgTitleError, setOrgTitleError] = useState<string>('');

    const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrganizationCreate({...organizationCreate, userId: user.id, [e.target.name]: e.target.value});
    }

    const validateFields = () => {
        const titleError = organizationCreate.title.length == 0 ? 'Prašome įvesti pavadinimą' : ''
        setOrgTitleError(titleError)

        return titleError == '';
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateFields()) {
            try {
                const response = await fetch("http://localhost:8080/api/organizations", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        {
                            title: organizationCreate.title,
                            code: organizationCreate.code.length == 0 ? null : organizationCreate.code,
                            address: organizationCreate.address.length == 0 ? null : organizationCreate.address,
                        }
                    )
                });
                if (response.ok) {
                    const data = await response.json();
                    Cookies.set('active-org', data.id)
                    window.location.href = '/';
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };

    return (
        <div className="flex flex-col gap-5 items-center justify-center w-full">
            <div className='flex flex-col gap-5 mt-5'>
                <h2 className='main-header text-[2em] md:text-[3em]'>Įveskite organizacijos duomenis:</h2>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col justify-center items-center gap-5 text-[16px] sm:text-[22px] mb-10">
                    <div className="flex flex-col">
                        <div className='flex flex-row gap-5'>
                            <div className="hidden md:block">
                                <FontAwesomeIcon icon={faMessage} />
                            </div>
                            <div className="flex flex-row gap-5 items-center justify-center sm:justify-start">
                                <div className='flex w-[100px] sm:w-[150px]'>
                                    <label htmlFor="title" className="font-sans">Pavadinimas:</label>
                                </div>
                                <input
                                    type="text"
                                    name="title"
                                    value={organizationCreate.title}
                                    onChange={handleOrganizationChange}
                                    className={`font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px] md:w-[400px] pl-2 ${orgTitleError ? 'border-red-500' : 'border-black'}`}
                                />
                            </div>
                        </div>
                        <p className='text-red-500 text-[20px] min-h-[30px] mt-2'>{orgTitleError}</p>
                    </div>

                    <div className='flex flex-col'>
                        <div className='flex flex-row gap-5'>
                            <div className="hidden md:block">
                                <FontAwesomeIcon icon={faHashtag} />
                            </div>
                            <div className="flex flex-row gap-3 items-center text-center">
                                <div className='flex w-[100px] sm:w-[150px]'>
                                    <label htmlFor="code" className="font-sans">Kodas:</label>
                                </div>
                                <input
                                    type="text"
                                    name="code"
                                    value={organizationCreate.code}
                                    onChange={handleOrganizationChange}
                                    className="font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px] md:w-[400px] pl-2"
                                />
                            </div>
                        </div>
                        <div className='min-h-[30px]'></div>
                    </div>

                    <div className='flex flex-col'>
                        <div className='flex flex-row gap-5'>
                            <div className="hidden md:block">
                                <FontAwesomeIcon icon={faLocationDot} />
                            </div>
                            <div className="flex flex-row gap-5 items-center justify-center sm:justify-start">
                                <div className='flex w-[100px] sm:w-[150px]'>
                                    <label htmlFor="address" className="font-sans">Adresas:</label>
                                </div>
                                <input
                                    type="text"
                                    name="address"
                                    value={organizationCreate.address}
                                    onChange={handleOrganizationChange}
                                    className="font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px] md:w-[400px] pl-2"
                                />
                            </div>
                        </div>
                        <div className='min-h-[30px]'></div>
                    </div>
                    <div className='flex justify-center items-center w-full my-5'>
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

export default OrganizationCreate;