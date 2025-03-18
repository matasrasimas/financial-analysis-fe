import {Transaction} from "../../../types.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins, faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import TransactionEditForm from "./TransactionEditForm";


const TransactionCard = ({ transaction, handleDelete } : { transaction: Transaction; handleDelete: (id: string) => void }) => {
    const [transactionData, setTransactionData] = useState(transaction);
    const [isEditing, setIsEditing] = useState(false);

    const handleTransactionEdit = (updatedTransaction: Transaction) => {
        setTransactionData(updatedTransaction);
        setIsEditing(false);
    }

    return isEditing ? (
        <TransactionEditForm transactionToEdit={transactionData} handleEdit={handleTransactionEdit} />
    ) : (
        <div className='flex flex-col sm:flex-row w-11/12 lg:w-4/5 border-[3px] p-[20px] justify-between items-center'>
            <div className='flex flex-row gap-5 text-[40px] items-center w-1/5 justify-center sm:justify-start'>
                <div className='hidden md:block'>
                    <FontAwesomeIcon icon={faCoins} />
                </div>
                <h2 className={`font-bold ${transactionData.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transactionData.amount} €
                </h2>
            </div>
            <div className='flex flex-col justify-between gap-5 sm:mx-5 sm:mb-0 mb-5 w-1/2'>
                <h2 className='font-bold text-[25px]'>{transactionData.title}</h2>
                <h2 className='text-[20px]'>{transactionData.description}</h2>
            </div>
            <div className='flex flex-col justify-between gap-5 w-1/5 items-end'>
                <h3 className='text-gray-500 text-[20px]'>{transactionData.createdAt}</h3>
                <div className='flex flex-row justify-center gap-6'>
                    <div>
                        <FontAwesomeIcon
                            icon={faPenToSquare}
                            className='text-blue-500 text-[30px] cursor-pointer'
                            onClick={() => setIsEditing(true)}
                        />
                    </div>
                    <div>
                        <FontAwesomeIcon
                            icon={faTrash}
                            className='text-red-500 text-[30px] cursor-pointer'
                            onClick={() => handleDelete(transactionData.id)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransactionCard;