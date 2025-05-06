import {Link, useNavigate, useParams} from "react-router-dom";
import React, { useEffect, useState } from "react";
import type { OrgUnit } from "../../../types.ts";
import Cookies from "js-cookie";

const OrgUnitEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [orgUnitToEdit, setOrgUnitToEdit] = useState<OrgUnit>({
        id: '',
        orgId: '',
        title: '',
        code: '',
        address: ''
    });
    const [orgUnitTitleError, setOrgUnitTitleError] = useState<string>('');

    useEffect(() => {
        const fetchOrgUnit = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/org-units/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrgUnitToEdit(data);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchOrgUnit();
    }, []);

    const handleOrgUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrgUnitToEdit((prev) => prev ? { ...prev, [e.target.name]: e.target.value } : prev);
    };

    const validateFields = () => {
        const error = orgUnitToEdit.title.length == 0 ? 'Šis laukas yra privalomas' : ''
        setOrgUnitTitleError(error)
        return error == ''
    };

    const handleOrgUnitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (validateFields()) {
            try {
                const response = await fetch('http://localhost:8080/api/org-units', {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: orgUnitToEdit.id,
                        orgId: orgUnitToEdit.orgId,
                        title: orgUnitToEdit.title,
                        code: orgUnitToEdit.code && orgUnitToEdit.code.length == 0 ? null : orgUnitToEdit.code,
                        address: orgUnitToEdit.address && orgUnitToEdit.address.length == 0 ? null : orgUnitToEdit.address,
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

    return !orgUnitToEdit ? (
        <h2>Loading...</h2>
    ) : (
        <div className="flex flex-col gap-5 items-center w-full mt-8">
            <form className='org-container h-[200px]' onSubmit={handleOrgUnitEdit}>
                <h2 className="org-form-header">Padalinio nustatymai</h2>
                <div className='flex w-full justify-between px-10 gap-8 mt-5'>
                    <div className='flex w-full flex-col w-full items-start h-[80px]'>
                        <label className='org-input-label' htmlFor='title'>Pavadinimas:</label>
                        <input
                            type='text'
                            className={`org-input ${orgUnitTitleError ? 'border-red-500 border-[1px]' : 'border-[#dddddd] border-[1px]'}`}
                            name='title'
                            value={orgUnitToEdit.title}
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
                            value={orgUnitToEdit.code}
                            onChange={handleOrgUnitChange}
                        />
                    </div>
                    <div className='flex w-full flex-col w-full items-start h-[60px]'>
                        <label className='org-input-label' htmlFor='address'>Adresas:</label>
                        <input
                            type='text'
                            className='org-input border-[#dddddd] border-[1px]'
                            name='address'
                            value={orgUnitToEdit.address}
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
                        Saugoti
                    </button>
                </div>

            </form>
        </div>
    );
};

export default OrgUnitEdit;
