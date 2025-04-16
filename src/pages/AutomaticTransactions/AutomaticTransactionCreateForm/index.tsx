import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins, faMessage, faStopwatch} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {AutomaticTransactionError, CreateAutomaticTransaction} from "../../../types.ts";
import {useAuth} from "../../../auth/AuthContext.tsx";

const AutomaticTransactionCreateForm = (
    {
        handleCreate,
        closeTransactionCreateForm,
    }:
    {
        handleCreate: (transactionToCreate: CreateAutomaticTransaction) => void,
        closeTransactionCreateForm: () => void
    }
) => {
    const {orgUnit} = useAuth();

    const [transactionToCreate, setTransactionToCreate] = useState<CreateAutomaticTransaction>(
        {
            orgUnitId: orgUnit.id,
            amount: 0,
            title: '',
            description: '',
            duration: 0,
            durationUnit: 'MINUTES',
        }
    );
    const [transactionError, setTransactionError] = useState<AutomaticTransactionError>({
        amount: '',
        title: '',
        duration: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTransactionToCreate({...transactionToCreate, [e.target.name]: e.target.value});
    }

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTransactionToCreate({...transactionToCreate, [e.target.name]: e.target.value});
    };

    const validateInput = () => {
        const errors: AutomaticTransactionError = {
            amount: transactionToCreate.amount == 0 ? 'error' : '',
            title: transactionToCreate.title.length == 0 ? 'error' : '',
            duration: transactionToCreate.duration <= 0 ? 'error' : ''
        }
        setTransactionError(errors)
        return Object.values(errors).every(error => error === '');
    }

    const submitForm = () => {
        if (validateInput()) {
            handleCreate(transactionToCreate);
        }
    }

    return (
        <div className='flex flex-col w-11/12 lg:w-4/5 border-b-[3px] p-[20px] gap-5 bg-gray-300'>
            <div className='flex flex-row gap-5'>
                <div className='hidden md:block'>
                    <FontAwesomeIcon icon={faCoins}/>
                </div>
                <div className='flex flex-row gap-5 text-[20px] items-center justify-center sm:justify-start'>
                    <label htmlFor='amount' className='flex w-[150px]'>Kiekis:</label>
                    <input
                        type='number'
                        name='amount'
                        value={transactionToCreate.amount}
                        onChange={handleChange}
                        className={`border-b-3 border-black outline-none appearance-none w-[100px] 
                        font-bold ${transactionToCreate.amount > 0 ? 'text-green-600' : 'text-red-600'} ${transactionError.amount ? 'border-red-500' : 'border-black'}`}/>
                </div>
            </div>
            <div className='flex flex-row gap-5'>
                <div className='hidden md:flex items-center justify-center'>
                    <FontAwesomeIcon icon={faMessage}/>
                </div>
                <div className='flex flex-col justify-start items-start gap-2 text-[20px] overflow-hidden'>
                    <div className='flex flex-row: gap-3 items-start justify-center'>
                        <label htmlFor='title' className='flex w-[150px]'>Pavadinimas:</label>
                        <input
                            type='text'
                            name='title'
                            value={transactionToCreate.title}
                            onChange={handleChange}
                            className={`font-bold border-b-3 outline-none appearance-none md:w-[500px] ${transactionError.title ? 'border-red-500' : 'border-black'}`}/>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <label htmlFor='description' className='flex w-[150px]'>Komentaras:</label>
                        <input
                            type='text'
                            name='description'
                            value={transactionToCreate.description}
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
                        <label htmlFor='duration' className='flex w-[150px]'>Trukmė:</label>
                        <input
                            type='number'
                            name='duration'
                            value={transactionToCreate.duration}
                            onChange={handleChange}
                            className={`font-bold border-b-3 outline-none appearance-none w-[100px] ${transactionError.duration ? 'border-red-500' : 'border-black'}`}/>
                        <select
                            className='bg-white rounded-lg w-[120px]'
                            name='durationUnit'
                            onChange={handleDropdownChange}
                            value={transactionToCreate.durationUnit}
                        >
                            <option value='MINUTES'>minutės</option>
                            <option value='HOURS'>valandos</option>
                            <option value='DAYS'>dienos</option>

                        </select>
                    </div>
                </div>
                <div className='hidden md:flex flex-col justify-center gap-5 w-1/5 items-center sm:items-end my-2'>
                    <div className='flex flex-row justify-center text-center text-[18px]'>
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
            <div className='md:hidden flex flex-col justify-center gap-5 w-full items-center sm:items-end my-2'>
                <div className='flex flex-row justify-center text-center text-[18px] items-center'>
                    <button
                        className='bg-blue-500 text-white font-bold w-[100px] h-[30px] border-white border-2 cursor-pointer hover:text-yellow-300'
                        onClick={() => submitForm()}>Create
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

export default AutomaticTransactionCreateForm;