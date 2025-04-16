import {useEffect, useState} from "react";
import {OrgUnit} from "../../../types.ts";
import OrgUnitCard from "./OrgUnitCard";
import {useAuth} from "../../../auth/AuthContext.tsx";
import Cookies from "js-cookie";

const OrgUnits = () => {
    const {organization} = useAuth();
    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);

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
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchOrgUnits();
    }, [organization.id]);

    return (
        <div className='grid grid-cols-1 w-7/12 sm:grid-cols-2 sm:w-9/12 md:grid-cols-3 md:w-10/12 gap-6 mx-auto my-5'>
            {orgUnits.map((orgUnit) => (
                <OrgUnitCard key={orgUnit.id} orgUnit={orgUnit}/>
            ))}
        </div>
    );
}

export default OrgUnits;