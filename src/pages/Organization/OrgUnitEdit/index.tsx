import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCheck, faHashtag, faLocationDot, faMessage, faTrash} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { OrgUnit } from "../../../types.ts";
import { ORG_UNITS } from "../../../data.ts";

const OrgUnitEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [orgUnitToEdit, setOrgUnitToEdit] = useState<OrgUnit | undefined>();

    useEffect(() => {
        const orgUnitToEdit: OrgUnit | undefined = ORG_UNITS.find((orgUnit) => orgUnit.id === id);
        if (!orgUnitToEdit) {
            navigate("/not-found");
        } else {
            setOrgUnitToEdit(orgUnitToEdit);
        }
    }, [id, navigate]);

    const handleOrgUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrgUnitToEdit((prev) => prev ? { ...prev, [e.target.name]: e.target.value } : prev);
    };

    const handleOrgUnitEdit = () => {
        navigate("/organization")
    }

    const handleOrgUnitDelete = () => {
        navigate("/organization")
    }

    return orgUnitToEdit == undefined ? (
        <h2>Loading...</h2>
    ) : (
        <div className="flex flex-col gap-5 items-center justify-center w-full">
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
                                className="font-sans font-bold border-b-[3px] focus:outline-none w-[150px] sm:w-[250px] md:w-[400px] text-center"
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
                                <label htmlFor="organization-address" className="font-sans">Adresas:</label>
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
                    onClick={() => handleOrgUnitEdit(orgUnitToEdit)}
                    className='flex items-center justify-center gap-3 bg-blue-500 w-[160px] h-[50px] text-white font-bold text-[25px] rounded-lg hover:text-yellow-500 cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faCheck} />
                    </div>
                    <h2>Saugoti</h2>
                </button>
                <button
                    onClick={() => handleOrgUnitDelete()}
                    className='flex items-center justify-center gap-3 bg-red-500 w-[160px] h-[50px] text-white font-bold text-[25px] rounded-lg hover:text-yellow-500 cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faTrash} />
                    </div>
                    <h2>Ištrinti</h2>
                </button>
            </div>
        </div>
    );
};

export default OrgUnitEdit;
