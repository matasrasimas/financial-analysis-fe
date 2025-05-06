import React from "react";
import {faCheck, faSquareMinus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Invitation, Organization, User} from "../../../types.ts";

const ReceivedInvitationCard = (
    {
        receivedInvitation,
        sender,
        organizationToJoin,
        handleInvitationUpdate,
        handleInvitationDelete
    }:
    {
        receivedInvitation: Invitation,
        sender: User,
        organizationToJoin: Organization,
        handleInvitationUpdate: (id: string) => void,
        handleInvitationDelete: (id: string) => void,
    }
) => {
    return (
        <div
            className='flex justify-between bg-white w-full h-[40px] items-center border-b-[2px] border-b-[#eeeeee] hover:shadow-md'>

            <div className='flex w-[30%] items-center justify-center'>
                <h2>{receivedInvitation.createdAt}</h2>
            </div>

            {sender && organizationToJoin && (
                <div className='flex w-full items-center justify-center'>
                    <h2>{sender.firstName} {sender.lastName} išsiuntė pakvietimą prisijungti prie organizacijos {organizationToJoin.title}</h2>
                </div>
            )}

            <div className='flex gap-5 items-center w-[30%] items-center justify-center items-center justify-center'>
                <div>
                    <FontAwesomeIcon icon={faCheck} onClick={() => handleInvitationUpdate(receivedInvitation.id)} className='text-green-500 cursor-pointer' />
                </div>
                    <FontAwesomeIcon icon={faXmark} onClick={() => handleInvitationDelete(receivedInvitation.id)} className='text-red-500 cursor-pointer' />
            </div>
        </div>
    );
}

export default ReceivedInvitationCard;