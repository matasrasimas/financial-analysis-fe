import React, {useEffect, useState} from "react";
import {BarChart, PieChart} from '@mui/x-charts';
import {useAuth} from "../auth/AuthContext.tsx";
import Cookies from "js-cookie";
import {Statistics} from "../types.ts";
import './styles.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp, faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
    const {organization, user} = useAuth();
    const [statistics, setStatistics] = useState<Statistics>()
    const [errorFound, setErrorFound] = useState<boolean>(false)

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/organizations/${organization.id}/statistics`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setStatistics(data);
                    console.log(data)
                }
                else {
                    setErrorFound(true);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
        fetchStatistics();
    }, [organization.id])

    if (!statistics) {
        return (
            <h2 className='main-header text-[2em] md:text-[3em]'>Organizacija neturi transakcijų</h2>
        );
    }

    if (errorFound) {
        return (
            <h2 className='main-header text-[2em] md:text-[3em]'>Organizacija neturi transakcijų</h2>
        );
    }

    return (
        <div className='flex flex-col w-full items-center mt-2 justify-center'>
            <div className="grid w-[90%] grid-cols-3 gap-4 p-3 items-center">
                <div className='stat-container h-[100px] items-start p-3'>
                    <h2 className='dashboard-card-title'>TRANSAKCIJŲ SKAIČIUS</h2>
                    <h2 className='font-sans font-bold text-[25px]'>{statistics.currentYearNumberOfTransactions}</h2>
                    <div className='flex w-full gap-2 items-center'>
                        {statistics.currentYearNumberOfTransactions - statistics.previousYearNumberOfTransactions >= 0
                        ? (<FontAwesomeIcon icon={faArrowUp} className='text-green-700' />)
                        : <FontAwesomeIcon icon={faArrowDown} className='text-red-700' />}
                        <h2 className='font-sans text-gray-500'>{Math.abs(statistics.currentYearNumberOfTransactions - statistics.previousYearNumberOfTransactions)} vs praeiti metai </h2>
                    </div>
                </div>

                <div className='stat-container h-[100px] items-start p-3'>
                    <h2 className='dashboard-card-title'>PAJAMOS, €</h2>
                    <h2 className='font-sans font-bold text-[25px]'>{statistics.currentYearTotalAmount.toFixed(2)}</h2>
                    <div className='flex w-full gap-2 items-center'>
                        {statistics.currentYearTotalAmount - statistics.previousYearTotalAmount >= 0
                            ? (<FontAwesomeIcon icon={faArrowUp} className='text-green-700' />)
                            : <FontAwesomeIcon icon={faArrowDown} className='text-red-700' />}
                        <h2 className='font-sans text-gray-500'>{((statistics.currentYearTotalAmount / statistics.previousYearTotalAmount - 1) * 100).toFixed(2)}% vs praeiti metai </h2>
                    </div>
                </div>

                <div className='stat-container h-[100px] items-start p-3'>
                    <h2 className='dashboard-card-title'>PAJAMŲ AUGIMO TENDENCIJA</h2>
                    <h2 className='font-sans font-bold text-[25px]'>{statistics.averageTrendPercentage.toFixed(2)}%</h2>
                </div>
            </div>

            <div className="flex w-[90%] gap-4 p-3">
                <div className='flex flex-col w-[35%] gap-5'>
                    <div className="stat-container h-[100px] relative">
                        <h2 className="dashboard-card-title text-start ml-3">
                            METŲ TIKSLO PROGRESAS
                        </h2>
                        <div className="flex flex-col items-start ml-3 w-full">
                            <h2 className='font-bold text-[20px]'>{statistics.goalCompletionPercentage > 100 ? 100 : statistics.goalCompletionPercentage.toFixed(2)}%</h2>
                            <h2 className='font-sans text-gray-500'>iki tikslo išpildymo: {organization.yearlyGoal - statistics.currentYearTotalAmount < 0 ? 0 : (organization.yearlyGoal - statistics.currentYearTotalAmount).toFixed(2)} €</h2>
                            <div className="w-[100px] h-[100px] absolute right-0 bottom-0">
                                <PieChart
                                    series={[
                                        {
                                            data: [
                                                { id: 0, value: statistics.goalCompletionPercentage, color: '#00877b' },
                                                { id: 1, value: 100 - statistics.goalCompletionPercentage, color: '#e0e0e0' },
                                            ],
                                            innerRadius: 30,
                                            outerRadius: 40,
                                            paddingAngle: 0,
                                            cornerRadius: 5,
                                        },
                                    ]}
                                    width={100}
                                    height={100}
                                    margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                                    slotProps={{
                                        legend: { hidden: true },
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='stat-container h-[100px] px-3 py-2 items-start'>
                        <div className='flex gap-2 items-center'>
                            <h2 className='dashboard-card-title text-left'>PELNINGIAUSIAS MĖNESIS</h2>
                            <FontAwesomeIcon icon={faCaretUp} className='text-green-600 text-[22px]'/>
                        </div>
                        <h2 className='font-sans font-bold text-[20px]'>{statistics.mostProfitableMonth}</h2>
                        <div className='flex flex-col h-full items-end justify-end'>
                            <h2 className='font-sans text-gray-500'>{statistics.mostProfitableMonthAmount} €</h2>
                        </div>
                    </div>

                    <div className='stat-container h-[100px] px-3 py-2 items-start'>
                        <div className='flex gap-2 items-center'>
                            <h2 className='dashboard-card-title text-left'>NUOSTOLINGIAUSIAS MĖNESIS</h2>
                            <FontAwesomeIcon icon={faCaretDown} className='text-red-600 text-[22px]'/>
                        </div>
                        <h2 className='font-sans font-bold text-[20px]'>{statistics.mostUnprofitableMonth}</h2>
                        <div className='flex flex-col h-full items-end justify-end'>
                            <h2 className='font-sans text-gray-500'>{statistics.mostUnprofitableMonthAmount} €</h2>
                        </div>
                    </div>

                </div>

                <div className='stat-container items-start justify-start h-[339px] w-[66.1%]'>
                    <BarChart
                        xAxis={[
                            { id: 'months', data: statistics.xValues, scaleType: 'band' }
                        ]}
                        yAxis={[
                            {
                                valueFormatter: (value) => `${value} €`
                            }
                        ]}
                        series={[
                            { data: statistics.previousYearYValues, label: 'Praeiti metai' },
                            { data: statistics.currentYearYValues, label: 'Einamieji metai' }
                        ]}
                        width={800}
                        height={400}
                    />
                </div>
            </div>

            <div className="flex w-[90%] gap-4 p-3 items-center">
                <div className="stat-container h-[180px] w-1/2 relative">
                    <h2 className="dashboard-card-title text-left px-3">TOP 5 TRANSAKCIJOS</h2>
                    <div className="w-[400px]  absolute right-left-15 top-5"> {/* Increased container size */}
                        <BarChart
                            dataset={statistics.top5MostFrequentTransactions.map(t => ({
                                category: t.transaction.title,
                                value: t.count
                            }))}
                            yAxis={[{
                                scaleType: 'band',
                                dataKey: 'category',
                                tickLabelStyle: {
                                    fontSize: 11,
                                    width: 'auto', // Let labels take needed space
                                    whiteSpace: 'nowrap',
                                    overflow: 'visible',
                                    textOverflow: 'clip' // Changed from 'unset' to 'clip'
                                },
                                labelStyle: {
                                    width: '100%', // Full width for axis label
                                    overflow: 'visible'
                                }
                            }]}
                            xAxis={[{
                                label: 'Dažnis',
                                labelStyle: {
                                    fontSize: 11 // Add this to make x-axis label smaller
                                }

                            }]}
                            series={[{
                                dataKey: 'value',
                                color: '#1976d2' // Optional: adds visual distinction
                            }]}
                            width={450}
                            height={150} // Increased height
                            layout="horizontal"
                            margin={{
                                left: 200, // Increased left margin for long labels
                                right: 20,
                                top: 20,
                                bottom: 40
                            }}
                            slotProps={{
                                axis: {
                                    direction: 'ltr' // Ensure proper text direction
                                }
                            }}
                        />
                    </div>

                </div>
            </div>

            {/*<div className="flex justify-between items-end mb-4 w-[850px]">*/}
            {/*    <div className='flex flex-row gap-5'>*/}
            {/*        <div>*/}
            {/*            <p className="text-[30px] font-bold">{transactions.length}</p>*/}
            {/*            <p className="uppercase text-[16px] text-gray-400">Transakcijų sk.</p>*/}
            {/*        </div>*/}
            {/*        <div>*/}
            {/*            <p className="text-[30px] font-bold">*/}
            {/*                {transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)} €*/}
            {/*            </p>*/}
            {/*            <p className="uppercase text-[16px] text-gray-400">{totalAmount >= 0 ? 'Pelnas' : 'Nuostolis'}</p>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    <div className="flex gap-3">*/}
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
            {/*</div>*/}

            {/*{transactions.length == 0 ? (*/}
            {/*    <div className='flex w-[1000px] h-[300px] items-center justify-center'>*/}
            {/*        <h2 className="main-header text-[40px] mt-10">Transakcijų pagal pasirinktą laikotarpį nerasta</h2>*/}
            {/*    </div>*/}
            {/*) : (*/}
            {/*    <LineChart*/}
            {/*        xAxis={[{*/}
            {/*            data: xData,*/}
            {/*            scaleType: 'band',*/}
            {/*        }]}*/}
            {/*        yAxis={[{*/}
            {/*            valueFormatter: (value) => `${value} €`,*/}
            {/*        }]}*/}
            {/*        series={[{*/}
            {/*            data: yData,*/}
            {/*            area: true,*/}
            {/*            curve: 'monotoneX',*/}
            {/*            color: chartColor,*/}
            {/*            showMark: false,*/}
            {/*            baseline: -3000000,*/}
            {/*            valueFormatter: (value) => `${value} €`,*/}
            {/*        }]}*/}
            {/*        width={1000}*/}
            {/*        height={500}*/}
            {/*        grid={{ horizontal: true, vertical: false }}*/}
            {/*        sx={{*/}
            {/*            '.MuiAreaElement-root': {*/}
            {/*                opacity: 0.3,*/}
            {/*            },*/}
            {/*        }}*/}
            {/*    />*/}
            {/*)}*/}


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
            {/*                            setPeriod({ from: customFrom, to: customTo });*/}
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
        </div>
    );
};

export default Dashboard;