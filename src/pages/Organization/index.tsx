import React, {useState} from "react";
import {
    faCirclePlus,
    faHashtag,
    faLocationDot,
    faMessage,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import type {Organization} from "../../types.ts";
import '../../App.css'
import OrgUnits from "./OrgUnits";
import {Link} from "react-router-dom";
import {useAuth} from "../../auth/AuthContext.tsx";
import Cookies from "js-cookie";

const Organization = () => {
    const {organization} = useAuth()
    const [organizationToEdit, setOrganizationToEdit] = useState<Organization>({
        id: organization.id,
        userId: organization.userId,
        title: organization.title,
        code: organization.code,
        address: organization.address,
    })
    const [orgTitleError, setOrgTitleError] = useState<string>('')

    const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrganizationToEdit({...organizationToEdit, [e.target.name]: e.target.value});
    }

    const validateFields = () => {
        const error = organizationToEdit.title.length == 0 ? 'error' : ''
        setOrgTitleError(error)
        return error == ''
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateFields()) {
            try {
                const response = await fetch("http://localhost:8080/api/organizations", {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        {
                            id: organizationToEdit.id,
                            userId: organizationToEdit.userId,
                            title: organizationToEdit.title,
                            code: organizationToEdit.code && organizationToEdit.code.length == 0 ? null : organizationToEdit.code,
                            address: organizationToEdit.address && organizationToEdit.address.length == 0 ? null : organizationToEdit.address,
                        }
                    )
                });
                if (response.ok) {
                    window.location.href = '/';
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };

    return (
        <div className="flex flex-col gap-5 items-center justify-center w-full">
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-5 mt-5'>
                    <h2 className='main-header text-[2em] md:text-[3em]'>Organizacijos duomenys:</h2>
                    <div className="flex flex-col justify-center items-center gap-5 text-[16px] sm:text-[22px] mb-10">
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
                                    value={organizationToEdit.title}
                                    onChange={handleOrganizationChange}
                                    className={`font-sans font-bold border-b-[3px] focus:outline-none w-[150px]
                                     sm:w-[250px] md:w-[400px] text-center ${orgTitleError ? 'border-red-500' : 'border-black'}`}
                                />
                            </div>
                        </div>
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
                                    value={organizationToEdit.code}
                                    onChange={handleOrganizationChange}
                                    className="font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px] md:w-[400px] text-center"
                                />
                            </div>
                        </div>
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
                                    value={organizationToEdit.address}
                                    onChange={handleOrganizationChange}
                                    className="font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px] md:w-[400px] text-center"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex justify-center items-center w-full mb-5'>
                    <button
                        type='submit'
                        className='bg-black w-[200px] h-[50px] text-white font-bold text-[20px] rounded-md cursor-pointer hover:text-yellow-500'>
                        Saugoti
                    </button>
                </div>

            </form>



            <div className='block w-3/5 h-[3px] bg-black'></div>

            {/*<div className='flex flex-col border-x-[5px] border-t-[5px] w-[80%] items-center justify-center'>*/}
            {/*    <div className='border-b-[5px] w-full px-5'>*/}
            {/*        <h2 className='main-header text-[2em] md:text-[3em]'>Naudotojai, galintys kurti transakcijas organizacijoje:</h2>*/}
            {/*    </div>*/}
            {/*    <div className='flex flex-row w-full items-center justify-center'>*/}
            {/*        <div className='flex w-full items-center px-5 justify-start md:justify-center py-3 border-b-[5px] gap-5 relative'>*/}
            {/*            <div className='hidden md:block'>*/}
            {/*                <FontAwesomeIcon icon={faUserCircle} className='text-[40px]'/>*/}
            {/*            </div>*/}
            {/*            <h2 className='font-sans font-bold text-[20px] md:text-[30px]'>Vardenis Pavardenis</h2>*/}
            {/*            <div className='absolute right-8'>*/}
            {/*                <FontAwesomeIcon*/}
            {/*                    icon={faTrash}*/}
            {/*                    className='text-red-500 text-[30px] md:text-[40px] cursor-pointer'*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className='flex flex-col gap-5 w-[90%]'>
                <h2 className='main-header text-[2em] md:text-[3em]'>Organizacijos padaliniai:</h2>
                <OrgUnits />
            </div>
            <Link
                to='/org-unit-create'
                className='flex flex-row items-center justify-center my-6'>
                <FontAwesomeIcon
                    className='text-[80px] cursor-pointer'
                    icon={faCirclePlus}/>
            </Link>
        </div>
    );
}

export default Organization;