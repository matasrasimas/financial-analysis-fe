import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faUpload} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import {useAuth} from "../../auth/AuthContext.tsx";
import {TransactionFromFile} from "../../types.ts";
import TransactionFromFileCard from "../Transactions/TransactionFromFileCard";
import './styles.css'

const ImageTransactions = () => {
    const navigate = useNavigate();
    const {orgUnit} = useAuth();
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [transactionsFromFile, setTransactionsFromFile] = useState<TransactionFromFile[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [generationResult, setGenerationResult] = useState<string>('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
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
                        orgUnitId: orgUnit.id,
                        amount: transaction.amount,
                        title: transaction.title,
                        description: transaction.description,
                        createdAt: transaction.createdAt,
                        amountError: '',
                        titleError: '',
                        createdAtError: '',
                    }));

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
                                orgUnitId: orgUnit.id,
                                amount: transaction.amount,
                                title: transaction.title,
                                description: transaction.description && transaction.description.length > 0 ? transaction.description : null,
                                createdAt: transaction.createdAt,
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

    return (
        <div className="flex flex-col w-full items-center justify-center gap-10 relative mt-5">
            <Link
                to='/transactions'
                className='flex absolute gap-3 font-bold text-[25px] underline underline-offset-2 self-start ml-10 hover:text-blue-500 top-0'>
                <div className='block'>
                    <FontAwesomeIcon icon={faArrowLeft}/>
                </div>
                <h2>Atgal</h2>
            </Link>
            <h2 className="main-header text-[35px]">Įkelti dokumento nuotrauką arba failą PDF formatu:</h2>

            <form onSubmit={handleFileSubmit} className='flex flex-col w-full'>
                <div className="flex flex-col items-center gap-4">
                    <label htmlFor="image-upload" className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition duration-300 flex items-center gap-2">
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

                    {imageFile && (
                        <p className="text-gray-700 font-medium">
                            Pasirinktas failas: <span className="font-bold">{imageFile.name}</span>
                        </p>
                    )}
                </div>

                {imageFile && (
                    <div className='flex flex justify-center items-center mt-10'>
                        <button
                            type='submit'
                            className='bg-black w-[200px] h-[45px] text-white font-bold text-[16px] rounded-md cursor-pointer hover:text-yellow-500'>
                            Generuoti transakcijas
                        </button>
                    </div>
                )}
            </form>

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
                    <form onSubmit={handleTransactionsSubmit} className='flex flex-col w-full items-center'>
                        {transactionsFromFile.map((transaction, index) => (
                            <TransactionFromFileCard
                                key={index}
                                transactionToEdit={transaction}
                                onChange={(updated) => handleTransactionChange(index, updated)}
                                onDelete={() => handleTransactionDelete(index)}
                            />
                        ))}
                        <div className='flex flex justify-center items-center mb-10'>
                            <button
                                type='submit'
                                className='bg-black w-[200px] h-[45px] text-white font-bold text-[16px] rounded-md cursor-pointer hover:text-yellow-500'>
                                Kurti transakcijas
                            </button>
                        </div>
                    </form>
                )
            }
        </div>

    );
}

export default ImageTransactions;