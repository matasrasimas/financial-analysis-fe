import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins} from "@fortawesome/free-solid-svg-icons";
import {TransactionFromFile} from "../../../types.ts";

const TransactionFromFileCard = ({
                                 transactionToEdit,
                                 onChange,
                                 onDelete
} : {
    transactionToEdit: TransactionFromFile,
    onChange: (updated: TransactionFromFile) => void,
    onDelete: () => void
}) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const updatedTransaction = {
            ...transactionToEdit,
            [name]: name === "amount" ? parseFloat(value) : value
        };

        onChange(updatedTransaction);
    };


    return (
        <div className='flex flex-col sm:flex-row w-11/12 lg:w-4/5 border-[3px] p-[20px] justify-between items-center bg-gray-300 mb-10'>
            <div className='flex flex-row gap-5 text-[40px] items-center w-1/5 mb-5 sm:mb-0'>
                <div className='hidden sm:block'>
                    <FontAwesomeIcon icon={faCoins}/>
                </div>
                <input
                    type='number'
                    name='amount'
                    value={transactionToEdit.amount}
                    onChange={handleChange}
                    className={`font-bold w-full text-center border-b-3 outline-none appearance-none ${
                        transactionToEdit.amount > 0 ? 'text-green-600' : 'text-red-600'} ${transactionToEdit.amountError ? 'border-red-500' : 'border-black'}`}
                />


            </div>
            <div className='flex flex-col justify-between gap-5 sm:mx-5 sm:mb-0 mb-5 w-1/2 items-center'>
                <input
                    type='text'
                    name='title'
                    value={transactionToEdit.title}
                    onChange={handleChange}
                    className={`font-bold self-center text-[25px] w-full text-center border-b-3 outline-none appearance-none ${transactionToEdit.titleError ? 'border-red-500' : 'border-black'}`}
                />
                <input
                    type='text'
                    name='description'
                    value={transactionToEdit.description}
                    onChange={handleChange}
                    className='text-[20px] w-full text-center border-b-3 border-black outline-none appearance-none'
                />
            </div>
            <div className='flex flex-col justify-between gap-5 w-1/5 items-end'>
                <input
                    type='date'
                    name='createdAt'
                    value={transactionToEdit.createdAt}
                    onChange={handleChange}
                    className={`text-[20px] w-full text-center border-b-3 outline-none appearance-none ${transactionToEdit.createdAtError ? 'border-red-500' : 'border-black'}`}
                />

                <button
                    onClick={onDelete}
                    className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Ištrinti
                </button>
            </div>

        </div>
    );
}

export default TransactionFromFileCard;