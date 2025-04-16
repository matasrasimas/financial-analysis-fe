import {CreateTransaction, DatePeriod, Transaction} from "../../types.ts";
import TransactionCard from "./TransactionCard";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import TransactionCreateForm from "./TransactionCreateForm";
import {Link} from "react-router-dom";
import {useAuth} from "../../auth/AuthContext.tsx";
import Cookies from "js-cookie";

const Transactions = () => {
    const [showCreateTransactionForm, setShowCreateTransactionForm] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const {orgUnit} = useAuth();

    const getCurrentMonthPeriod = (): DatePeriod => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const monthFrom = new Date(year, month, 1);
        const monthTo = new Date(year, month + 1, 0);

        return {
            from: monthFrom.toISOString().split('T')[0],
            to: monthTo.toISOString().split('T')[0]
        }
    }

    const getCurrentWeekPeriod = (): DatePeriod => {
        const today = new Date();
        const day = today.getDay();
        const diffToMonday = (day === 0 ? -6 : 1) - day;

        const weekFrom = new Date(today);
        weekFrom.setDate(today.getDate() + diffToMonday);

        const weekTo = new Date(weekFrom);
        weekTo.setDate(weekFrom.getDate() + 6);

        return {
            from: weekFrom.toISOString().split('T')[0],
            to: weekTo.toISOString().split('T')[0]
        }
    }

    const [period, setPeriod] = useState<DatePeriod>(getCurrentMonthPeriod());
    const [showDateModal, setShowDateModal] = useState(false);
    const [customFrom, setCustomFrom] = useState(period.from);
    const [customTo, setCustomTo] = useState(period.to);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/org-units/${orgUnit.id}/transactions?from=${period.from}&to=${period.to}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setTransactions(data);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, [orgUnit.id, period.from, period.to]);

    const handleTransactionDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/transactions/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                setTransactions(transactions.filter((transaction) => transaction.id !== id));
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleTransactionCreate = async (transactionToCreate: CreateTransaction) => {
        try {
            const response = await fetch('http://localhost:8080/api/transactions', {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    [
                        {
                            orgUnitId: transactionToCreate.orgUnitId,
                            amount: transactionToCreate.amount,
                            title: transactionToCreate.title,
                            description: transactionToCreate.description.length == 0 ? null : transactionToCreate.description,
                            createdAt: transactionToCreate.createdAt
                        }
                    ]
                )
            });
            if (response.ok) {
                const data = await response.json();
                setTransactions([
                    {
                        id: data.id,
                        orgUnitId: data.orgUnitId,
                        amount: data.amount,
                        title: data.title,
                        description: data.description,
                        createdAt: data.createdAt,
                    },
                    ...transactions
                ]);
                setShowCreateTransactionForm(false);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleCloseTransactionCreateForm = () => {
        setShowCreateTransactionForm(false);
    }

    return (
        <div className='flex flex-col w-full mt-3 items-center'>
            <h2 className="main-header text-[2em] sm:text-[3em]">Transakcijos</h2>
            <div className='flex w-4/5 flex-row gap-5 justify-center items-center mt-5'>
                <Link to='/automatic-transactions'>
                    <button
                        className='bg-blue-500 h-[50px] w-[220px] text-white font-bold font-(family-name:--roboto-font) hover:text-yellow-400 hover:cursor-pointer'
                    >
                        Automatinės transakcijos
                    </button>
                </Link>
                {/*<Link to='/image-transactions'>*/}
                {/*    <button*/}
                {/*        className='bg-blue-500 h-[50px] w-[250px] text-white font-bold font-(family-name:--roboto-font) hover:text-yellow-400 hover:cursor-pointer'*/}
                {/*    >*/}
                {/*        Transakcijos pagal nuotrauką*/}
                {/*    </button>*/}
                {/*</Link>*/}
            </div>
            {!showCreateTransactionForm && (
                <div className='flex flex-row w-4/5 items-center justify-center my-6'>
                    <FontAwesomeIcon
                        onClick={() => {
                            setShowCreateTransactionForm(true)
                        }}
                        className='text-[80px] cursor-pointer'
                        icon={faCirclePlus}/>
                </div>

            )}

            {!showCreateTransactionForm}
            <div className="flex gap-3 justify-end items-end w-4/5">
                <button
                    onClick={() => setPeriod(getCurrentMonthPeriod())}
                    className={`px-3 py-1 border rounded-full text-sm font-medium hover:bg-blue-100 transition
                   border-blue-500 text-blue-500 ${period.from == getCurrentMonthPeriod().from && period.to == getCurrentMonthPeriod().to && 'bg-blue-100'}`}
                >
                    Mėnuo
                </button>

                <button
                    onClick={() => setPeriod(getCurrentWeekPeriod())}
                    className={`px-3 py-1 border rounded-full text-sm font-medium hover:bg-blue-100 transition
                   border-blue-500 text-blue-500 ${period.from === getCurrentWeekPeriod().from && period.to === getCurrentWeekPeriod().to && 'bg-blue-100'}`}
                >
                    Savaitė
                </button>

                <button
                    onClick={() => setShowDateModal(true)}
                    className={`px-3 py-1 border rounded-full text-sm font-medium hover:bg-blue-100 transition
                   border-blue-500 text-blue-500 
                   ${!(period.from == getCurrentMonthPeriod().from && period.to == getCurrentMonthPeriod().to)
                    && !(period.from === getCurrentWeekPeriod().from && period.to === getCurrentWeekPeriod().to) && 'bg-blue-100'}
                   `}
                >
                    Pasirinkti
                </button>

            </div>

            {transactions.length == 0 && !showCreateTransactionForm && (
                <h2 className="main-header text-[40px] mt-10">Transakcijų pagal pasirinktą laikotarpį nerasta</h2>
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
            {showDateModal && (
                <>
                    <div className="fixed inset-0 bg-black opacity-50 z-10"></div>

                    <div className="fixed inset-0 flex items-center justify-center z-20">
                        <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col gap-4 w-[300px]">
                            <h2 className="text-xl font-semibold">Pasirinkite laikotarpį</h2>
                            <div className="flex flex-col gap-2">
                                <label>
                                    Nuo:
                                    <input
                                        type="date"
                                        value={customFrom}
                                        onChange={(e) => setCustomFrom(e.target.value)}
                                        className={`border p-2 rounded w-full ${
                                            new Date(customFrom) > new Date(customTo) ? 'border-red-500' : ''
                                        }`}
                                    />
                                </label>
                                <label>
                                    Iki:
                                    <input
                                        type="date"
                                        value={customTo}
                                        onChange={(e) => setCustomTo(e.target.value)}
                                        className={`border p-2 rounded w-full ${
                                            new Date(customFrom) > new Date(customTo) ? 'border-red-500' : ''
                                        }`}
                                    />
                                </label>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowDateModal(false)}
                                    className="px-3 py-1 text-sm bg-gray-200 rounded"
                                >
                                    Atšaukti
                                </button>
                                <button
                                    onClick={() => {
                                        if (new Date(customFrom) > new Date(customTo)) {
                                            return; // Don't proceed if validation fails
                                        }
                                        setPeriod({from: customFrom, to: customTo});
                                        setShowDateModal(false);
                                    }}
                                    className={`px-3 py-1 text-sm text-white rounded ${
                                        new Date(customFrom) > new Date(customTo)
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-500'
                                    }`}
                                    disabled={new Date(customFrom) > new Date(customTo)}
                                >
                                    Patvirtinti
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Transactions;