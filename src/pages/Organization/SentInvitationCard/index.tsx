import React from "react";
import {faSquareMinus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Invitation, User} from "../../../types.ts";

const SentInvitationCard = (
    {
        sentInvitation,
        receiver,
        handleInvitationDelete
    }:
    {
        sentInvitation: Invitation,
        receiver: User,
        handleInvitationDelete: (id: string) => void,
    }
) => {
    return (
        <div
            className='flex justify-between bg-white w-full h-[40px] items-center border-b-[2px] border-b-[#eeeeee] hover:shadow-md'>
            {receiver && (
                <div className='flex w-full items-center justify-center'>
                    <h2>{receiver.firstName} {receiver.lastName}</h2>
                </div>
            )}

            {receiver && (
                <div className='flex w-full items-center justify-center'>
                    <h2>{receiver.email}</h2>
                </div>
            )}


            <div className={`flex w-full items-center justify-center ${sentInvitation.isAccepted ? 'border-green-200 bg-green-200' : 'border-yellow-200 bg-yellow-200'} border-[1px] rounded-4xl`}>
                <h2>{sentInvitation.isAccepted ? 'Patvirtintas' : 'Laukiantis patvirtinimo'}</h2>
            </div>
            <div className='flex gap-5 items-center w-full items-center justify-center'>
                <div
                    onClick={() => handleInvitationDelete(sentInvitation.id)}
                    className='flex flex-row gap-3 text-red-500 font-bold items-center cursor-pointer'>
                    <FontAwesomeIcon icon={faSquareMinus}/>
                    <p>{sentInvitation.isAccepted ? 'Pašalinti' : 'Atšaukti'}</p>
                </div>

                {/*<Link to={`/org-units/${orgUnit.id}`}>*/}
                {/*    <FontAwesomeIcon icon={faPenToSquare}  className='text-blue-500 cursor-pointer' />*/}
                {/*</Link>*/}
                {/*{displayTrashCan && (*/}
                {/*    <FontAwesomeIcon onClick={() => handleOrgUnitDelete(orgUnit.id)} icon={faTrashCan} className='text-red-500 cursor-pointer' />*/}
                {/*)}*/}
            </div>
        </div>
    );
}

export default SentInvitationCard;