import {Link} from "react-router-dom";
import {OrgUnit} from "../../../../types.ts";
import React from "react";
import {faPenToSquare, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useAuth} from "../../../../auth/AuthContext.tsx";

const OrgUnitCard = (
    {
        orgUnit,
        handleOrgUnitDelete,
        displayTrashCan
    }:
    {
        orgUnit: OrgUnit,
        handleOrgUnitDelete: (id: string) => void,
        displayTrashCan: boolean
    }
) => {
    const {user, organization} = useAuth();

    return (
        <div className='flex justify-between bg-white w-full h-[40px] items-center border-b-[2px] border-b-[#eeeeee] hover:shadow-md'>
            <div className='flex w-full items-center justify-center'>
                <h2>{orgUnit.title}</h2>
            </div>
            <div className='flex w-full items-center justify-center'>
                <h2>{orgUnit.code}</h2>
            </div>
            <div className='flex w-full items-center justify-center'>
                <h2>{orgUnit.address}</h2>
            </div>

            {user.id === organization.userId && (
                <div className='flex gap-5 items-center w-full items-center justify-center'>
                    <Link to={`/org-units/${orgUnit.id}`}>
                        <FontAwesomeIcon icon={faPenToSquare}  className='text-blue-500 cursor-pointer' />
                    </Link>
                    {displayTrashCan && (
                        <FontAwesomeIcon onClick={() => handleOrgUnitDelete(orgUnit.id)} icon={faTrashCan} className='text-red-500 cursor-pointer' />
                    )}
                </div>
            )}

        </div>
    );
}

export default OrgUnitCard;