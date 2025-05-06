import React, {useEffect, useState} from "react";
import {AutomaticTransaction, AutomaticTransactionError, CreateAutomaticTransaction} from '../../types.ts'
import {useAuth} from "../../auth/AuthContext.tsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {OrgUnit} from "../../types.ts";
import Cookies from "js-cookie";

const AutomaticTransactionEdit = () => {
    const {id} = useParams();
    const {organization, orgUnit} = useAuth();
    const navigate = useNavigate();

    const [activeOrgUnit, setActiveOrgUnit] = useState<OrgUnit>();
    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);

    const [transactionToEdit, setTransactionToEdit] = useState<CreateAutomaticTransaction>(
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
        const fetchOrgUnits = async () => {
            if (!organization?.id) return;
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
                }
            } catch (error) {
                console.error("Error fetching org units:", error);
            }
        };

        fetchOrgUnits();
    }, [organization?.id]);  // <- Only depend on organization

    useEffect(() => {
        const fetchTransaction = async () => {
            if (!organization?.id || orgUnits.length === 0) return;

            try {
                const response = await fetch(`http://localhost:8080/api/automatic-transactions`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data: AutomaticTransaction[] = await response.json();
                    const foundTransaction = data.find(t => t.id == id)
                    if (foundTransaction !== undefined) {
                        setTransactionToEdit({
                            orgUnitId: foundTransaction.orgUnitId,
                            amount: foundTransaction.amount,
                            title: foundTransaction.title,
                            description: foundTransaction.description,
                            duration: foundTransaction.duration,
                            durationUnit: foundTransaction.durationUnit,
                        });
                        setActiveOrgUnit(orgUnits.find((unit) => unit.id === foundTransaction.orgUnitId))
                    }
                }
            } catch (error) {
                console.error("Error fetching transaction:", error);
            }
        };

        fetchTransaction();
    }, [id, organization?.id, orgUnits]); // <- depend on orgUnits


    const handleOrgUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.currentTarget.value;
        const selectedUnit = orgUnits.find((unit) => unit.id === selectedId);
        setActiveOrgUnit(selectedUnit);
        setTransactionToEdit(prev => ({...prev, orgUnitId: selectedId}));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTransactionToEdit({...transactionToEdit, [e.target.name]: e.target.value});
    }

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTransactionToEdit({...transactionToEdit, [e.target.name]: e.target.value});
    };

    const validateInput = () => {
        const errors: AutomaticTransactionError = {
            amount: transactionToEdit.amount == 0 ? 'error' : '',
            title: transactionToEdit.title.length == 0 ? 'error' : '',
            duration: transactionToEdit.duration <= 0 ? 'error' : ''
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
                        id: id,
                        orgUnitId: transactionToEdit.orgUnitId,
                        title: transactionToEdit.title,
                        amount: transactionToEdit.amount,
                        duration: transactionToEdit.duration,
                        durationUnit: transactionToEdit.durationUnit
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
                <h2 className="org-form-header">Transakcijos redagavimas</h2>
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
                            value={transactionToEdit.amount}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex w-full flex-col items-start h-[80px]'>
                        <label className='org-input-label' htmlFor='title'>Pavadinimas:</label>
                        <input
                            type='text'
                            className={`org-input ${transactionError.title ? 'border-red-500 border-[1px]' : 'border-[#dddddd] border-[1px]'}`}
                            name='title'
                            value={transactionToEdit.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex w-full flex-col items-start h-[80px]'>
                        <label className='org-input-label'>Dažnis:</label>
                        <div className='flex flex-row gap-3 w-full'>
                            <input
                                type='number'
                                name='duration'
                                value={transactionToEdit.duration}
                                onChange={handleChange}
                                className={`org-input ${transactionError.duration ? 'border-red-500 border-[1px]' : 'border-[#dddddd] border-[1px]'}`}/>
                            <select
                                className='org-input'
                                name='durationUnit'
                                onChange={handleDropdownChange}
                                value={transactionToEdit.durationUnit}
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

    );
}

export default AutomaticTransactionEdit;