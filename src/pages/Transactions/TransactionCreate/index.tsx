import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {CreateTransaction, OrgUnit, OrgUnitCreate, Transaction, TransactionError} from "../../../types.ts";
import {useAuth} from "../../../auth/AuthContext.tsx";
import Cookies from "js-cookie";

const TransactionCreate = () => {
    const {organization, orgUnit, user} = useAuth();
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    const [transactionToCreate, setTransactionToCreate] = useState<CreateTransaction>({
        orgUnitId: '',
        userId: '',
        amount: 0,
        title: '',
        description: '',
        createdAt: today,
        isLocked: false
    });

    const [activeOrgUnit, setActiveOrgUnit] = useState<OrgUnit>();
    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
    const [transactionError, setTransactionError] = useState<TransactionError>({
        amount: '',
        title: '',
        createdAt: ''
    });

    useEffect(() => {
        const fetchOrgUnits = async () => {
            if (!organization?.id) return; // 🛡️ don't run if org is not ready

            try {
                const response = await fetch(`http://localhost:8080/api/organizations/${organization.id}/org-units`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data: OrgUnit[] = await response.json();

                    setOrgUnits(data);

                    if (data.length > 0) { // 🛡️ check if array is not empty
                        setActiveOrgUnit(data[0]);
                        setTransactionToCreate(prev => ({...prev, orgUnitId: data[0].id}));
                    }
                }
            } catch (error) {
                console.error("Error fetching org units:", error);
            }
        };

        fetchOrgUnits();
    }, [organization?.id]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setTransactionToCreate(prev => ({
            ...prev,
            [name]: name === "amount" ? parseFloat(value) : value
        }));
    }

    const validateInput = () => {
        const errors: TransactionError = {
            amount: transactionToCreate.amount == 0 ? 'error' : '',
            title: transactionToCreate.title.length == 0 ? 'error' : '',
            createdAt: transactionToCreate.createdAt.length == 0 ? 'error' : ''
        }
        setTransactionError(errors)
        return Object.values(errors).every(error => error === '');
    }

    const handleTransactionCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateInput()) {
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
                                userId: user.id,
                                title: transactionToCreate.title,
                                amount: transactionToCreate.amount,
                                createdAt: transactionToCreate.createdAt,
                                isLocked: false
                            }
                        ])
                });
                if (response.ok) {
                    navigate('/transactions')
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    const handleOrgUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.currentTarget.value;
        const selectedUnit = orgUnits.find((unit) => unit.id === selectedId);
        setActiveOrgUnit(selectedUnit);
        setTransactionToCreate(prev => ({...prev, orgUnitId: selectedId}));
    }

    return (
        <div className="flex flex-col items-center w-full mt-8">
            <form className='org-container h-[260px]' onSubmit={handleTransactionCreate}>
                <h2 className="org-form-header">Transakcijos kūrimas</h2>
                <div className='flex w-[37%] flex-col items-start h-[60px] px-10'>
                    <label className="org-input-label">Padalinys:</label>
                    <select
                        id="period"
                        onChange={handleOrgUnitChange}
                        className='org-input'
                    >
                        {orgUnits.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                                {unit.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='flex w-full justify-between px-10 gap-8 mt-5'>
                    <div className='flex w-full flex-col items-start h-[80px]'>
                        <label className='org-input-label' htmlFor='amount'>Suma:</label>
                        <input
                            type='number'
                            className={`org-input ${transactionError.amount ? 'border-red-500 border-[1px]' : 'border-[#dddddd] border-[1px]'}`}
                            name='amount'
                            value={transactionToCreate.amount}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex w-full flex-col items-start h-[80px]'>
                        <label className='org-input-label' htmlFor='title'>Pavadinimas:</label>
                        <input
                            type='text'
                            className={`org-input ${transactionError.title ? 'border-red-500 border-[1px]' : 'border-[#dddddd] border-[1px]'}`}
                            name='title'
                            value={transactionToCreate.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex w-full flex-col w-full items-start h-[60px]'>
                        <label className='org-input-label' htmlFor='createdAt'>Data:</label>
                        <input
                            type='date'
                            className={`org-input ${transactionError.createdAt ? 'border-red-500 border-[1px]' : 'border-[#dddddd] border-[1px]'}`}
                            name='createdAt'
                            value={transactionToCreate.createdAt}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <div className='flex flex-row w-full justify-end pr-5 gap-5'>
                    <Link
                        to='/select-transaction-creation'
                        className='flex items-center justify-center bg-red-600 w-[125px] h-[40px] text-white font-bold text-[16px] rounded-md cursor-pointer hover:text-yellow-500 self-end'>
                        Atšaukti
                    </Link>
                    <button
                        id='transaction-create-btn'
                        type='submit'
                        className='bg-[#00592b] w-[125px] h-[40px] text-white font-bold text-[16px] rounded-md cursor-pointer hover:text-yellow-500 self-end'>
                        Kurti
                    </button>
                </div>

            </form>
        </div>
    );
};

export default TransactionCreate;
