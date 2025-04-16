import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowLeft, faCheck, faHashtag, faLocationDot, faMessage, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Link, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import type { OrgUnit } from "../../../types.ts";
import Cookies from "js-cookie";
import {useAuth} from "../../../auth/AuthContext.tsx";

const OrgUnitEdit = () => {
    const { id } = useParams();
    const {orgUnit} = useAuth();

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
        const error = orgUnitToEdit.title.length == 0 ? 'error' : ''
        setOrgUnitTitleError(error)
        return error == ''
    };

    const handleOrgUnitEdit = async () => {
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
                    window.location.href = '/organization';
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    const handleOrgUnitDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/org-units/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`,
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                window.location.href = '/organization';
            }
        } catch (e) {
            console.error(e);
        }
    }

    return !orgUnitToEdit ? (
        <h2>Loading...</h2>
    ) : (
        <div className="flex flex-col gap-5 items-center justify-center w-full relative">
            <Link
                to='/organization'
                className='flex flex-row gap-3 font-bold text-[25px] underline underline-offset-2 self-start ml-10 hover:text-blue-500 absolute top-5'>
                <div className='block'>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <h2>Go back</h2>
            </Link>
            <div className="flex flex-col gap-5 mt-5">
                <h2 className="main-header text-[2em] md:text-[3em]">Padalinio duomenys:</h2>
                <div className="flex flex-col justify-center items-center gap-5 text-[16px] sm:text-[22px] mb-10">
                    <div className="flex flex-row gap-5">
                        <div className="hidden md:block">
                            <FontAwesomeIcon icon={faMessage} />
                        </div>
                        <div className="flex flex-row gap-5 items-center justify-center sm:justify-start">
                            <div className="flex w-[100px] sm:w-[150px]">
                                <label htmlFor="organization-name" className="font-sans">Pavadinimas:</label>
                            </div>
                            <input
                                type="text"
                                name="title"
                                value={orgUnitToEdit?.title || ""}
                                onChange={handleOrgUnitChange}
                                className={`font-sans font-bold border-b-[3px] focus:outline-none w-[150px]
                                sm:w-[250px] md:w-[400px] text-center ${orgUnitTitleError ? 'border-red-500' : 'border-black'}`}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row gap-5">
                        <div className="hidden md:block">
                            <FontAwesomeIcon icon={faHashtag} />
                        </div>
                        <div className="flex flex-row gap-3 items-center text-center">
                            <div className="flex w-[100px] sm:w-[150px]">
                                <label htmlFor="organization-code" className="font-sans">Kodas:</label>
                            </div>
                            <input
                                type="text"
                                name="code"
                                value={orgUnitToEdit?.code || ""}
                                onChange={handleOrgUnitChange}
                                className="font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px] md:w-[400px] text-center"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row gap-5">
                        <div className="hidden md:block">
                            <FontAwesomeIcon icon={faLocationDot} />
                        </div>
                        <div className="flex flex-row gap-5 items-center justify-center sm:justify-start">
                            <div className="flex w-[100px] sm:w-[150px]">
                                <label htmlFor="address" className="font-sans">Adresas:</label>
                            </div>
                            <input
                                type="text"
                                name="address"
                                value={orgUnitToEdit?.address || ""}
                                onChange={handleOrgUnitChange}
                                className="font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px] md:w-[400px] text-center"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-15'>
                <button
                    onClick={() => handleOrgUnitEdit()}
                    className='flex items-center justify-center gap-3 bg-blue-500 w-[160px] h-[50px] text-white font-bold text-[25px] rounded-lg hover:text-yellow-500 cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faCheck} />
                    </div>
                    <h2>Saugoti</h2>
                </button>
                {orgUnit.id !== id && (
                    <button
                        onClick={() => handleOrgUnitDelete()}
                        className='flex items-center justify-center gap-3 bg-red-500 w-[160px] h-[50px] text-white font-bold text-[25px] rounded-lg hover:text-yellow-500 cursor-pointer'>
                        <div>
                            <FontAwesomeIcon icon={faTrash} />
                        </div>
                        <h2>Ištrinti</h2>
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrgUnitEdit;
