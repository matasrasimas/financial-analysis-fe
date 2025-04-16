import React, {useEffect, useState} from "react";
import {LineChart} from '@mui/x-charts';
import {useAuth} from "../../auth/AuthContext.tsx";
import Cookies from "js-cookie";
import {DatePeriod, Transaction} from "../../types.ts";

const Home = () => {
    const {orgUnit} = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

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
        const fetchTransactions = async() => {
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
        }
        fetchTransactions();
    }, [orgUnit.id, period.from, period.to])

    const groupedByDate: Record<string, number> = {};

    transactions.forEach((t) => {
        const dateOnly = new Date(t.createdAt).toISOString().split('T')[0];
        groupedByDate[dateOnly] = (groupedByDate[dateOnly] || 0) + t.amount;
    });

    const sortedDates = Object.keys(groupedByDate).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const xData = sortedDates.map(dateStr => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit'
        });
    });
    const yData = sortedDates.map(date => groupedByDate[date]);
    const totalAmount = yData.reduce((sum, amount) => sum + amount, 0);
    const chartColor = totalAmount >= 0 ? '#065F46' : '#B91C1C';

    return (
        <div className='flex flex-col w-full items-center mt-10'>
            <div className="flex justify-between items-end mb-4 w-[850px]">
                <div className='flex flex-row gap-5'>
                    <div>
                        <p className="text-[40px] font-bold">{transactions.length}</p>
                        <p className="uppercase text-[18px] text-gray-400">Transakcijų sk.</p>
                    </div>
                    <div>
                        <p className="text-[40px] font-bold">
                            {transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)} €
                        </p>
                        <p className="uppercase text-[18px] text-gray-400">{totalAmount >= 0 ? 'Pelnas' : 'Nuostolis'}</p>
                    </div>
                </div>

                <div className="flex gap-3">
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
            </div>

            {transactions.length == 0 ? (
                <div className='flex w-[1000px] h-[300px] items-center justify-center'>
                    <h2 className="main-header text-[40px] mt-10">Transakcijų pagal pasirinktą laikotarpį nerasta</h2>
                </div>
            ) : (
                <LineChart
                    xAxis={[{
                        data: xData,
                        scaleType: 'band',
                    }]}
                    yAxis={[{
                        valueFormatter: (value) => `${value} €`,
                    }]}
                    series={[{
                        data: yData,
                        area: true,
                        curve: 'monotoneX',
                        color: chartColor,
                        showMark: false,
                        baseline: -3000000,
                        valueFormatter: (value) => `${value} €`,
                    }]}
                    width={1000}
                    height={600}
                    grid={{ horizontal: true, vertical: false }}
                    sx={{
                        '.MuiAreaElement-root': {
                            opacity: 0.3,
                        },
                    }}
                />
            )}


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
                                        setPeriod({ from: customFrom, to: customTo });
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
};

export default Home;