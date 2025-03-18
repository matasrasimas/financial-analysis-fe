import {useState} from "react";
import {OrgUnit} from "../../../types.ts";
import OrgUnitCard from "./OrgUnitCard";
import {ORG_UNITS} from "../../../data.ts";

const OrgUnits = () => {
    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>(ORG_UNITS);

    const handleOrgUnitEdit = (updatedOrgUnit: OrgUnit) => {
        setOrgUnits((prevOrgUnits) =>
            prevOrgUnits.map((orgUnit) =>
                orgUnit.id === updatedOrgUnit.id ? updatedOrgUnit : orgUnit));
    }

    return (
        <div className='grid grid-cols-1 w-7/12 sm:grid-cols-2 sm:w-9/12 md:grid-cols-3 md:w-10/12 gap-6 mx-auto my-5'>
            {orgUnits.map((orgUnit) => (
                <OrgUnitCard key={orgUnit.id} orgUnit={orgUnit}/>
            ))}
        </div>
    );
}

export default OrgUnits;