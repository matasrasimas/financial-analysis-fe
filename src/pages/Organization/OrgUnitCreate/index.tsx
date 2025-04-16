import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faHashtag,
    faLocationDot,
    faMessage,
    faPlus,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
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
    };

    const validateFields = () => {
        const error = orgUnitToCreate.title.length == 0 ? 'error' : ''
        setOrgUnitTitleError(error)
        return error == ''
    };

    const handleOrgUnitCreate = async () => {
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
                        address: orgUnitToCreate.address && orgUnitToCreate.address.length == 0 ? orgUnitToCreate.address : null,
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

    const handleOrgUnitCreateCancellation = () => {
        navigate("/organization")
    }

    return (
        <div className="flex flex-col gap-5 items-center justify-center w-full relative">
            <Link
                to='/organization'
                className='flex flex-row gap-3 font-bold text-[25px] underline underline-offset-2 self-start ml-10 hover:text-blue-500 absolute top-5'>
                <div className='block'>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <h2>Atgal</h2>
            </Link>
            <div className="flex flex-col gap-5 mt-5">
                <h2 className="main-header text-[2em] md:text-[3em]">Padalinio kūrimas:</h2>
                <div className="flex flex-col justify-center items-center gap-5 text-[16px] sm:text-[22px] mb-10">
                    <div className="flex flex-row gap-5">
                        <div className="hidden md:block">
                            <FontAwesomeIcon icon={faMessage}/>
                        </div>
                        <div className="flex flex-row gap-5 items-center justify-center sm:justify-start">
                            <div className="flex w-[100px] sm:w-[150px]">
                                <label htmlFor="organization-name" className="font-sans">Pavadinimas:</label>
                            </div>
                            <input
                                type="text"
                                name="title"
                                value={orgUnitToCreate.title}
                                onChange={handleOrgUnitChange}
                                className={`font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px]
                                md:w-[400px] text-center ${orgUnitTitleError ? 'border-red-500' : 'border-black'}`}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row gap-5">
                        <div className="hidden md:block">
                            <FontAwesomeIcon icon={faHashtag}/>
                        </div>
                        <div className="flex flex-row gap-3 items-center text-center">
                            <div className="flex w-[100px] sm:w-[150px]">
                                <label htmlFor="organization-code" className="font-sans">Kodas:</label>
                            </div>
                            <input
                                type="text"
                                name="code"
                                value={orgUnitToCreate.code}
                                onChange={handleOrgUnitChange}
                                className="font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px] md:w-[400px] text-center"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row gap-5">
                        <div className="hidden md:block">
                            <FontAwesomeIcon icon={faLocationDot}/>
                        </div>
                        <div className="flex flex-row gap-5 items-center justify-center sm:justify-start">
                            <div className="flex w-[100px] sm:w-[150px]">
                                <label htmlFor="organization-address" className="font-sans">Adresas:</label>
                            </div>
                            <input
                                type="text"
                                name="address"
                                value={orgUnitToCreate.address}
                                onChange={handleOrgUnitChange}
                                className="font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px] md:w-[400px] text-center"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-15'>
                <button
                    onClick={() => handleOrgUnitCreate()}
                    className='flex items-center justify-center gap-3 bg-blue-500 w-[160px] h-[50px] text-white font-bold text-[25px] rounded-lg hover:text-yellow-500 cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faPlus}/>
                    </div>
                    <h2>Kurti</h2>
                </button>
                <button
                    onClick={() => handleOrgUnitCreateCancellation()}
                    className='flex items-center justify-center gap-3 bg-red-500 w-[160px] h-[50px] text-white font-bold text-[25px] rounded-lg hover:text-yellow-500 cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faXmark}/>
                    </div>
                    <h2>Atšaukti</h2>
                </button>
            </div>
        </div>
    );
};

export default OrgUnitCreate;
