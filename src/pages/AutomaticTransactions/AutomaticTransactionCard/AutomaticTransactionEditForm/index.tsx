import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins, faMessage, faStopwatch} from "@fortawesome/free-solid-svg-icons";
import {AutomaticTransaction} from "../../../../types.ts";
import {useState} from "react";

const AutomaticTransactionEditForm = (
    {
        transactionToEdit,
        handleEdit
    }:
    {
        transactionToEdit: AutomaticTransaction,
        handleEdit: (updatedTransaction: AutomaticTransaction) => void
    }
) => {
    const [editedTransaction, setEditedTransaction] = useState<AutomaticTransaction>({...transactionToEdit});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTransaction({...editedTransaction, [e.target.name]: e.target.value});
    }

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEditedTransaction({...editedTransaction, [e.target.name]: e.target.value});
    };

    return (
        <div className='flex flex-col w-11/12 lg:w-4/5 border-b-[3px] p-[20px] gap-5 bg-gray-300'>
            <div className='flex flex-row gap-5'>
                <div className='hidden md:block'>
                    <FontAwesomeIcon icon={faCoins}/>
                </div>
                <div className='flex flex-row gap-5 text-[20px] items-center justify-center sm:justify-start'>
                    <label htmlFor='amount' className='mr-[60px]'>Amount:</label>
                    <input
                        type='number'
                        name='amount'
                        value={editedTransaction.amount}
                        onChange={handleChange}
                        className={`border-b-3 border-black outline-none appearance-none w-[100px] 
                        font-bold ${editedTransaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}/>
                </div>
            </div>
            <div className='flex flex-row gap-5'>
                <div className='hidden md:flex items-center justify-center'>
                    <FontAwesomeIcon icon={faMessage}/>
                </div>
                <div className='flex flex-col justify-start items-start gap-2 text-[20px] overflow-hidden'>
                    <div className='flex flex-row: gap-3 items-start justify-center'>
                        <label htmlFor='title' className='mr-[100px]'>Title:</label>
                        <input
                            type='text'
                            name='title'
                            value={editedTransaction.title}
                            onChange={handleChange}
                            className='font-bold border-b-3 border-black outline-none appearance-none md:w-[500px]'/>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <label htmlFor='description' className='mr-[36px]'>Description:</label>
                        <input
                            type='text'
                            name='description'
                            value={editedTransaction.description}
                            onChange={handleChange}
                            className='font-bold border-b-3 border-black outline-none appearance-none md:w-[500px]'/>
                    </div>
                </div>
            </div>
            <div className='flex flex-row gap-5 text-[20px] justify-between'>
                <div className='flex flex-row gap-5'>
                    <div className='hidden md:block'>
                        <FontAwesomeIcon icon={faStopwatch}/>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <label htmlFor='durationMinutes' className='mr-[56px]'>Duration:</label>
                        <input
                            type='number'
                            name='durationMinutes'
                            value={editedTransaction.durationMinutes}
                            onChange={handleChange}
                            className='font-bold border-b-3 border-black outline-none appearance-none w-[100px]'/>
                        <select
                            className='bg-white rounded-lg'
                            name='durationUnit'
                            onChange={handleDropdownChange}
                            value={editedTransaction.durationUnit}
                        >
                            <option value='minutes'>minutes</option>
                            <option value='hours'>hours</option>
                            <option value='days'>days</option>

                        </select>
                    </div>
                </div>
                <div className='hidden sm:inline-block text-center items-center'>
                    <button
                        className='bg-blue-500 text-[18px] text-center text-white font-bold w-[100px] h-[30px] border-white border-2 cursor-pointer hover:text-yellow-300'
                        onClick={() => handleEdit(editedTransaction)}>Save
                    </button>
                </div>
            </div>
            <div className='inline-block sm:hidden text-center'>
                <button
                    className='bg-blue-500 text-center text-[18px] text-white font-bold w-[100px] h-[30px] border-white border-2 cursor-pointer hover:text-yellow-300'
                    onClick={() => handleEdit(editedTransaction)}>Save
                </button>
            </div>
        </div>
    );
}

export default AutomaticTransactionEditForm;