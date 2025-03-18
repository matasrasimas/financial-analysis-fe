import {Link} from "react-router-dom";
import {OrgUnit} from "../../../../types.ts";

const OrgUnitCard = (
    {
        orgUnit
    }:
    {
        orgUnit: OrgUnit
    }
) => {
    return (
        <Link
            to={`/org-units/${orgUnit.id}`}
            className='bg-gray-300 p-6 border rounded-lg shadow-md'>
            <h2 className='font-sans font-bold text-[30px]'>{orgUnit.title}</h2>
        </Link>
    );
}

export default OrgUnitCard;