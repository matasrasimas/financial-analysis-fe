import {AutomaticTransaction, CreateAutomaticTransaction, CreateTransaction} from "../../types.ts";
import {useState} from "react";
import AutomaticTransactionCard from "./AutomaticTransactionCard";
import {faArrowLeft, faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import TransactionCreateForm from "../Transactions/TransactionCreateForm";
import AutomaticTransactionCreateForm from "./AutomaticTransactionCreateForm";

const AutomaticTransactionsIcons = () => {
    const [automaticTransactions, setAutomaticTransactions] = useState<AutomaticTransaction[]>([
        {
            id: crypto.randomUUID(),
            amount: 50,
            title: 'automatic-transaction-1',
            description: 'automatic-transaction-description-1',
            latestTransactionDate: '2025-02-01',
            durationMinutes: 620,
            durationUnit: 'minutes'
        },
        {
            id: crypto.randomUUID(),
            amount: 120,
            title: 'automatic-transaction-2',
            description: 'automatic-transaction-description-2',
            latestTransactionDate: '2025-02-06',
            durationMinutes: 620,
            durationUnit: 'minutes'
        },
        {
            id: crypto.randomUUID(),
            amount: 50,
            title: 'automatic-transaction-3',
            description: 'automatic-transaction-description-3',
            latestTransactionDate: '2025-02-01',
            durationMinutes: 620,
            durationUnit: 'minutes'
        }
    ]);
    const [showCreateTransactionForm, setShowCreateTransactionForm] = useState(false);

    const handleTransactionDelete = (id: string) => {
        setAutomaticTransactions(automaticTransactions.filter(transaction => transaction.id !== id));
    }

    const handleTransactionCreate = (transactionToCreate: CreateAutomaticTransaction) => {
        setAutomaticTransactions([
            {
                id: crypto.randomUUID(),
                amount: transactionToCreate.amount,
                title: transactionToCreate.title,
                description: transactionToCreate.description,
                latestTransactionDate: new Date().toISOString().split("T")[0],
                durationMinutes: transactionToCreate.durationMinutes,
                durationUnit: transactionToCreate.durationUnit
            },
            ...automaticTransactions
        ]);

        setShowCreateTransactionForm(false);
    }

    return (
        <div className='flex flex-col w-full mt-10 items-center'>
            <Link
                to='/transactions'
                className='flex flex-row gap-3 font-bold text-[25px] underline underline-offset-2 self-start ml-10 hover:text-blue-500'>
                <div className='block'>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <h2>Go back</h2>
            </Link>

            {!showCreateTransactionForm && (
                <div className='flex flex-row w-4/5 items-center justify-center mt-6'>
                    <FontAwesomeIcon
                        onClick={() => {
                            setShowCreateTransactionForm(true)
                        }}
                        className='text-[80px] cursor-pointer'
                        icon={faCirclePlus}/>
                </div>

            )}
            {/*{!showCreateTTransactionForm && (*/}
            {/*    <div className='flex flex-row w-4/5 items-center justify-center mt-6'>*/}
            {/*        <FontAwesomeIcon*/}
            {/*            onClick={() => {*/}
            {/*                setShowCreateTTransactionForm(true)*/}
            {/*            }}*/}
            {/*            className='text-[80px] cursor-pointer'*/}
            {/*            icon={faCirclePlus}/>*/}
            {/*    </div>*/}

            {/*)}*/}

            <div className='flex flex-col w-full items-center gap-10 my-10'>
                {showCreateTransactionForm && (
                    <AutomaticTransactionCreateForm
                        handleCreate={handleTransactionCreate}
                        closeTransactionCreateForm={() => setShowCreateTransactionForm(false)}/>
                )}
                {automaticTransactions.map((automaticTransaction: AutomaticTransaction) => {
                    return <AutomaticTransactionCard key={automaticTransaction.id} automaticTransaction={automaticTransaction}
                                            handleDelete={handleTransactionDelete}/>
                })}
            </div>
        </div>
    );
}

export default AutomaticTransactionsIcons;