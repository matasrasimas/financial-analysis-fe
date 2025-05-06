import {AutomaticTransaction, OrgUnit, User} from "../../types.ts";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faPlus} from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../auth/AuthContext.tsx";
import Cookies from "js-cookie";
import './styles.css'
import AutomaticTransactionCard from "./AutomaticTransactionCard";

const AutomaticTransactions = () => {
    const [automaticTransactions, setAutomaticTransactions] = useState<AutomaticTransaction[]>([]);
    const {organization, user} = useAuth();
    const [users, setUsers] = useState<User[]>([])
    const navigate = useNavigate();

    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
    const [activeOrgUnit, setActiveOrgUnit] = useState<OrgUnit>();

    useEffect(() => {
        if(user.id !== organization.userId)
            navigate('/select-transaction-creation')
        const fetchOrgUnits = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/organizations/${organization.id}/org-units`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrgUnits(data);
                    setActiveOrgUnit(data[0]);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/users`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchOrgUnits();
        fetchUsers();
    }, [organization.id]);

    useEffect(() => {
        if (!activeOrgUnit) return;

        const fetchAutomaticTransactions = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/org-units/${activeOrgUnit.id}/automatic-transactions`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${Cookies.get('jwt')}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setAutomaticTransactions(data);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchAutomaticTransactions();
    }, [activeOrgUnit]);

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
        } catch (e) {
            console.log(e);
        }
    }

    const handleOrgUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.currentTarget.value;
        const selectedUnit = orgUnits.find((unit) => unit.id === selectedId);
        setActiveOrgUnit(selectedUnit);
    }

    return (
        <div className='flex flex-col w-full mt-5 items-center gap-8 relative'>
            <div className='org-unit-select-container flex p-5 bg-white'>
                <div className='flex flex-row gap-15'>
                    <div className='flex flex-row items-center text-center h-4/5 gap-5'>
                        <label className="font-sans font-bold">Padalinys:</label>
                        <select
                            id="period"
                            onChange={handleOrgUnitChange}
                            className="w-[200px] p-3 font-bold border border-gray-300 rounded-full shadow-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                        >
                            {orgUnits.map((unit) => (
                                <option key={unit.id} value={unit.id}>
                                    {unit.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

                <div className='org-container relative'>
                    <h2 className="org-form-header">Auomatinės transakcijos</h2>
                    <div className='org-units-table'>
                        <div className='flex justify-between bg-green-200 w-full h-[40px] items-center mt-3'>
                            <div className='flex w-full items-center justify-center'>
                                <h2>Suma, €</h2>
                            </div>
                            <div className='flex w-full items-center justify-center'>
                                <h2>Pavadinimas</h2>
                            </div>
                            <div className='flex w-full items-center justify-center'>
                                <h2>Sekanti transakcija</h2>
                            </div>
                            <div className='flex w-full items-center justify-center'>
                                <h2>Dažnis</h2>
                            </div>
                            <div className='flex w-full items-center justify-center'>
                                <h2>Veiksmai</h2>
                            </div>
                        </div>
                        {automaticTransactions.map((transaction) => (
                            <AutomaticTransactionCard
                                key={transaction.id}
                                automaticTransaction={transaction}
                                handleTransactionDelete={handleTransactionDelete}
                            />
                        ))}
                        <div className='block mb-10'></div>
                    </div>
                    <Link
                        to='/automatic-transaction-create'
                        className='absolute w-[40px] h-[40px] bg-[#00592b] top-0 items-center justify-center flex cursor-pointer'>
                        <FontAwesomeIcon icon={faPlus} className='text-white font-bold text-[20px]'/>
                    </Link>
                </div>


                {/*<h2 className="main-header text-[40px]">Transakcijos</h2>*/}
                {/*<div className='flex w-4/5 flex-row gap-5 justify-center items-center mt-3'>*/}
                {/*    <Link to='/automatic-transactions'>*/}
                {/*        <button*/}
                {/*            className='bg-blue-500 h-[50px] w-[220px] text-white font-bold font-(family-name:--roboto-font) hover:text-yellow-400 hover:cursor-pointer'*/}
                {/*        >*/}
                {/*            Automatinės transakcijos*/}
                {/*        </button>*/}
                {/*    </Link>*/}
                {/*    <Link to='/image-transactions'>*/}
                {/*        <button*/}
                {/*            className='bg-blue-500 h-[50px] w-[250px] text-white font-bold font-(family-name:--roboto-font) hover:text-yellow-400 hover:cursor-pointer'*/}
                {/*        >*/}
                {/*            Transakcijos pagal nuotrauką*/}
                {/*        </button>*/}
                {/*    </Link>*/}
                {/*</div>*/}
                {/*{!showCreateTransactionForm && (*/}
                {/*    <div className='flex flex-row w-4/5 items-center justify-center mt-6'>*/}
                {/*        <FontAwesomeIcon*/}
                {/*            onClick={() => {*/}
                {/*                setShowCreateTransactionForm(true)*/}
                {/*            }}*/}
                {/*            className='text-[65px] cursor-pointer'*/}
                {/*            icon={faCirclePlus}/>*/}
                {/*    </div>*/}

                {/*)}*/}

                {/*<div className='flex flex-col w-4/5 justify-end items-end gap-3'>*/}
                {/*    <div className="flex gap-3 justify-end items-end w-4/5">*/}
                {/*        <button*/}
                {/*            onClick={() => setPeriod(getCurrentMonthPeriod())}*/}
                {/*            className={`px-3 py-1 border rounded-full text-sm font-medium hover:bg-blue-100 transition*/}
                {/*       border-blue-500 text-blue-500 ${period.from == getCurrentMonthPeriod().from && period.to == getCurrentMonthPeriod().to && 'bg-blue-100'}`}*/}
                {/*        >*/}
                {/*            Mėnuo*/}
                {/*        </button>*/}

                {/*        <button*/}
                {/*            onClick={() => setPeriod(getCurrentWeekPeriod())}*/}
                {/*            className={`px-3 py-1 border rounded-full text-sm font-medium hover:bg-blue-100 transition*/}
                {/*       border-blue-500 text-blue-500 ${period.from === getCurrentWeekPeriod().from && period.to === getCurrentWeekPeriod().to && 'bg-blue-100'}`}*/}
                {/*        >*/}
                {/*            Savaitė*/}
                {/*        </button>*/}

                {/*        <button*/}
                {/*            onClick={() => setShowDateModal(true)}*/}
                {/*            className={`px-3 py-1 border rounded-full text-sm font-medium hover:bg-blue-100 transition*/}
                {/*       border-blue-500 text-blue-500 */}
                {/*       ${!(period.from == getCurrentMonthPeriod().from && period.to == getCurrentMonthPeriod().to)*/}
                {/*            && !(period.from === getCurrentWeekPeriod().from && period.to === getCurrentWeekPeriod().to) && 'bg-blue-100'}*/}
                {/*       `}*/}
                {/*        >*/}
                {/*            Pasirinkti*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*    {transactions.length > 0 && (*/}
                {/*        <div className='flex flex-col w-4/5 items-end justify-end gap-3'>*/}
                {/*            <p className='font-bold text-[18px]'>Rastų transakcijų skaičius: {transactions.length}</p>*/}
                {/*            <button*/}
                {/*                type='button'*/}
                {/*                onClick={promptGemini}*/}
                {/*                className='bg-black w-[150px] h-[50px] text-white font-bold text-[2špx] rounded-md cursor-pointer hover:text-yellow-500 mr-10'>*/}
                {/*                Generuoti išvadas*/}
                {/*            </button>*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*</div>*/}


                {/*{transactions.length == 0 && !showCreateTransactionForm && (*/}
                {/*    <h2 className="main-header text-[40px] mt-10">Transakcijų pagal pasirinktą laikotarpį nerasta</h2>*/}
                {/*)}*/}

                {/*<div className='flex flex-col w-full items-center gap-10 my-10'>*/}
                {/*    {showCreateTransactionForm && (*/}
                {/*        <TransactionCreateForm*/}
                {/*            handleCreate={handleTransactionCreate}*/}
                {/*            closeTransactionCreateForm={handleCloseTransactionCreateForm}/>*/}
                {/*    )}*/}
                {/*    {transactions.map((transaction: Transaction) => {*/}
                {/*        return <TransactionCard key={transaction.id} transaction={transaction}*/}
                {/*                                handleDelete={handleTransactionDelete}/>*/}
                {/*    })}*/}
                {/*</div>*/}
                {/*{showDateModal && (*/}
                {/*    <>*/}
                {/*        <div className="fixed inset-0 bg-black opacity-50 z-10"></div>*/}

                {/*        <div className="fixed inset-0 flex items-center justify-center z-20">*/}
                {/*            <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col gap-4 w-[300px]">*/}
                {/*                <h2 className="text-xl font-semibold">Pasirinkite laikotarpį</h2>*/}
                {/*                <div className="flex flex-col gap-2">*/}
                {/*                    <label>*/}
                {/*                        Nuo:*/}
                {/*                        <input*/}
                {/*                            type="date"*/}
                {/*                            value={customFrom}*/}
                {/*                            onChange={(e) => setCustomFrom(e.target.value)}*/}
                {/*                            className={`border p-2 rounded w-full ${*/}
                {/*                                new Date(customFrom) > new Date(customTo) ? 'border-red-500' : ''*/}
                {/*                            }`}*/}
                {/*                        />*/}
                {/*                    </label>*/}
                {/*                    <label>*/}
                {/*                        Iki:*/}
                {/*                        <input*/}
                {/*                            type="date"*/}
                {/*                            value={customTo}*/}
                {/*                            onChange={(e) => setCustomTo(e.target.value)}*/}
                {/*                            className={`border p-2 rounded w-full ${*/}
                {/*                                new Date(customFrom) > new Date(customTo) ? 'border-red-500' : ''*/}
                {/*                            }`}*/}
                {/*                        />*/}
                {/*                    </label>*/}
                {/*                </div>*/}
                {/*                <div className="flex justify-end gap-2">*/}
                {/*                    <button*/}
                {/*                        onClick={() => setShowDateModal(false)}*/}
                {/*                        className="px-3 py-1 text-sm bg-gray-200 rounded"*/}
                {/*                    >*/}
                {/*                        Atšaukti*/}
                {/*                    </button>*/}
                {/*                    <button*/}
                {/*                        onClick={() => {*/}
                {/*                            if (new Date(customFrom) > new Date(customTo)) {*/}
                {/*                                return; // Don't proceed if validation fails*/}
                {/*                            }*/}
                {/*                            setPeriod({from: customFrom, to: customTo});*/}
                {/*                            setShowDateModal(false);*/}
                {/*                        }}*/}
                {/*                        className={`px-3 py-1 text-sm text-white rounded ${*/}
                {/*                            new Date(customFrom) > new Date(customTo)*/}
                {/*                                ? 'bg-gray-400 cursor-not-allowed'*/}
                {/*                                : 'bg-blue-500'*/}
                {/*                        }`}*/}
                {/*                        disabled={new Date(customFrom) > new Date(customTo)}*/}
                {/*                    >*/}
                {/*                        Patvirtinti*/}
                {/*                    </button>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </>*/}
                {/*)}*/}

                {/*{showGeminiOutputModal && (*/}
                {/*    <>*/}
                {/*        <div className="fixed inset-0 bg-black opacity-50 z-10"></div>*/}

                {/*        <div className="fixed inset-0 flex items-center justify-center z-20">*/}
                {/*            <div className="rounded-xl shadow-xl flex flex-col gap-4 w-4/5 h-4/5 items-center bg-gray-800">*/}
                {/*                <div*/}
                {/*                    onClick={() => handleGeminiOutputModalClose()}*/}
                {/*                    className='flex w-full pr-5 pt-2 font-bold cursor-pointer items-center gap-2 text-[20px] text-red-500 justify-end h-[30px] z-30'>*/}
                {/*                    <FontAwesomeIcon icon={faX} />*/}
                {/*                    <p>Uždaryti</p>*/}
                {/*                </div>*/}
                {/*                {isGenerating ? (*/}
                {/*                    <div className="spinner-container">*/}
                {/*                        <div className="spinner"></div>*/}
                {/*                        <p className='font-bold text-[30px] text-white'>Generuojama...</p>*/}
                {/*                    </div>*/}
                {/*                ) : (*/}
                {/*                    <div className='flex w-full px-10 py-5 overflow-y-auto overflow-x-hidden max-h-full'>*/}
                {/*                        <p*/}
                {/*                            dangerouslySetInnerHTML={{ __html: typedText }}*/}
                {/*                            className='text-white text-justify leading-[30px] mb-10'></p>*/}
                {/*                    </div>*/}
                {/*                )}*/}

                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </>*/}
                {/*)}*/}

            <Link
                to='/select-transaction-creation'
                className='flex absolute gap-3 font-bold text-[20px] underline underline-offset-2 self-start ml-10 hover:text-blue-500'>
                <div className='block'>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <h2>Atgal</h2>
            </Link>
        </div>
    );
}

export default AutomaticTransactions;