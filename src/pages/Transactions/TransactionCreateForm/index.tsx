import {CreateTransaction} from "../../../types.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";

const TransactionEditForm = ({
                                 handleCreate,
                                 closeTransactionCreateForm
} : {
    handleCreate: (createdTransaction: CreateTransaction) => void,
    closeTransactionCreateForm: () => void
}) => {

    const [createdTransaction, setCreatedTransaction] = useState<CreateTransaction>({
        amount: 0,
        title: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreatedTransaction({...createdTransaction, [e.target.name]: e.target.value});
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
                    value={createdTransaction.amount}
                    onChange={handleChange}
                    className={`font-bold w-full text-center border-b-3 border-black outline-none appearance-none ${
                        createdTransaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                />


            </div>
            <div className='flex flex-col justify-between gap-5 sm:mx-5 sm:mb-0 mb-5 w-1/2 items-center'>
                <input
                    type='text'
                    name='title'
                    value={createdTransaction.title}
                    onChange={handleChange}
                    placeholder='title...'
                    className='font-bold self-center text-[25px] w-full text-center border-b-3 border-black outline-none appearance-none'
                />
                <input
                    type='text'
                    name='description'
                    value={createdTransaction.description}
                    onChange={handleChange}
                    placeholder='description...'
                    className='text-[20px] w-full text-center w-4/5 border-b-3 border-black outline-none appearance-none'
                />
            </div>
            <div className='flex flex-col justify-center gap-5 w-1/5 items-center sm:items-end my-2'>
                <div className='flex flex-row justify-center'>
                    <button
                        className='bg-blue-500 text-white font-bold w-[100px] h-[30px] border-white border-2 cursor-pointer hover:text-yellow-300'
                        onClick={() => handleCreate(createdTransaction)}>Create
                    </button>
                    <button
                        className='bg-red-500 text-white font-bold w-[100px] h-[30px] border-white border-2 cursor-pointer hover:text-yellow-300'
                        onClick={() => closeTransactionCreateForm()}>Cancel
                    </button>
                </div>
            </div>

        </div>
    );
}

export default TransactionEditForm;