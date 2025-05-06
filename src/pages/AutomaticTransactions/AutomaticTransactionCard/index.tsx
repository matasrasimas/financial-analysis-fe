import {Link} from "react-router-dom";
import React from "react";
import {faLock, faLockOpen, faPenToSquare, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AutomaticTransaction, Transaction, User} from "../../../types.ts";
import './styles.css'

const AutomaticTransactionCard = (
    {
        automaticTransaction,
        handleTransactionDelete,
    }:
    {
        automaticTransaction: AutomaticTransaction,
        handleTransactionDelete: (id: string) => void,
    }
) => {

    function translateDurationUnit(input: string) {
        const translations = {
            'MINUTES': 'minutės',
            'HOURS': 'valandos',
            'DAYS': 'dienos'
        };

        return translations[input] || input;
    }

    return (
        <div
            className='flex justify-between bg-white w-full h-[40px] items-center border-b-[2px] border-b-[#eeeeee] hover:shadow-md'>
            <div className='flex w-full items-center justify-center'>
                <h3>{automaticTransaction.amount}</h3>
            </div>
            <div className='flex w-full items-center justify-center'>
                <h3>{automaticTransaction.title}</h3>
            </div>

            <div className='flex w-full items-center justify-center'>
                <h3>{automaticTransaction.nextTransactionDate}</h3>
            </div>

            <div className='flex w-full items-center justify-center'>
                <h3>{automaticTransaction.duration} {translateDurationUnit(automaticTransaction.durationUnit)}</h3>
            </div>

            <div className='flex gap-5 items-center w-full items-center justify-center'>
                <Link to={`/automatic-transaction-edit/${automaticTransaction.id}`}>
                    <FontAwesomeIcon icon={faPenToSquare} className='text-blue-500 cursor-pointer'/>
                </Link>
                <FontAwesomeIcon onClick={() => handleTransactionDelete(automaticTransaction.id)} icon={faTrashCan}
                                 className='text-red-500 cursor-pointer'/>
            </div>
        </div>
    );
}

export default AutomaticTransactionCard;