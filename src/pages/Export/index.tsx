import React, {useEffect, useState} from "react";
import {DatePeriod, ExportOptions, OrgUnit} from "../../types.ts";
import "./styles.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "../../auth/AuthContext.tsx";
import Cookies from "js-cookie";

const Export = () => {
    const {organization} = useAuth();

    const [exportOptions, setExportOptions] = useState<ExportOptions>({
        exportFrom: "",
        exportTo: "",
    });

    const [selectedPeriod, setSelectedPeriod] = useState<string>("Šis mėnuo");
    const [periodError, setPeriodError] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [downloadCooldown, setDownloadCooldown] = useState(0);
    const [transactionsCount, setTransactionsCount] = useState<number>(0);
    const [activeOrgUnit, setActiveOrgUnit] = useState<OrgUnit>();
    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);

    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const monthFrom = new Date(year, month, 1);
        const monthTo = new Date(year, month + 1, 1);

        setExportOptions((prevOptions) => ({
            ...prevOptions,
            exportFrom: monthFrom.toISOString().split('T')[0],
            exportTo: monthTo.toISOString().split('T')[0]
        }));

    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (downloadCooldown > 0) {
            timer = setTimeout(() => setDownloadCooldown(downloadCooldown - 1), 1000);
        }

        return () => clearTimeout(timer);
    }, [downloadCooldown]);

    useEffect(() => {
        if (activeOrgUnit) {
            const fetchTransactions = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/org-units/${activeOrgUnit.id}/transactions?from=${exportOptions.exportFrom}&to=${exportOptions.exportTo}`, {
                        headers: {
                            "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data)
                        console.log(exportOptions.exportFrom)
                        console.log(exportOptions.exportTo)
                        setTransactionsCount(data.length);
                    } else {
                        setTransactionsCount(0)
                    }
                } catch (e) {
                    console.error(e);
                    setTransactionsCount(0);
                }
            }
            if (exportOptions.exportFrom !== '' && exportOptions.exportTo !== '') {
                fetchTransactions();
            }
        }

    }, [activeOrgUnit, exportOptions.exportFrom, exportOptions.exportTo]);

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
        fetchOrgUnits();
    }, [organization.id]);

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const period = e.target.value;
        setSelectedPeriod(period);

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        if (period !== "Pasirinkti") {
            setPeriodError('')
            const today = new Date();
            let exportFrom = "";
            let exportTo = today.toISOString().split("T")[0];

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

            setExportOptions({
                exportFrom: exportFrom,
                exportTo: exportTo
            })
        }
    };

    const validatePeriod = (input: ExportOptions): boolean => {
        let errorFound = false;
        if (input.exportFrom == '' || input.exportFrom == '') {
            errorFound = true;
            setPeriodError('Periodas yra privalomas')
        } else if (input.exportFrom > input.exportTo) {
            errorFound = true;
            setPeriodError('Pradžios data negali būti didesnė už pabaigos datą')
        }
        if (!errorFound) {
            setPeriodError('')
            return true
        } else return false
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setExportOptions((prev) => {
            const updatedPeriod = {
                ...prev,
                [name]: value,
            };
            if (!validatePeriod(updatedPeriod))
                return prev;
            return updatedPeriod;
        });
    };

    const handleExport = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/org-units/${activeOrgUnit.id}/export?from=${exportOptions.exportFrom}&to=${exportOptions.exportTo}`, {
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`,
                }
            });
            if (response.ok) {
                const blob = await response.blob()
                const contentDisposition = response.headers.get("Content-Disposition");
                let filename = "export.xlsx"; // fallback filename

                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="(.+)"/);
                    if (match && match[1]) {
                        filename = match[1];
                    }
                }

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url); // clean up
            } else {
                console.error("Failed to fetch file:", response.statusText);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsDownloading(false);
            setDownloadCooldown(10)
        }

    }

    const handleOrgUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.currentTarget.value;
        const selectedUnit = orgUnits.find((unit) => unit.id === selectedId);
        setActiveOrgUnit(selectedUnit);
    }

    return (
        <div className='flex flex-col w-full mt-5 items-center gap-10'>
            <div className='flex w-4/5'>
                <div className='org-unit-select-container flex-col justify-center h-[220px] items-center w-full'>
                    <label className='settings-header text-[18px]'>Eksporto pasirinkimai</label>
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
                                            name="exportFrom"
                                            value={exportOptions.exportFrom}
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
                                            name="exportTo"
                                            value={exportOptions.exportTo}
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

            <div className='org-unit-select-container flex-col h-[150px] items-center w-2/5 font-sans font-bold'>
                <h2>Rastų transakcijų skaičius: {transactionsCount}</h2>
                <button
                    type='submit'
                    onClick={handleExport}
                    disabled={isDownloading || downloadCooldown > 0}
                    className={`flex gap-3 w-[180px] h-[50px] items-center justify-center text-white font-sans rounded-md mt-10 
                                 ${isDownloading || downloadCooldown > 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#00675b] hover:text-yellow-500 cursor-pointer'}`}>
                    {
                        isDownloading
                            ? <span
                                className="animate-spin w-[25px] h-[25px] border-4 border-white border-t-transparent rounded-full"></span>
                            : <FontAwesomeIcon icon={faDownload} className='text-[25px]'/>
                    }
                    <h2>
                        {isDownloading
                            ? "Atsisiunčiama..."
                            : downloadCooldown > 0
                                ? `Palaukite (${downloadCooldown}s)`
                                : "Atsisiųsti"}
                    </h2>
                </button>
            </div>
        </div>
    );
};

export default Export;
