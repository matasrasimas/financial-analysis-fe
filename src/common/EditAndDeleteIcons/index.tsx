import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons";

const EditAndDeleteIcons = (
    {
        handleEditClick,
        handleDeleteClick,
        transactionId
    } :
    {
        handleEditClick: () => void,
        handleDeleteClick: (id: string) => void,
        transactionId: string
    }
    ) => {
    return (
        <div className='flex flex-row justify-center gap-6'>
            <div>
                <FontAwesomeIcon
                    icon={faPenToSquare}
                    className='text-blue-500 text-[30px] cursor  -pointer'
                    onClick={handleEditClick}
                />
            </div>
            <div>
                <FontAwesomeIcon
                    icon={faTrash}
                    className='text-red-500 text-[30px] cursor-pointer'
                    onClick={() => handleDeleteClick(transactionId)}
                />
            </div>
        </div>
    );
}

export default EditAndDeleteIcons;