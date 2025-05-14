import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faPlus, faUpload} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import {useAuth} from "../../auth/AuthContext.tsx";
import {OrgUnit, TransactionFromFile} from "../../types.ts";
import TransactionFromFileCard from "../Transactions/TransactionFromFileCard";
import './styles.css'
import TransactionCard from "../Transactions/TransactionCard";

const ImageTransactions = () => {
    const navigate = useNavigate();
    const {organization, user} = useAuth();
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState(null);
    const [transactionsFromFile, setTransactionsFromFile] = useState<TransactionFromFile[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [generationResult, setGenerationResult] = useState<string>('')
    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
    const [activeOrgUnit, setActiveOrgUnit] = useState<OrgUnit>([]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleTransactionChange = (index: number, updatedTransaction: TransactionFromFile) => {
        const updated = [...transactionsFromFile];
        updated[index] = updatedTransaction;
        setTransactionsFromFile(updated);
    };

    const handleTransactionDelete = (index: number) => {
        const updated = transactionsFromFile.filter((_, i) => i !== index);
        setTransactionsFromFile(updated);
    };

    const handleFileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData();

        if (imageFile) {
            formData.append("imageFile", imageFile);
            setIsLoading(true);

            try {
                const response = await fetch('http://localhost:8080/api/transactions/from-file', {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`
                    },
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.length == 0)
                        setGenerationResult('Įkeltame faile nepavyko rasti transakcijų')
                    else
                        setGenerationResult('')
                    const transactions: TransactionFromFile[] = data.map((transaction: any) => ({
                        orgUnitId: '',
                        amount: transaction.amount,
                        title: transaction.title,
                        description: transaction.description,
                        createdAt: transaction.createdAt,
                        amountError: '',
                        titleError: '',
                        createdAtError: '',
                    }));

                    const response1 = await fetch(`http://localhost:8080/api/organizations/${organization.id}/org-units`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${Cookies.get('jwt')}`,
                            "Content-Type": "application/json"
                        },
                    });
                    if (response1.ok) {
                        const data1 = await response1.json();
                        setOrgUnits(data1);
                        setActiveOrgUnit(data1[0]);
                        setTransactionsFromFile(transactions.map(t => ({...t, orgUnitId: data1[0].id})))
                    }

                    setTransactionsFromFile(transactions);
                } else {
                    console.error("Failed to submit form. Status:", response.status);
                }
            } catch (e) {
                console.error("Error submitting form:", e);
            } finally {
                setIsLoading(false); // Stop spinner
            }
        } else {
            console.warn("No image file selected.");
        }
    };

    const handleTransactionsSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateTransactions()) {
            try {
                const response = await fetch('http://localhost:8080/api/transactions', {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        transactionsFromFile.map((transaction: TransactionFromFile) => (
                            {
                                orgUnitId: activeOrgUnit.id,
                                userId: user.id,
                                amount: transaction.amount,
                                title: transaction.title,
                                description: transaction.description && transaction.description.length > 0 ? transaction.description : null,
                                createdAt: transaction.createdAt,
                                isLocked: false
                            }))
                    )
                });
                if (response.ok) {
                    navigate('/transactions')
                }
            } catch (e) {
                console.error("Error submitting form:", e);
            }
        }
    }

    const validateTransactions = (): boolean => {
        let isValid = true;

        const updatedTransactions = transactionsFromFile.map(transaction => {
            const updatedTransaction = { ...transaction };

            if (updatedTransaction.amount === 0) {
                updatedTransaction.amountError = 'error';
                isValid = false;
            } else {
                updatedTransaction.amountError = '';
            }

            if (!updatedTransaction.title || updatedTransaction.title.trim() === '') {
                updatedTransaction.titleError = 'error';
                isValid = false;
            } else {
                updatedTransaction.titleError = '';
            }

            if (!updatedTransaction.createdAt || updatedTransaction.createdAt.trim() === '') {
                updatedTransaction.createdAtError = 'error';
                isValid = false;
            } else {
                updatedTransaction.createdAtError = '';
            }

            return updatedTransaction;
        });

        setTransactionsFromFile(updatedTransactions);
        return isValid;
    };

    const handleOrgUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.currentTarget.value;
        const selectedUnit = orgUnits.find((unit) => unit.id === selectedId);
        setActiveOrgUnit(selectedUnit);
    }

    return (
        <div className="flex flex-col w-full items-center justify-center gap-10 relative mt-5">
            <Link
                to='/select-transaction-creation'
                className='flex absolute gap-3 font-bold text-[20px] underline underline-offset-2 self-start ml-10 hover:text-blue-500 top-0'>
                <div className='block'>
                    <FontAwesomeIcon icon={faArrowLeft}/>
                </div>
                <h2>Atgal</h2>
            </Link>
            <div className='image-transaction-container'>
                <h2 className="main-header text-[35px]">Įkelti dokumento nuotrauką:</h2>

                <form onSubmit={handleFileSubmit} className='flex flex-col w-full'>
                    <div className="flex flex-col items-center gap-4">
                        <label id='file-upload' htmlFor="image-upload" className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition duration-300 flex items-center gap-2">
                            <FontAwesomeIcon icon={faUpload} />
                            Pasirinkti failą
                        </label>

                        <input
                            id="image-upload"
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {imagePreview && (
                            <div className="mt-6 flex justify-center">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-w-[400px] max-h-[300px] object-contain border border-gray-300 rounded-md shadow"
                                />
                            </div>
                        )}

                        {imageFile && (
                            <p className="text-gray-700 font-medium">
                                Pasirinktas failas: <span className="font-bold">{imageFile.name}</span>
                            </p>
                        )}
                    </div>

                    {imageFile && (
                        <div className='flex flex justify-center items-center mt-10'>
                            <button
                                id='generate-transactions-btn'
                                type='submit'
                                className='bg-black w-[200px] h-[45px] text-white font-bold text-[16px] rounded-md cursor-pointer hover:text-yellow-500'>
                                Generuoti transakcijas
                            </button>
                        </div>
                    )}
                </form>
            </div>


            {isLoading && (
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <p className='font-bold text-[30px]'>Generuojama...</p>
                </div>
             )}

            {
                generationResult.length > 0 && (
                    <h2 className="main-header text-[30px]">{generationResult}</h2>
                )
            }

            {
                transactionsFromFile.length > 0 && (
                    <div className='flex flex-col gap-5 w-full items-center'>
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
                        <form onSubmit={handleTransactionsSubmit} className='org-container'>
                            <h2 className="org-form-header">Sugeneruotos transakcijos</h2>
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
                                        <h2>Veiksmai</h2>
                                    </div>
                                </div>
                            </div>

                            {transactionsFromFile.map((transaction, index) => (
                                <TransactionFromFileCard
                                    key={index}
                                    transactionToEdit={transaction}
                                    onChange={(updated) => handleTransactionChange(index, updated)}
                                    onDelete={() => handleTransactionDelete(index)}
                                />
                            ))}
                            <div className='flex justify-center items-center my-5'>
                                <button
                                    id='create-transactions-btn'
                                    type='submit'
                                    className='bg-green-800 w-[200px] h-[45px] text-white font-bold text-[16px] rounded-md cursor-pointer hover:text-yellow-500'>
                                    Kurti transakcijas
                                </button>
                            </div>
                        </form>
                    </div>

                )
            }
        </div>

    );
}

export default ImageTransactions;