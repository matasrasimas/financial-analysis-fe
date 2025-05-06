import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {TransactionFromFile} from "../../../types.ts";
import React from "react";

const TransactionFromFileCard = ({
                                     transactionToEdit,
                                     onChange,
                                     onDelete
                                 }: {
    transactionToEdit: TransactionFromFile,
    onChange: (updated: TransactionFromFile) => void,
    onDelete: () => void
}) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        const updatedTransaction = {
            ...transactionToEdit,
            [name]: name === "amount" ? parseFloat(value) : value
        };

        onChange(updatedTransaction);
    };


    return (
        <div
            className='flex justify-between bg-white w-full h-[40px] items-center border-b-[2px] border-b-[#eeeeee] hover:shadow-md'>
            <div className='flex w-full items-center justify-center'>
                <input
                    className={`text-center ${transactionToEdit.amountError && 'text-red-500'}`}
                    type='number'
                    name='amount'
                    value={transactionToEdit.amount}
                    onChange={handleChange}
                />
                {/*<h3>{transactionToEdit.amount}</h3>*/}
            </div>
            <div className='flex w-full items-center justify-center'>
                <input
                    className={`text-center ${transactionToEdit.titleError && 'text-red-500'}`}
                    type='text'
                    name='title'
                    value={transactionToEdit.title}
                    onChange={handleChange}
                />
                {/*<h3>{transactionToEdit.title}</h3>*/}
            </div>

            <div className='flex w-full items-center justify-center'>
                <input
                    className={`text-center ${transactionToEdit.createdAtError && 'text-red-500'}`}
                    type='date'
                    name='createdAt'
                    value={transactionToEdit.createdAt}
                    onChange={handleChange}
                />
                {/*<h3>{transactionToEdit.createdAt}</h3>*/}
            </div>

            <div className='flex gap-5 items-center w-full items-center justify-center'>
                <FontAwesomeIcon onClick={onDelete} icon={faTrashCan}
                                 className='text-red-500 cursor-pointer'/>

            </div>


            {/*<div className='flex flex-row gap-5 text-[40px] items-center w-1/5 mb-5 sm:mb-0'>*/}
            {/*    <div className='hidden sm:block'>*/}
            {/*        <FontAwesomeIcon icon={faCoins}/>*/}
            {/*    </div>*/}
            {/*    <input*/}
            {/*        type='number'*/}
            {/*        name='amount'*/}
            {/*        value={transactionToEdit.amount}*/}
            {/*        onChange={handleChange}*/}
            {/*        className={`font-bold w-full text-center border-b-3 outline-none appearance-none ${*/}
            {/*            transactionToEdit.amount > 0 ? 'text-green-600' : 'text-red-600'} ${transactionToEdit.amountError ? 'border-red-500' : 'border-black'}`}*/}
            {/*    />*/}


            {/*</div>*/}
            {/*<div className='flex flex-col justify-between gap-5 sm:mx-5 sm:mb-0 mb-5 w-1/2 items-center'>*/}
            {/*    <input*/}
            {/*        type='text'*/}
            {/*        name='title'*/}
            {/*        value={transactionToEdit.title}*/}
            {/*        onChange={handleChange}*/}
            {/*        className={`font-bold self-center text-[25px] w-full text-center border-b-3 outline-none appearance-none ${transactionToEdit.titleError ? 'border-red-500' : 'border-black'}`}*/}
            {/*    />*/}
            {/*    <input*/}
            {/*        type='text'*/}
            {/*        name='description'*/}
            {/*        value={transactionToEdit.description}*/}
            {/*        onChange={handleChange}*/}
            {/*        className='text-[20px] w-full text-center border-b-3 border-black outline-none appearance-none'*/}
            {/*    />*/}
            {/*</div>*/}
            {/*<div className='flex flex-col justify-between gap-5 w-1/5 items-end'>*/}
            {/*    <input*/}
            {/*        type='date'*/}
            {/*        name='createdAt'*/}
            {/*        value={transactionToEdit.createdAt}*/}
            {/*        onChange={handleChange}*/}
            {/*        className={`text-[20px] w-full text-center border-b-3 outline-none appearance-none ${transactionToEdit.createdAtError ? 'border-red-500' : 'border-black'}`}*/}
            {/*    />*/}

            {/*    <button*/}
            {/*        onClick={onDelete}*/}
            {/*        className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"*/}
            {/*    >*/}
            {/*        Ištrinti*/}
            {/*    </button>*/}
            {/*</div>*/}

        </div>

        // <div
        //     className='flex justify-between bg-white w-full h-[40px] items-center border-b-[2px] border-b-[#eeeeee] hover:shadow-md'>
        //     <div className='flex w-full items-center justify-center'>
        //         <h3>{transaction.amount}</h3>
        //     </div>
        //     <div className='flex w-full items-center justify-center'>
        //         <h3>{transaction.title}</h3>
        //     </div>
        //
        //     <div className='flex w-full items-center justify-center'>
        //         <h3>{transaction.createdAt}</h3>
        //     </div>
        //
        //     {author && (
        //         <div className='flex w-full items-center justify-center'>
        //             <h3>{author.firstName} {author.lastName}</h3>
        //         </div>
        //     )}
        //
        //     <div className='flex gap-5 items-center w-full items-center justify-center'>
        //         <Link to={`/transaction-edit/${transaction.id}`}>
        //             <FontAwesomeIcon icon={faPenToSquare} className='text-blue-500 cursor-pointer'/>
        //         </Link>
        //         <FontAwesomeIcon onClick={() => handleTransactionDelete(transaction.id)} icon={faTrashCan}
        //                          className='text-red-500 cursor-pointer'/>
        //         {transaction.isLocked
        //             ? (
        //                 <FontAwesomeIcon icon={faLock} className='cursor-pointer' onClick={() => handleTransactionLock(transaction.id)}/>)
        //             : (
        //                 <FontAwesomeIcon icon={faLockOpen} className='cursor-pointer' onClick={() => handleTransactionLock(transaction.id)}/>
        //             )
        //         }
        //     </div>
        // </div>
    );
}

export default TransactionFromFileCard;