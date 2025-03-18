import {AutomaticTransaction} from "../../../types.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins, faMessage, faStopwatch} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import AutomaticTransactionEditForm from "./AutomaticTransactionEditForm";
import EditAndDeleteIcons from "../../../common/EditAndDeleteIcons";

const AutomaticTransactionCard = (
    {
        automaticTransaction,
        handleDelete
    }:
    {
        automaticTransaction: AutomaticTransaction,
        handleDelete: (id: string) => void
    }
) => {
    const [automaticTransactionData, setAutomaticTransactionData] = useState(automaticTransaction);
    const [isEditing, setIsEditing] = useState(false);

    const handleTransactionEdit = (updatedTransaction: AutomaticTransaction) => {
        setAutomaticTransactionData(updatedTransaction);
        setIsEditing(false);
    }

    return isEditing ? (
        <AutomaticTransactionEditForm
            transactionToEdit={automaticTransactionData}
            handleEdit={handleTransactionEdit}
        />
    ) : (
        <div className='flex flex-col w-11/12 lg:w-4/5 border-b-[3px] p-[20px] gap-5'>
            <div className='flex flex-row gap-5'>
                <div className='hidden md:block'>
                    <FontAwesomeIcon icon={faCoins}/>
                </div>
                <div className='flex flex-row gap-5 text-[20px] items-center justify-center sm:justify-start'>
                    <h2 className='mr-[60px]'>Amount:</h2>
                    <h2 className={`font-bold ${automaticTransactionData.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {automaticTransactionData.amount} €
                    </h2>
                </div>
            </div>
            <div className='flex flex-row gap-5'>
                <div className='hidden md:flex items-center justify-center'>
                    <FontAwesomeIcon icon={faMessage}/>
                </div>
                <div className='flex flex-col justify-start items-start gap-2 text-[20px]'>
                    <div className='flex flex-row: gap-3 items-start justify-center'>
                        <h2 className='mr-[100px]'>Title:</h2>
                        <h2 className='font-bold'>{automaticTransactionData.title}</h2>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <h2 className='mr-[36px]'>Description:</h2>
                        <h2 className='font-bold'>{automaticTransactionData.description}</h2>
                    </div>
                </div>
            </div>
            <div className='flex flex-row gap-5 text-[20px] justify-between'>
                <div className='flex flex-row gap-5'>
                    <div className='hidden md:block'>
                        <FontAwesomeIcon icon={faStopwatch}/>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <h2 className='mr-[56px]'>Duration:</h2>
                        <h2 className='font-bold'>{automaticTransactionData.durationMinutes} {automaticTransactionData.durationUnit}</h2>
                    </div>
                </div>
                <div className='hidden sm:block'>
                    <EditAndDeleteIcons
                        handleEditClick={() => setIsEditing(true)}
                        handleDeleteClick={handleDelete}
                        transactionId={automaticTransactionData.id}
                    />
                </div>
            </div>
            <div className='block sm:hidden'>
                <EditAndDeleteIcons
                    handleEditClick={() => setIsEditing(true)}
                    handleDeleteClick={handleDelete}
                    transactionId={automaticTransactionData.id}
                />
            </div>
        </div>
    );
}

export default AutomaticTransactionCard;