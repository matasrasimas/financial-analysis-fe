import {Transaction} from "../../../../types.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";

const TransactionEditForm = ({
                                 transactionToEdit,
                                 handleEdit } : {
    transactionToEdit: Transaction,
    handleEdit: (updatedTransaction: Transaction) => void
}) => {

    const [editedTransaction, setEditedTransaction] = useState({...transactionToEdit});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTransaction({...editedTransaction, [e.target.name]: e.target.value});
    }

    return (
        <div className='flex flex-col sm:flex-row w-11/12 lg:w-4/5 border-[3px] p-[20px] justify-between items-center bg-gray-300'>
            <div className='flex flex-row gap-5 text-[40px] items-center w-1/5 mb-5 sm:mb-0'>
                <div className='hidden sm:block'>
                    <FontAwesomeIcon icon={faCoins}/>
                </div>
                <input
                    type='number'
                    name='amount'
                    value={editedTransaction.amount}
                    onChange={handleChange}
                    className={`font-bold w-full text-center border-b-3 border-black outline-none appearance-none ${
                        editedTransaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                />


            </div>
            <div className='flex flex-col justify-between gap-5 sm:mx-5 sm:mb-0 mb-5 w-1/2 items-center'>
                <input
                    type='text'
                    name='title'
                    value={editedTransaction.title}
                    onChange={handleChange}
                    className='font-bold self-center text-[25px] w-full text-center border-b-3 border-black outline-none appearance-none'
                />
                <input
                    type='text'
                    name='description'
                    value={editedTransaction.description}
                    onChange={handleChange}
                    className='text-[20px] w-full text-center w-4/5 border-b-3 border-black outline-none appearance-none'
                />
            </div>
            <div className='flex flex-col justify-between gap-5 w-1/5 items-end'>
                <h3 className='text-gray-500 text-[20px]'>{transactionToEdit.createdAt}</h3>
                <div className='flex flex-row justify-center'>
                    <button
                        className='bg-blue-500 text-white font-bold w-[100px] h-[30px] border-white border-2 cursor-pointer hover:text-yellow-300'
                        onClick={() => handleEdit(editedTransaction)}>Save</button>
                </div>
            </div>

        </div>
    );
}

export default TransactionEditForm;