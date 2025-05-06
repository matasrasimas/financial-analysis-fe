import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import type {OrgUnitCreate} from "../../../types.ts";
import {useAuth} from "../../../auth/AuthContext.tsx";
import Cookies from "js-cookie";

const OrgUnitCreate = () => {
    const {organization} = useAuth();
    const navigate = useNavigate();

    const [orgUnitToCreate, setOrgUnitToCreate] = useState<OrgUnitCreate>({
        orgId: organization.id,
        title: '',
        code: '',
        address: ''
    });
    const [orgUnitTitleError, setOrgUnitTitleError] = useState<string>('');

    const handleOrgUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrgUnitToCreate((prev) => prev ? {...prev, [e.target.name]: e.target.value} : prev);
        console.log(orgUnitToCreate);
    };

    const validateFields = () => {
        const error = orgUnitToCreate.title.length == 0 ? 'Šis laukas yra privalomas' : ''
        setOrgUnitTitleError(error)
        return error == ''
    };

    const handleOrgUnitCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateFields()) {
            try {
                const response = await fetch('http://localhost:8080/api/org-units', {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        orgId: orgUnitToCreate.orgId,
                        title: orgUnitToCreate.title,
                        code: orgUnitToCreate.code && orgUnitToCreate.code.length == 0 ? null : orgUnitToCreate.code,
                        address: orgUnitToCreate.address && orgUnitToCreate.address.length == 0 ? null : orgUnitToCreate.address,
                    })
                });
                if (response.ok) {
                    navigate('/')
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    return (
        <div className="flex flex-col gap-5 items-center w-full mt-8">
            <form className='org-container h-[200px]' onSubmit={handleOrgUnitCreate}>
                <h2 className="org-form-header">Padalinio kūrimas</h2>
                <div className='flex w-full justify-between px-10 gap-8 mt-5'>
                    <div className='flex w-full flex-col w-full items-start h-[80px]'>
                        <label className='org-input-label' htmlFor='title'>Pavadinimas:</label>
                        <input
                            type='text'
                            className={`org-input ${orgUnitTitleError ? 'border-red-500 border-[1px]' : 'border-[#dddddd] border-[1px]'}`}
                            name='title'
                            value={orgUnitToCreate.title}
                            onChange={handleOrgUnitChange}
                        />
                        {orgUnitTitleError && (
                            <p className='text-red-500 text-[14px]'>{orgUnitTitleError}</p>
                        )}
                    </div>
                    <div className='flex w-full flex-col w-full items-start h-[80px]'>
                        <label className='org-input-label' htmlFor='code'>Kodas:</label>
                        <input
                            type='text'
                            className='org-input border-[#dddddd] border-[1px]'
                            name='code'
                            value={orgUnitToCreate.code}
                            onChange={handleOrgUnitChange}
                        />
                    </div>
                    <div className='flex w-full flex-col w-full items-start h-[60px]'>
                        <label className='org-input-label' htmlFor='address'>Adresas:</label>
                        <input
                            type='text'
                            className='org-input border-[#dddddd] border-[1px]'
                            name='address'
                            value={orgUnitToCreate.address}
                            onChange={handleOrgUnitChange}
                        />
                    </div>

                </div>

                <div className='flex flex-row w-full justify-end pr-5 gap-5'>
                    <Link
                        to='/'
                        className='flex items-center justify-center bg-red-600 w-[125px] h-[40px] text-white font-bold text-[16px] rounded-md cursor-pointer hover:text-yellow-500 self-end'>
                        Atšaukti
                    </Link>
                    <button
                        type='submit'
                        className='bg-[#00592b] w-[125px] h-[40px] text-white font-bold text-[16px] rounded-md cursor-pointer hover:text-yellow-500 self-end'>
                        Kurti
                    </button>
                </div>

            </form>
        </div>
        // <div className="flex flex-col gap-5 items-center justify-center w-full relative">
        //     <Link
        //         to='/organization'
        //         className='flex flex-row gap-3 font-bold text-[25px] underline underline-offset-2 self-start ml-10 hover:text-blue-500 absolute top-5'>
        //         <div className='block'>
        //             <FontAwesomeIcon icon={faArrowLeft} />
        //         </div>
        //         <h2>Atgal</h2>
        //     </Link>
        //     <div className="flex flex-col gap-5 mt-5">
        //         <h2 className="main-header text-[2em] md:text-[3em]">Padalinio kūrimas:</h2>
        //         <div className="flex flex-col justify-center items-center gap-5 text-[16px] sm:text-[22px] mb-10">
        //             <div className="flex flex-row gap-5">
        //                 <div className="hidden md:block">
        //                     <FontAwesomeIcon icon={faMessage}/>
        //                 </div>
        //                 <div className="flex flex-row gap-5 items-center justify-center sm:justify-start">
        //                     <div className="flex w-[100px] sm:w-[150px]">
        //                         <label htmlFor="organization-name" className="font-sans">Pavadinimas:</label>
        //                     </div>
        //                     <input
        //                         type="text"
        //                         name="title"
        //                         value={orgUnitToCreate.title}
        //                         onChange={handleOrgUnitChange}
        //                         className={`font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px]
        //                         md:w-[400px] text-center ${orgUnitTitleError ? 'border-red-500' : 'border-black'}`}
        //                     />
        //                 </div>
        //             </div>
        //             <div className="flex flex-row gap-5">
        //                 <div className="hidden md:block">
        //                     <FontAwesomeIcon icon={faHashtag}/>
        //                 </div>
        //                 <div className="flex flex-row gap-3 items-center text-center">
        //                     <div className="flex w-[100px] sm:w-[150px]">
        //                         <label htmlFor="organization-code" className="font-sans">Kodas:</label>
        //                     </div>
        //                     <input
        //                         type="text"
        //                         name="code"
        //                         value={orgUnitToCreate.code}
        //                         onChange={handleOrgUnitChange}
        //                         className="font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px] md:w-[400px] text-center"
        //                     />
        //                 </div>
        //             </div>
        //             <div className="flex flex-row gap-5">
        //                 <div className="hidden md:block">
        //                     <FontAwesomeIcon icon={faLocationDot}/>
        //                 </div>
        //                 <div className="flex flex-row gap-5 items-center justify-center sm:justify-start">
        //                     <div className="flex w-[100px] sm:w-[150px]">
        //                         <label htmlFor="organization-address" className="font-sans">Adresas:</label>
        //                     </div>
        //                     <input
        //                         type="text"
        //                         name="address"
        //                         value={orgUnitToCreate.address}
        //                         onChange={handleOrgUnitChange}
        //                         className="font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px] md:w-[400px] text-center"
        //                     />
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //
        //     <div className='flex flex-col gap-15'>
        //         <button
        //             onClick={() => handleOrgUnitCreate()}
        //             className='flex items-center justify-center gap-3 bg-blue-500 w-[160px] h-[50px] text-white font-bold text-[25px] rounded-lg hover:text-yellow-500 cursor-pointer'>
        //             <div>
        //                 <FontAwesomeIcon icon={faPlus}/>
        //             </div>
        //             <h2>Kurti</h2>
        //         </button>
        //         <button
        //             onClick={() => handleOrgUnitCreateCancellation()}
        //             className='flex items-center justify-center gap-3 bg-red-500 w-[160px] h-[50px] text-white font-bold text-[25px] rounded-lg hover:text-yellow-500 cursor-pointer'>
        //             <div>
        //                 <FontAwesomeIcon icon={faXmark}/>
        //             </div>
        //             <h2>Atšaukti</h2>
        //         </button>
        //     </div>
        // </div>
    );
};

export default OrgUnitCreate;
