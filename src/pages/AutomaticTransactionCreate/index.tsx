import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins, faMessage, faStopwatch} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import type {AutomaticTransactionError, CreateAutomaticTransaction} from '../../types.ts'
import {useAuth} from "../../auth/AuthContext.tsx";
import {Link, useNavigate} from "react-router-dom";
import {CreateTransaction, OrgUnit, TransactionError} from "../../types.ts";
import Cookies from "js-cookie";
import transactionCard from "../Transactions/TransactionCard";

const AutomaticTransactionCreate = () => {
    const {organization, orgUnit, user} = useAuth();
    const navigate = useNavigate();

    const [activeOrgUnit, setActiveOrgUnit] = useState<OrgUnit>();
    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);

    const [transactionToCreate, setTransactionToCreate] = useState<CreateAutomaticTransaction>(
        {
            orgUnitId: '',
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

    useEffect(() => {
        if (user.id !== organization.userId)
            navigate('/select-transaction-creation');
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
                        setTransactionToCreate({...transactionToCreate, orgUnitId: data[0].id});
                    }
                }
            } catch (error) {
                console.error("Error fetching org units:", error);
            }
        };

        fetchOrgUnits();
    }, [organization.id]);

    const handleOrgUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.currentTarget.value;
        const selectedUnit = orgUnits.find((unit) => unit.id === selectedId);
        setActiveOrgUnit(selectedUnit);
        setTransactionToCreate(prev => ({...prev, orgUnitId: selectedId}));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTransactionToCreate({...transactionToCreate, [e.target.name]: e.target.value});
    }

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTransactionToCreate({...transactionToCreate, [e.target.name]: e.target.value});
        console.log(transactionToCreate)
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

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (validateInput()) {
            try {
                const response = await fetch(`http://localhost:8080/api/automatic-transactions`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        orgUnitId: transactionToCreate.orgUnitId,
                        title: transactionToCreate.title,
                        amount: transactionToCreate.amount,
                        duration: transactionToCreate.duration,
                        durationUnit: transactionToCreate.durationUnit
                    })
                });

                if (response.ok) {
                    navigate('/automatic-transactions');
                }
            } catch (error) {
                console.error("Error fetching org units:", error);
            }
        }
    }

    return (
        <div className="flex flex-col items-center w-full mt-8">
            <form className='org-container h-[260px]' onSubmit={submitForm}>
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
                    <div className='flex w-3/5 flex-col items-start h-[80px]'>
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
                    <div className='flex w-full flex-col items-start h-[80px]'>
                        <label className='org-input-label'>Dažnis:</label>
                        <div className='flex flex-row gap-3 w-full'>
                            <input
                                type='number'
                                name='duration'
                                value={transactionToCreate.duration}
                                onChange={handleChange}
                                className={`org-input ${transactionError.duration ? 'border-red-500 border-[1px]' : 'border-[#dddddd] border-[1px]'}`}/>
                            <select
                                className='org-input'
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

                </div>

                <div className='flex flex-row w-full justify-end pr-5 gap-5'>
                    <Link
                        to='/automatic-transactions'
                        className='flex items-center justify-center bg-red-600 w-[125px] h-[40px] text-white font-bold text-[16px] rounded-md cursor-pointer hover:text-yellow-500 self-end'>
                        Atšaukti
                    </Link>
                    <button
                        type='submit'
                        className='bg-[#00592b] w-[125px] h-[40px] text-white font-bold text-[16px] rounded-md cursor-pointer hover:text-yellow-500 self-end'>
                        Kurti
                    </button>
                </div>

            </form>
        </div>
        // <div className='flex flex-col w-11/12 lg:w-4/5 border-b-[3px] p-[20px] gap-5 bg-gray-300'>
        //     <div className='flex flex-row gap-5'>
        //         <div className='hidden md:block'>
        //             <FontAwesomeIcon icon={faCoins}/>
        //         </div>
        //         <div className='flex flex-row gap-5 text-[20px] items-center justify-center sm:justify-start'>
        //             <label htmlFor='amount' className='flex w-[150px]'>Kiekis:</label>
        //             <input
        //                 type='number'
        //                 name='amount'
        //                 value={transactionToCreate.amount}
        //                 onChange={handleChange}
        //                 className={`border-b-3 border-black outline-none appearance-none w-[100px]
        //                 font-bold ${transactionToCreate.amount > 0 ? 'text-green-600' : 'text-red-600'} ${transactionError.amount ? 'border-red-500' : 'border-black'}`}/>
        //         </div>
        //     </div>
        //     <div className='flex flex-row gap-5'>
        //         <div className='hidden md:flex items-center justify-center'>
        //             <FontAwesomeIcon icon={faMessage}/>
        //         </div>
        //         <div className='flex flex-col justify-start items-start gap-2 text-[20px] overflow-hidden'>
        //             <div className='flex flex-row: gap-3 items-start justify-center'>
        //                 <label htmlFor='title' className='flex w-[150px]'>Pavadinimas:</label>
        //                 <input
        //                     type='text'
        //                     name='title'
        //                     value={transactionToCreate.title}
        //                     onChange={handleChange}
        //                     className={`font-bold border-b-3 outline-none appearance-none md:w-[500px] ${transactionError.title ? 'border-red-500' : 'border-black'}`}/>
        //             </div>
        //             <div className='flex flex-row gap-3'>
        //                 <label htmlFor='description' className='flex w-[150px]'>Komentaras:</label>
        //                 <input
        //                     type='text'
        //                     name='description'
        //                     value={transactionToCreate.description}
        //                     onChange={handleChange}
        //                     className='font-bold border-b-3 border-black outline-none appearance-none md:w-[500px]'/>
        //             </div>
        //         </div>
        //     </div>
        //     <div className='flex flex-row gap-5 text-[20px] justify-between'>
        //         <div className='flex flex-row gap-5'>
        //             <div className='hidden md:block'>
        //                 <FontAwesomeIcon icon={faStopwatch}/>
        //             </div>
        //             <div className='flex flex-row gap-3'>
        //                 <label htmlFor='duration' className='flex w-[150px]'>Trukmė:</label>
        //                 <input
        //                     type='number'
        //                     name='duration'
        //                     value={transactionToCreate.duration}
        //                     onChange={handleChange}
        //                     className={`font-bold border-b-3 outline-none appearance-none w-[100px] ${transactionError.duration ? 'border-red-500' : 'border-black'}`}/>
        //                 <select
        //                     className='bg-white rounded-lg w-[120px]'
        //                     name='durationUnit'
        //                     onChange={handleDropdownChange}
        //                     value={transactionToCreate.durationUnit}
        //                 >
        //                     <option value='MINUTES'>minutės</option>
        //                     <option value='HOURS'>valandos</option>
        //                     <option value='DAYS'>dienos</option>
        //
        //                 </select>
        //             </div>
        //         </div>
        //         <div className='hidden md:flex flex-col justify-center gap-5 w-1/5 items-center sm:items-end my-2'>
        //             <div className='flex flex-row justify-center text-center text-[18px]'>
        //                 <button
        //                     className='bg-blue-500 text-white font-bold w-[100px] h-[30px] border-white border-2 cursor-pointer hover:text-yellow-300'
        //                     onClick={() => submitForm()}>Kurti
        //                 </button>
        //                 <button
        //                     className='bg-red-500 text-white font-bold w-[100px] h-[30px] border-white border-2 cursor-pointer hover:text-yellow-300'
        //                     onClick={() => closeTransactionCreateForm()}>Atšaukti
        //                 </button>
        //             </div>
        //         </div>
        //     </div>
        //     <div className='md:hidden flex flex-col justify-center gap-5 w-full items-center sm:items-end my-2'>
        //         <div className='flex flex-row justify-center text-center text-[18px] items-center'>
        //             <button
        //                 className='bg-blue-500 text-white font-bold w-[100px] h-[30px] border-white border-2 cursor-pointer hover:text-yellow-300'
        //                 onClick={() => submitForm()}>Create
        //             </button>
        //             <button
        //                 className='bg-red-500 text-white font-bold w-[100px] h-[30px] border-white border-2 cursor-pointer hover:text-yellow-300'
        //                 onClick={() => closeTransactionCreateForm()}>Cancel
        //             </button>
        //         </div>
        //     </div>
        // </div>
    );
}

export default AutomaticTransactionCreate;