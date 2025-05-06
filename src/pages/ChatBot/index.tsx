import './styles.css'
import {Link, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faPlus, faX} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {DatePeriod, OrgUnit, Statistics, Transaction, User} from "../../types.ts";
import {useAuth} from "../../auth/AuthContext.tsx";
import Cookies from "js-cookie";
import {BarChart} from "@mui/x-charts";
import {GenerateContentResponse, GoogleGenAI} from "@google/genai";
import TransactionModalCard from "./TransactionModalCard";

const ChatBot = () => {
    const navigate = useNavigate();
    const {organization, user} = useAuth();
    const [statistics, setStatistics] = useState<Statistics>()
    const [geminiOutput, setGeminiOutput] = useState<string>('')
    const [showGeminiOutputModal, setShowGeminiOutputModal] = useState<boolean>(false);
    const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_gemini_api_key});
    const [typedText, setTypedText] = useState('');
    const [index, setIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([])
    const [modalTransactions, setModalTransactions] = useState<Transaction[]>([])

    const [transactionsModalOpened, setTransactionsModalOpened] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:8080/api/users', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data)
            }
        }

        fetchUsers()
    }, []);

    const formatGeminiOutput = (input: string): React.ReactNode[] => {
        const transactionTitles: string[] = statistics.currentYearTransactions.map(t =>
            t.title.toLowerCase()
        );

        const parseBoldText = (text: string): React.ReactNode[] => {
            const parts = text.split(/(\*\*.*?\*\*)/); // Keep bolded parts
            return parts.map((part, i) => {
                const match = part.match(/^\*\*(.*?)\*\*$/);
                if (match) {
                    return <strong key={i}>{match[1]}</strong>;
                } else {
                    return part;
                }
            });
        };

        const highlightTitles = (line: string, index: number): React.ReactNode => {
            let elements: React.ReactNode[] = [];
            let remainingText = line;
            let cursor = 0;

            const sortedTitles = [...transactionTitles].sort((a, b) => b.length - a.length);

            while (remainingText) {
                let matchFound = false;

                for (const title of sortedTitles) {
                    const lowerText = remainingText.toLowerCase();
                    const matchIndex = lowerText.indexOf(title);

                    if (matchIndex !== -1) {
                        // Add text before the match
                        if (matchIndex > 0) {
                            const beforeMatch = remainingText.slice(0, matchIndex);
                            elements.push(
                                ...parseBoldText(beforeMatch).map((node, i) => (
                                    <span key={`${index}-${cursor++}-${i}`}>{node}</span>
                                ))
                            );
                        }

                        // Add the matched title as clickable span
                        elements.push(
                            <span
                                key={`${index}-${cursor++}`}
                                className="text-blue-500 underline cursor-pointer"
                                onClick={() => openTransactionsModal(title)}
                            >
                            {remainingText.slice(matchIndex, matchIndex + title.length)}
                        </span>
                        );

                        remainingText = remainingText.slice(matchIndex + title.length);
                        matchFound = true;
                        break;
                    }
                }

                if (!matchFound) {
                    elements.push(
                        ...parseBoldText(remainingText).map((node, i) => (
                            <span key={`${index}-${cursor++}-${i}`}>{node}</span>
                        ))
                    );
                    break;
                }
            }

            return elements;
        };

        const formattedLines = input.split('\n');

        return formattedLines.map((line, index) => {
            const bulletMatch = line.match(/^\*\s+(.*)/);

            if (bulletMatch) {
                const sentence = bulletMatch[1].split('. ')[0].trim();
                return <li key={index}>{highlightTitles(sentence, index)}</li>;
            } else {
                return <p key={index}>{highlightTitles(line, index)}</p>;
            }
        });
    };

    const promptGemini = async (generatedPrompt: string) => {
        setShowGeminiOutputModal(true);
        setIsGenerating(true)
        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: generatedPrompt
            });
            setGeminiOutput(formatGeminiOutput(response.text))
            setIsGenerating(false)
        } catch (e) {
            promptGemini(generatedPrompt)
            console.error(e);
        }

    };

    const generateConclusionPrompt = (question: string): string => {
        let prompt = 'Organizacijos statistikos 2025 metais:\n';
        prompt += 'Kiekvieno mėnesio duomenys:\n'

        statistics.monthsByAmounts.forEach(mby => {
            prompt += `"mėnesis: ${mby.month}, gautos pajamos per šį mėnesį: ${mby.amount} €"\n`
        })

        prompt += '\n'

        prompt += 'Dažniausiai pasikartojančių transakcijų TOP 5:\n'
        statistics.top5MostFrequentTransactions.forEach(pair => {
            prompt += `"pavadinimas: ${pair.transaction.title} dažnis: ${pair.count} "\n`
        })

        prompt += '\n'
        prompt += `Metų bendros pajamos: ${statistics.currentYearTotalAmount} €\n`
        prompt += `Per metus atliktų transakcijų kiekis: ${statistics.currentYearNumberOfTransactions}\n`
        prompt += `Pelningiausias mėnuo: ${statistics.mostProfitableMonth}, per kurį buvo uždirbta ${statistics.mostProfitableMonthAmount}€\n`
        prompt += `Nuostolingiausias mėnuo: ${statistics.mostUnprofitableMonth}, per kurį buvo uždirbta ${statistics.mostUnprofitableMonthAmount}€\n`
        prompt += '\n'

        prompt += question
        return prompt;
    }

    const handleGeminiOutputModalClose = () => {
        setGeminiOutput('')
        setTypedText('')
        setShowGeminiOutputModal(false);
    }

    // useEffect(() => {
    //     if (showGeminiOutputModal && geminiOutput && index < geminiOutput.length) {
    //         const timeout = setTimeout(() => {
    //             setTypedText((prev) => prev + geminiOutput.charAt(index));
    //             setIndex((prev) => prev + 1);
    //         }, 10);
    //         return () => clearTimeout(timeout);
    //     }
    // }, [index, geminiOutput, showGeminiOutputModal]);

    useEffect(() => {
        if (showGeminiOutputModal) {
            setTypedText('');
            setIndex(0);
        }
    }, [geminiOutput, showGeminiOutputModal]);

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
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
        fetchStatistics();
    }, [organization.id])

    const getCurrentYearPeriod = (): DatePeriod => {
        const now = new Date();
        const year = now.getFullYear();

        const yearFrom = new Date(year, 0, 1); // January 1st
        const yearTo = new Date(year + 1, 0, 1); // January 1st of next year

        return {
            from: yearFrom.toISOString().split('T')[0],
            to: yearTo.toISOString().split('T')[0]
        };
    }

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

    const [period, setPeriod] = useState<DatePeriod>(getCurrentYearPeriod());
    const [showDateModal, setShowDateModal] = useState(false);
    const [customFrom, setCustomFrom] = useState(period.from);
    const [customTo, setCustomTo] = useState(period.to);
    const [selectedPeriod, setSelectedPeriod] = useState<string>("Šis mėnuo");
    const [periodError, setPeriodError] = useState<string>('');

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

            if (period == 'Šie metai') {
                const calculatedPeriod = getCurrentYearPeriod()
                exportFrom = calculatedPeriod.from
                exportTo = calculatedPeriod.to
            } else if (period === "Šis mėnuo") {
                const calculatedPeriod = getCurrentMonthPeriod()
                exportFrom = calculatedPeriod.from
                exportTo = calculatedPeriod.to
            }

            setPeriod({
                from: exportFrom,
                to: exportTo
            })
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
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

    const mapMonthTextToNumber = (input: string): string => {
        switch (input) {
            case "Sausis":
                return "01";
            case "Vasaris":
                return "02";
            case "Kovas":
                return "03";
            case "Balandis":
                return "04";
            case "Gegužė":
                return "05";
            case "Birželis":
                return "06";
            case "Liepa":
                return "07";
            case "Rugpjūtis":
                return "08";
            case "Rugsėjis":
                return "09";
            case "Spalis":
                return "10";
            case "Lapkritis":
                return "11";
            case "Gruodis":
                return "12";
            default:
                return "";
        }
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

    const openTransactionsModal = async (inputTitle: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/organizations/${organization.id}/transactions?from=2025-01-01&to=2025-12-31`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setModalTransactions(data.filter(t => t.title.toLowerCase().includes(inputTitle.toLowerCase())))
                setTransactionsModalOpened(true)
            }
        } catch (e) {
            console.error(e);
        }

    }

    const closeTransactionsModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setTransactionsModalOpened(false); // unmount after animation
            setIsClosing(false);
        }, 300); // match animation duration
    };

    if (!statistics) {
        return (
            <h2 className='main-header text-[2em] md:text-[3em]'>Organizacija neturi transakcijų</h2>
        );
    }

    return (
        <div className='chat-bot-main-container'>
            <button
                onClick={() => navigate(-1)}
                className='flex cursor-pointer absolute top-0 left-0 text-white flex-row gap-3 font-bold text-[30px] underline underline-offset-2 hover:text-blue-500 items-center px-4 py-2'
            >
                <FontAwesomeIcon icon={faArrowLeft}/>
                <h2>Atgal</h2>
            </button>

            <div className='flex flex-col items-center gap-5 w-[800px] justify-end mb-20'>
                <h2 className='question-header'>Klausti:</h2>
                <div className='flex flex-col gap-5'>
                    <button
                        onClick={() => promptGemini(generateConclusionPrompt('Kokias išvadas galima daryti, turint šiuos organizacijos duomenis?'))}
                        className='button-73 w-[250px]'>Išvados
                    </button>
                    <button
                        onClick={() => promptGemini(generateConclusionPrompt('Remiantis šiais duomenimis, kokių patarimų galėtum duoti, siekiant pagerinti finansinę padėtį?'))}
                        className='button-73 w-[250px]'>Patarimai
                    </button>
                </div>
            </div>

            <div
                className="flex flex-col gap-5 w-full border-l-[#0009a3] border-l-[1px] py-8 px-5 h-full items-start justify-start">
                <img src='../../../public/gemini-logo.png'
                     className='w-[80px] h-[80px] rounded-full border-blue-900 border-[2px]'/>

                <div className='w-full bg-[#1e1e21] rounded-lg w-[670px] p-3 min-h-[580px] overflow-y-auto'>
                    {isGenerating ? (
                        <div className="spinner-container">
                            <div className="spinner"></div>
                            <p className='font-bold text-[30px] text-white'>Generuojama...</p>
                        </div>
                    ) : (
                        <div className="text-white text-justify break-words w-[860px] text-[16px]/[2]">
                            {geminiOutput}
                        </div>
                    )}
                </div>
            </div>


            <div
                className='stat-container absolute top-20 left-0 ml-8 items-center justify-start h-[330px] w-[450px]'>
                <h2 className="text-xl font-bold mb-4">Metinė transakcijų suvestinė</h2>
                <BarChart
                    xAxis={[
                        {
                            id: 'months',
                            data: statistics.xValues.map(val => mapMonthTextToNumber(val)),
                            scaleType: 'band',
                            tickLabelStyle: {fontSize: 10}, // ⬅️ Smaller x-axis labels
                        }
                    ]}
                    yAxis={[
                        {
                            valueFormatter: (value) => `${value} €`,
                            tickLabelStyle: {fontSize: 10}, // ⬅️ Smaller y-axis labels
                        }
                    ]}
                    series={[
                        {
                            data: statistics.currentYearYValues,
                            color: '\n' +
                                '#05018a\n'
                        }
                    ]}
                    width={600}
                    height={420}
                />
            </div>

            {transactionsModalOpened && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 flex items-center justify-center">
                    <div className={`transactions-modal z-50 ${isClosing ? 'modal-animate-out' : 'modal-animate-in'}`}>

                        <div className='modal-transactions-table relative'>
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
                                </div>
                                {modalTransactions.map((transaction) => (
                                    <TransactionModalCard
                                        key={transaction.id}
                                        transaction={transaction}
                                        author={users.find(u => u.id === transaction.userId)}
                                    />
                                ))}
                                <div className='block mb-10'></div>
                            </div>

                            <div className="flex w-full h-[20px] items-center justify-end pr-3 py-4 absolute">
                                <FontAwesomeIcon
                                    icon={faX}
                                    className="text-bold text-red-500 text-[20px] cursor-pointer"
                                    onClick={closeTransactionsModal}
                                />
                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default ChatBot;