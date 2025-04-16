import {CreateTransaction, TransactionError} from "../../../types.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {useAuth} from "../../../auth/AuthContext.tsx";

const TransactionEditForm = ({
                                 handleCreate,
                                 closeTransactionCreateForm
} : {
    handleCreate: (createdTransaction: CreateTransaction) => void,
    closeTransactionCreateForm: () => void
}) => {

    const {orgUnit} = useAuth();

    const [createdTransaction, setCreatedTransaction] = useState<CreateTransaction>({
        orgUnitId: orgUnit.id,
        amount: 0,
        title: '',
        description: '',
        createdAt: ''
    });
    const [transactionError, setTransactionError] = useState<TransactionError>({
        amount: '',
        title: '',
        createdAt: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreatedTransaction(prev => ({
            ...prev,
            [name]: name === "amount" ? parseFloat(value) : value
        }));
    }

    const validateInput = () => {
        const errors: TransactionError = {
            amount: createdTransaction.amount == 0 ? 'error' : '',
            title: createdTransaction.title.length == 0 ? 'error' : '',
            createdAt: createdTransaction.createdAt.length == 0 ? 'error' : ''
        }
        setTransactionError(errors)
        return Object.values(errors).every(error => error === '');
    }

    const submitForm = () => {
        if (validateInput()) {
            handleCreate(createdTransaction);
        }
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
                    className={`font-bold w-full text-center border-b-3 outline-none appearance-none ${
                        createdTransaction.amount > 0 ? 'text-green-600' : 'text-red-600'} ${transactionError.amount ? 'border-red-500' : 'border-black'}`}
                />

            </div>
            <div className='flex flex-col justify-between gap-5 sm:mx-5 sm:mb-0 mb-5 w-1/2 items-center'>
                <input
                    type='text'
                    name='title'
                    value={createdTransaction.title}
                    onChange={handleChange}
                    placeholder='Pavadinimas...'
                    className={`font-bold self-center text-[25px] w-full text-center border-b-3 outline-none appearance-none ${transactionError.title ? 'border-red-500' : 'border-black'}`}
                />
                <input
                    type='text'
                    name='description'
                    value={createdTransaction.description}
                    onChange={handleChange}
                    placeholder='Komentaras...'
                    className='text-[20px] w-full text-center w-4/5 border-b-3 border-black outline-none appearance-none'
                />
            </div>
            <div className='flex'>

            </div>
            <div className='flex flex-col justify-center gap-5 w-1/5 items-center sm:items-end my-2'>
                <input
                    type='date'
                    name='createdAt'
                    value={createdTransaction.createdAt}
                    onChange={handleChange}
                    className={`text-[20px] w-full text-center border-b-3 outline-none appearance-none ${transactionError.createdAt ? 'border-red-500' : 'border-black'}`}
                />
                <div className='flex flex-row justify-center'>
                    <button
                        className='bg-blue-500 text-white font-bold w-[100px] h-[30px] border-white border-2 cursor-pointer hover:text-yellow-300'
                        onClick={() => submitForm()}>Kurti
                    </button>
                    <button
                        className='bg-red-500 text-white font-bold w-[100px] h-[30px] border-white border-2 cursor-pointer hover:text-yellow-300'
                        onClick={() => closeTransactionCreateForm()}>Atšaukti
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TransactionEditForm;