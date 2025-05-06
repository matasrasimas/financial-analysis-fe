import './styles.css'
import {faArrowLeft, faGear, faImage, faPen} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import React from "react";
import {useAuth} from "../../auth/AuthContext.tsx";

const SelectTransactionCreation = () => {
    const {user, organization} = useAuth()

    return (
        <div className='flex flex-col w-full mt-10 gap-5 items-center relative'>
            <h2 className='select-transaction-creation-header'>Pasirinkite transakcijos sukūrimo būdą</h2>
            <div className="grid grid-cols-3 gap-4 p-3 w-4/5">
                <Link
                    to='/transaction-create'
                    className='item-container bg-white items-center justify-center cursor-pointer hover:bg-gray-200'>
                    <div className='flex flex-col items-center justify-center gap-5'>
                        <FontAwesomeIcon icon={faPen} className='text-[30px]'/>
                        <h2 className='font-sans font-bold text-[20px]'>Rankinis būdas</h2>
                    </div>
                </Link>

                {user.id === organization.userId && (
                    <Link
                        to='/automatic-transactions'
                        className='item-container bg-white items-center justify-center cursor-pointer hover:bg-gray-200'>
                        <div className='flex flex-col items-center justify-center gap-5'>
                            <FontAwesomeIcon icon={faGear} className='text-[30px]'/>
                            <h2 className='font-sans font-bold text-[20px]'>Automatinė transakcija</h2>
                        </div>
                    </Link>
                )}

                    <Link
                        to='/image-transactions'
                        className='item-container bg-white items-center justify-center cursor-pointer hover:bg-gray-200'>
                        <FontAwesomeIcon icon={faImage} className='text-[30px]'/>
                        <h2 className='font-sans font-bold text-[20px]'>Įkelti nuotrauką</h2>
                    </Link>

            </div>

            <Link
                to='/transactions'
                className='flex absolute gap-3 font-bold text-[20px] underline underline-offset-2 self-start ml-10 hover:text-blue-500'>
                <div className='block'>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <h2>Atgal</h2>
            </Link>

        </div>
    );
}

export default SelectTransactionCreation;