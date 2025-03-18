import {CreateTransaction, Transaction} from "../../types.ts";
import TransactionCard from "./TransactionCard";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import TransactionCreateForm from "./TransactionCreateForm";
import {Link} from "react-router-dom";

const Transactions = () => {
    const [showCreateTransactionForm, setShowCreateTransactionForm] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            id: 'id1',
            amount: 200,
            title: 'title1',
            description: 'description1',
            createdAt: '2025-02-03'
        },
        {
            id: 'id2',
            amount: 250,
            title: 'title2',
            description: 'description2',
            createdAt: '2025-02-05'
        },
        {
            id: 'id3',
            amount: -34,
            title: 'title3',
            description: 'description3',
            createdAt: '2024-12-17'
        }
    ]);

    const handleTransactionDelete = (id: string) => {
        setTransactions(transactions.filter((transaction) => transaction.id !== id));
    }

    const handleTransactionCreate = (transactionToCreate: CreateTransaction) => {
        setTransactions([
            {
                id: crypto.randomUUID(),
                amount: transactionToCreate.amount,
                title: transactionToCreate.title,
                description: transactionToCreate.description,
                createdAt: new Date().toISOString().split("T")[0]
            },
            ...transactions
        ]);

        setShowCreateTransactionForm(false);
    }

    const handleCloseTransactionCreateForm = () => {
        setShowCreateTransactionForm(false);
    }

    return (
        <div className='flex flex-col w-full mt-10 items-center'>
            <div className='flex w-4/5 flex-row gap-5 justify-center items-center'>
                <Link to='/automatic-transactions'>
                    <button
                        className='bg-blue-500 h-[50px] w-[200px] text-white font-bold font-(family-name:--roboto-font) hover:text-yellow-400'
                    >
                        Automatic transactions
                    </button>
                </Link>
                <Link to='/image-transactions'>
                    <button className='bg-blue-500 h-[50px] w-[200px] text-white font-bold font-(family-name:--roboto-font) hover:text-yellow-400'>Transactions by image</button>
                </Link>
            </div>
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

            <div className='flex flex-col w-full items-center gap-10 my-10'>
                {showCreateTransactionForm && (
                    <TransactionCreateForm
                        handleCreate={handleTransactionCreate}
                        closeTransactionCreateForm={handleCloseTransactionCreateForm}/>
                )}
                {transactions.map((transaction: Transaction) => {
                    return <TransactionCard key={transaction.id} transaction={transaction}
                                            handleDelete={handleTransactionDelete}/>
                })}
            </div>
        </div>
    );
}

export default Transactions;