import {AutomaticTransaction} from "../../../types.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins, faMessage, faStopwatch} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import AutomaticTransactionEditForm from "./AutomaticTransactionEditForm";
import EditAndDeleteIcons from "../../../common/EditAndDeleteIcons";
import Cookies from "js-cookie";

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

    const handleTransactionEdit = async (updatedTransaction: AutomaticTransaction) => {
        try {
            const response = await fetch('http://localhost:8080/api/automatic-transactions', {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        id: updatedTransaction.id,
                        orgUnitId: updatedTransaction.orgUnitId,
                        amount: updatedTransaction.amount,
                        title: updatedTransaction.title,
                        description: updatedTransaction.description && updatedTransaction.description.length == 0 ? null : updatedTransaction.description,
                        duration: updatedTransaction.duration,
                        durationUnit: updatedTransaction.durationUnit,
                    }
                )
            });

            if (response.ok) {
                setAutomaticTransactionData(updatedTransaction);
                setIsEditing(false);
            }
        } catch(e) {
            console.error(e);
        }
    }

    const mapDurationUnitToLT = (): string => {
        if (automaticTransactionData.durationUnit == 'MINUTES')
            return 'minutės'
        if (automaticTransactionData.durationUnit == 'HOURS')
            return 'valandos'
        if (automaticTransactionData.durationUnit == 'DAYS')
            return 'dienos'
        return ''
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
                <div className='flex flex-row text-[20px] items-center justify-center sm:justify-start'>
                    <h2 className='flex w-[175px]'>kiekis:</h2>
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
                    <div className='flex flex-row items-start justify-center'>
                        <h2 className='flex w-[175px]'>Pavadinimas:</h2>
                        <h2 className='font-bold'>{automaticTransactionData.title}</h2>
                    </div>
                    <div className='flex flex-row'>
                        <h2 className='flex w-[175px]'>Komentaras:</h2>
                        <h2 className='font-bold'>{automaticTransactionData.description}</h2>
                    </div>
                </div>
            </div>
            <div className='flex flex-row gap-5 text-[20px] justify-between'>
                <div className='flex flex-row gap-5'>
                    <div className='hidden md:block'>
                        <FontAwesomeIcon icon={faStopwatch}/>
                    </div>
                    <div className='flex flex-row'>
                        <h2 className='flex w-[175px]'>Trukmė:</h2>
                        <h2 className='font-bold'>{automaticTransactionData.duration} {mapDurationUnitToLT()}</h2>
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