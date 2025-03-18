import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faHashtag,
    faLocationDot,
    faMessage,
    faPlus,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import type {OrgUnitCreate} from "../../../types.ts";

const OrgUnitCreate = () => {
    const navigate = useNavigate();

    const [orgUnitToCreate, setOrgUnitToCreate] = useState<OrgUnitCreate>({
        title: '',
        code: '',
        address: ''
    });

    const handleOrgUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrgUnitToCreate((prev) => prev ? {...prev, [e.target.name]: e.target.value} : prev);
    };

    const handleOrgUnitCreate = () => {
        navigate("/organization")
    }

    const handleOrgUnitCreateCancellation = () => {
        navigate("/organization")
    }

    return (
        <div className="flex flex-col gap-5 items-center justify-center w-full">
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
                                className="font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px] md:w-[400px] text-center"
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
