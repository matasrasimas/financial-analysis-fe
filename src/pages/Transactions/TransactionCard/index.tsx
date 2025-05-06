import {Link} from "react-router-dom";
import React from "react";
import {faLock, faLockOpen, faPenToSquare, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Transaction, User} from "../../../types.ts";
import './styles.css'
import {useAuth} from "../../../auth/AuthContext.tsx";

const TransactionCard = (
    {
        transaction,
        handleTransactionDelete,
        author,
        handleTransactionLock
    }:
    {
        transaction: Transaction,
        handleTransactionDelete: (id: string) => void,
        author: User,
        handleTransactionLock: (id: string) => void
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

            {author ? (
                <div className='flex w-full items-center justify-center'>
                    <h3>{author.firstName} {author.lastName}</h3>
                </div>
            ) : (
                <div className='flex w-full items-center justify-center'>
                    <h3>Sukurta automatiškai</h3>
                </div>
            )}

            <div className='flex gap-5 items-center w-full justify-center'>
                {(user.id === organization.userId || transaction.userId === user.id) && (
                    <Link to={`/transaction-edit/${transaction.id}`}>
                        <FontAwesomeIcon
                            icon={faPenToSquare}
                            className={`text-blue-500 ${transaction.isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={(e) => transaction.isLocked && e.preventDefault()} // prevent navigation if locked
                        />
                    </Link>
                )}

                {(user.id === organization.userId || transaction.userId === user.id) && (
                    <FontAwesomeIcon
                        icon={faTrashCan}
                        onClick={() => {
                            if (!transaction.isLocked) {
                                handleTransactionDelete(transaction.id)
                            }
                        }}
                        className={`text-red-500 ${transaction.isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                )}

                {transaction.isLocked && user.id === organization.userId
                    && (
                        <FontAwesomeIcon
                            icon={faLock}
                            className='cursor-pointer'
                            onClick={() => handleTransactionLock(transaction.id)}
                        />
                    )}

                {!transaction.isLocked && user.id === organization.userId
                    && (
                        <FontAwesomeIcon
                            icon={faLockOpen}
                            className='cursor-pointer'
                            onClick={() => handleTransactionLock(transaction.id)}
                        />
                    )}
            </div>
        </div>
    );
}

export default TransactionCard;