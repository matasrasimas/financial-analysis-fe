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
        <div className='flex justify-between bg-green-200 w-full px-10 h-[30px] items-center mt-3'>
            {orgUnits.map((orgUnit) => (
                <OrgUnitCard key={orgUnit.id} orgUnit={orgUnit}/>
            ))}
        </div>
    );
}

export default OrgUnits;