import {CreateTransaction, DatePeriod, OrgUnit, Transaction, User} from "../../types.ts";
import TransactionCard from "./TransactionCard";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {useAuth} from "../../auth/AuthContext.tsx";
import Cookies from "js-cookie";
import './styles.css'

const Transactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const {organization} = useAuth();
    const [geminiOutput, setGeminiOutput] = useState<string>('')
    const [showGeminiOutputModal, setShowGeminiOutputModal] = useState<boolean>(false);
    const [typedText, setTypedText] = useState('');
    const [index, setIndex] = useState(0);
    const [users, setUsers] = useState<User[]>([])

    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
    const [activeOrgUnit, setActiveOrgUnit] = useState<OrgUnit>();

    useEffect(() => {
        if (showGeminiOutputModal && geminiOutput && index < geminiOutput.length) {
            const timeout = setTimeout(() => {
                setTypedText((prev) => prev + geminiOutput.charAt(index));
                setIndex((prev) => prev + 1);
            }, 30);
            return () => clearTimeout(timeout);
        }
    }, [index, geminiOutput, showGeminiOutputModal]);

    useEffect(() => {
        if (showGeminiOutputModal) {
            setTypedText('');
            setIndex(0);
        }
    }, [geminiOutput, showGeminiOutputModal]);

    const getCurrentMonthPeriod = (): DatePeriod => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const monthFrom = new Date(year, month, 1);
        const monthTo = new Date(year, month + 1, 1);

        return {
            from: monthFrom.toISOString().split('T')[0],
            to: monthTo.toISOString().split('T')[0]
        }
    }

    const [period, setPeriod] = useState<DatePeriod>(getCurrentMonthPeriod());
    const [selectedPeriod, setSelectedPeriod] = useState<string>("Šis mėnuo");
    const [periodError, setPeriodError] = useState<string>('');

    useEffect(() => {
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
        if (!activeOrgUnit || !period.from || !period.to) return;

        const fetchTransactions = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/org-units/${activeOrgUnit.id}/transactions?from=${period.from}&to=${period.to}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${Cookies.get('jwt')}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setTransactions(data);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, [activeOrgUnit, period.from, period.to]);

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

    const handleOrgUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.currentTarget.value;
        const selectedUnit = orgUnits.find((unit) => unit.id === selectedId);
        setActiveOrgUnit(selectedUnit);
    }

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const period = e.target.value;
        setSelectedPeriod(period);

        if (period !== "Pasirinkti") {
            setPeriodError('')
            const today = new Date();
            let exportFrom = "";
            let exportTo = today.toISOString().split("T")[0];
            const year = today.getFullYear();
            const month = today.getMonth();

            if (period === "Ši savaitė") {
                const today = new Date();

                const dayOfWeek = today.getDay();

                const monday = new Date(today);
                monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);

                exportFrom = monday.toISOString().split("T")[0];
                exportTo = sunday.toISOString().split("T")[0];
            } else if (period === "Šis mėnuo") {
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                exportFrom = startOfMonth.toISOString().split("T")[0];
                exportTo = new Date(year, month + 1, 1).toISOString().split("T")[0];
            } else if (period === "Praeitas mėnesis") {
                const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                exportFrom = startOfLastMonth.toISOString().split("T")[0];
                exportTo = endOfLastMonth.toISOString().split("T")[0];
            }

            setPeriod({
                from: exportFrom,
                to: exportTo
            })
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPeriod((prev) => {
            const updatedPeriod = {
                ...prev,
                [name]: value,
            };
            if (!validatePeriod(updatedPeriod))
                return prev;
            return updatedPeriod;
        });
    };

    const validatePeriod = (input: DatePeriod): boolean => {
        let errorFound = false;
        if (input.from == '' || input.from == '') {
            errorFound = true;
            setPeriodError('Periodas yra privalomas')
        } else if (input.from > input.to) {
            errorFound = true;
            setPeriodError('Pradžios data negali būti didesnė už pabaigos datą')
        }
        if (!errorFound) {
            setPeriodError('')
            return true
        } else return false
    }

    const handleTransactionLock = async (id: string) => {
        const foundTransaction = transactions.find(t => t.id === id);
        if(foundTransaction) {
            try {
                const response = await fetch(`http://localhost:8080/api/transactions`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify([{
                        ...foundTransaction,
                        isLocked: !foundTransaction.isLocked,
                    }])
                });
                if (response.ok) {
                    setTransactions(transactions.map(t => t.id == id ? {...t, isLocked: !t.isLocked} : t))
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    return (
        <div className='flex flex-col w-full mt-5 items-center gap-8'>
            <div className='flex w-4/5'>
                <div className='org-unit-select-container flex-col justify-center h-[220px] items-center w-full'>
                    <label className='settings-header text-[18px]'>Transakcijų pasirinkimai</label>
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

                        <div className='flex flex-col gap-5 pt-5 items-center'>
                            <div className="flex flex-row gap-3 items-center text-center">
                                <div className="flex">
                                    <label htmlFor="period" className="font-sans font-bold">Periodas:</label>
                                </div>
                                <select
                                    id="period"
                                    onChange={handlePeriodChange}
                                    className="w-[250px] font-bold p-3 border border-gray-300 rounded-full shadow-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                                >
                                    <option>Šis mėnuo</option>
                                    <option>Ši savaitė</option>
                                    <option>Praeitas mėnesis</option>
                                    <option>Pasirinkti</option>
                                </select>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="flex flex-row gap-4">
                                    <div className="flex flex-col items-center">
                                        <label className="text-sm font-semibold font-semibold">Nuo:</label>
                                        <input
                                            type="date"
                                            name="from"
                                            value={period.from}
                                            onChange={handleDateChange}
                                            disabled={selectedPeriod !== "Pasirinkti"}
                                            className={`p-2 font-bold border rounded-md focus:ring-2 focus:ring-blue-500
                                     focus:outline-none disabled:bg-gray-200 ${periodError ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <label className="text-sm font-semibold">Iki:</label>
                                        <input
                                            type="date"
                                            name="to"
                                            value={period.to}
                                            onChange={handleDateChange}
                                            disabled={selectedPeriod !== "Pasirinkti"}
                                            className={`p-2 border font-bold border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500
                                     focus:outline-none disabled:bg-gray-200 ${periodError ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    </div>
                                </div>
                                <p className='text-red-500 text-[14px]'>{periodError}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='org-container relative'>
                <h2 className="org-form-header">Transakcijos</h2>
                <div className='org-units-table'>
                    <div className='flex justify-between bg-green-200 w-full h-[40px] items-center mt-3'>
                        <div className='flex w-full items-center justify-center'>
                            <h2>Suma, €</h2>
                        </div>
                        <div className='flex w-full items-center justify-center'>
                            <h2>Pavadinimas</h2>
                        </div>
                        <div className='flex w-full items-center justify-center'>
                            <h2>Data</h2>
                        </div>
                        <div className='flex w-full items-center justify-center'>
                            <h2>Sukūrė</h2>
                        </div>
                        <div className='flex w-full items-center justify-center'>
                            <h2>Veiksmai</h2>
                        </div>
                    </div>
                    {transactions.map((transaction) => (
                        <TransactionCard
                            key={transaction.id}
                            transaction={transaction}
                            handleTransactionDelete={handleTransactionDelete}
                            author={users.find(u => u.id === transaction.userId)}
                            handleTransactionLock={handleTransactionLock}
                        />
                    ))}
                    <div className='block mb-10'></div>
                </div>
                <Link
                    to='/select-transaction-creation'
                    className='absolute w-[40px] h-[40px] bg-[#00592b] top-0 items-center justify-center flex cursor-pointer'>
                    <FontAwesomeIcon icon={faPlus} className='text-white font-bold text-[20px]' />
                </Link>
            </div>
        </div>
    );
}

export default Transactions;