import {Link} from "react-router-dom";
import React from "react";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Transaction, User} from "../../../types.ts";
import {useAuth} from "../../../auth/AuthContext.tsx";

const TransactionModalCard = (
    {
        transaction,
        author,
    }:
    {
        transaction: Transaction,
        author: User,
    }
) => {
    const {organization, user} = useAuth()

    return (
        <div
            className={`flex justify-between ${transaction.isLocked ? 'bg-gray-300' : 'bg-white'} w-full h-[40px] items-center border-b-[2px] border-b-[#eeeeee] hover:shadow-md`}>
            <div className='flex w-full items-center justify-center'>
                <h3>{transaction.amount}</h3>
            </div>
            <div className='flex w-full items-center justify-center'>
                <h3>{transaction.title}</h3>
            </div>

            <div className='flex w-full items-center justify-center'>
                <h3>{transaction.createdAt}</h3>
            </div>

            {author && (
                <div className='flex w-full items-center justify-center'>
                    <h3>{author.firstName} {author.lastName}</h3>
                </div>
            )}
        </div>
    );
}

export default TransactionModalCard;