import React, {useState} from "react";
import {ExportOptions} from "../../types.ts";
import "./styles.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";

const Export = () => {
    const [exportOptions, setExportOptions] = useState<ExportOptions>({
        option1: false,
        option2: false,
        option3: false,
        exportFrom: "",
        exportTo: "",
    });

    const [selectedPeriod, setSelectedPeriod] = useState<string>("Ši savaitė");

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExportOptions((prevOptions) => ({
            ...prevOptions,
            [e.target.name]: e.target.checked,
        }));
        console.log({
            ...exportOptions,
            [e.target.name]: e.target.checked,
        })
    };

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const period = e.target.value;
        setSelectedPeriod(period);

        if (period !== "Pasirinkti") {
            const today = new Date();
            let exportFrom = "";
            let exportTo = today.toISOString().split("T")[0];

            if (period === "Ši savaitė") {
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                exportFrom = startOfWeek.toISOString().split("T")[0];
            } else if (period === "Šis mėnuo") {
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                exportFrom = startOfMonth.toISOString().split("T")[0];
            } else if (period === "Praeitas mėnesis") {
                const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                exportFrom = startOfLastMonth.toISOString().split("T")[0];
                exportTo = endOfLastMonth.toISOString().split("T")[0];
            }

            setExportOptions((prevOptions) => ({
                ...prevOptions,
                exportFrom,
                exportTo,
            }));
        } else {
            setExportOptions((prevOptions) => ({
                ...prevOptions,
                exportFrom: "",
                exportTo: "",
            }));
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExportOptions((prevOptions) => ({
            ...prevOptions,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="flex flex-col w-full items-center justify-center mt-5 gap-10">
            <h2 className="main-header text-[2em] sm:text-[3em]">Ataskaitos eksportas</h2>
            <div
                className="flex flex-col justify-center items-center gap-10 text-[16px] sm:text-[22px] mb-10">

                <div className='flex flex-col gap-5 border-3 p-10 font-bold'>
                    <div className="flex flex-row gap-3 items-center text-center">
                        <div className="flex w-[100px] sm:w-[150px]">
                            <label htmlFor="period" className="font-sans">Periodas:</label>
                        </div>
                        <select
                            id="period"
                            onChange={handlePeriodChange}
                            className="w-full p-3 border border-gray-300 rounded-full shadow-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                        >
                            <option>Ši savaitė</option>
                            <option>Šis mėnuo</option>
                            <option>Praeitas mėnesis</option>
                            <option>Pasirinkti</option>
                        </select>
                    </div>

                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col items-center">
                            <label className="text-sm font-semibold">Nuo:</label>
                            <input
                                type="date"
                                name="exportFrom"
                                value={exportOptions.exportFrom}
                                onChange={handleDateChange}
                                disabled={selectedPeriod !== "Pasirinkti"}
                                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-200"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="text-sm font-semibold">Iki:</label>
                            <input
                                type="date"
                                name="exportTo"
                                value={exportOptions.exportTo}
                                onChange={handleDateChange}
                                disabled={selectedPeriod !== "Pasirinkti"}
                                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-200"
                            />
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-8 w-full items-center justify-center'>
                    <h2 className="main-header text-[2em] sm:text-[30px]">Eksporto pasirinkimai:</h2>
                    {["pasirinkimas 1", "pasirinkimas 2", "pasirinkimas 3"].map((option) => (
                        <div key={option} className="flex flex-row gap-3 items-center text-center w-full justify-center font-bold">
                            <div className="flex w-[300px] sm:w-[200px]">
                                <label htmlFor={option}
                                       className="font-sans capitalize">{option.replace("option", "Option ")}:</label>
                            </div>
                            <label className="relative inline-block w-[60px] h-[34px] cursor-pointer">
                                <input
                                    type="checkbox"
                                    id={option}
                                    name={option}
                                    checked={exportOptions[option]}
                                    onChange={handleCheckboxChange}
                                    className="sr-only peer"
                                />
                                <div
                                    className="absolute inset-0 bg-gray-300 transition-all duration-400 peer-checked:bg-green-500 rounded-full"></div>
                                <div
                                    className="absolute left-1 top-[4px] w-[26px] h-[26px] bg-white rounded-full transition-transform duration-400 peer-checked:translate-x-[26px]"></div>
                            </label>
                        </div>
                    ))}
                </div>

                <div
                    className='flex w-[200px] h-[50px] bg-[#00675b] items-center justify-center text-white font-sans rounded-md cursor-pointer hover:text-yellow-500 mt-5'>
                    <button className='flex gap-3 cursor-pointer'>
                        <FontAwesomeIcon icon={faDownload} className='text-[25px]'/>
                        <h2>Atsisiųsti</h2>
                    </button>

                </div>

            </div>
        </div>
    );
};

export default Export;
