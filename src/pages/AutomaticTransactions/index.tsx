import {AutomaticTransaction, CreateAutomaticTransaction} from "../../types.ts";
import React, {useEffect, useState} from "react";
import AutomaticTransactionCard from "./AutomaticTransactionCard";
import {faArrowLeft, faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import AutomaticTransactionCreateForm from "./AutomaticTransactionCreateForm";
import {useAuth} from "../../auth/AuthContext.tsx";
import Cookies from "js-cookie";

const AutomaticTransactionsIcons = () => {
    const [automaticTransactions, setAutomaticTransactions] = useState<AutomaticTransaction[]>([]);
    const [showCreateTransactionForm, setShowCreateTransactionForm] = useState(false);
    const {orgUnit} = useAuth();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/org-units/${orgUnit.id}/automatic-transactions`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setAutomaticTransactions(data);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, [orgUnit.id]);

    const handleTransactionDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/automatic-transactions/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                setAutomaticTransactions(automaticTransactions.filter((transaction) => transaction.id !== id));
            }
        } catch(e) {
            console.log(e);
        }
    }

    const handleTransactionCreate = async (transactionToCreate: CreateAutomaticTransaction) => {
        try {
            const response = await fetch('http://localhost:8080/api/automatic-transactions', {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        orgUnitId: transactionToCreate.orgUnitId,
                        amount: transactionToCreate.amount,
                        title: transactionToCreate.title,
                        description: transactionToCreate.description.length == 0 ? null : transactionToCreate.description,
                        duration: transactionToCreate.duration,
                        durationUnit: transactionToCreate.durationUnit,
                    }
                )
            });

            if (response.ok) {
                const data = await response.json();
                setAutomaticTransactions([
                    {
                        id: data.id,
                        orgUnitId: data.orgUnitId,
                        amount: data.amount,
                        title: data.title,
                        description: data.description && data.description.length == 0 ? null : data.description,
                        duration: data.duration,
                        durationUnit: data.durationUnit,
                    },
                    ...automaticTransactions
                ]);
                setShowCreateTransactionForm(false);
            }
        } catch(e) {
            console.error(e);
        }
    }

    return (
        <div className='flex flex-col w-full mt-10 items-center relative'>
            <h2 className="main-header text-[2em] sm:text-[3em]">Automatinės Transakcijos</h2>
            <Link
                to='/transactions'
                className='flex absolute gap-3 font-bold text-[25px] underline underline-offset-2 self-start ml-10 hover:text-blue-500'>
                <div className='block'>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <h2>Atgal</h2>
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