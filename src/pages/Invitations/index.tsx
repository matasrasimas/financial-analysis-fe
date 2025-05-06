import React, {useEffect, useState} from "react";
import {faPlus, faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import type {Invitation, Organization, OrgUnit, User} from "../../types.ts";
import '../../App.css'
import {useAuth} from "../../auth/AuthContext.tsx";
import Cookies from "js-cookie";
import ReceivedInvitationCard from "./ReceivedInvitationCard";

const Invitations = () => {
    const {organization, setOrganization, user} = useAuth()
    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([])
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [organizationToEdit, setOrganizationToEdit] = useState<Organization>({
        id: organization.id,
        userId: organization.userId,
        title: organization.title,
        code: organization.code,
        address: organization.address,
    })

    const [allOrganizations, setAllOrganizations] = useState<Organization[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([])

    const [receivedInvitations, setReceivedInvitations] = useState<Invitation[]>([])
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/organizations`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setAllOrganizations(data);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        const fetchUsersAndInvitations = async () => {
            if (!organization || !user)
                return;
            const response = await fetch(`http://localhost:8080/api/users`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setAllUsers(data);
                const response1 = await fetch(`http://localhost:8080/api/users/${user.id}/received-invitations`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response1.ok) {
                    const data1 = await response1.json();
                    setReceivedInvitations(data1.filter(inv => !inv.isAccepted));
                }
            }
        };

        fetchOrganizations();
        fetchUsersAndInvitations();
    }, [organization.id, user.id]);

    // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     if (validateFields()) {
    //         try {
    //             const response = await fetch("http://localhost:8080/api/organizations", {
    //                 method: "PUT",
    //                 headers: {
    //                     "Authorization": `Bearer ${Cookies.get('jwt')}`,
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(
    //                     {
    //                         id: organizationToEdit.id,
    //                         userId: organizationToEdit.userId,
    //                         title: organizationToEdit.title,
    //                         code: organizationToEdit.code && organizationToEdit.code.length == 0 ? null : organizationToEdit.code,
    //                         address: organizationToEdit.address && organizationToEdit.address.length == 0 ? null : organizationToEdit.address,
    //                     }
    //                 )
    //             });
    //             if (response.ok) {
    //                 setOrganizationToEdit({
    //                     id: organizationToEdit.id,
    //                     userId: organizationToEdit.userId,
    //                     title: organizationToEdit.title,
    //                     code: organizationToEdit.code,
    //                     address: organizationToEdit.address
    //                 })
    //                 setOrganization({
    //                     id: organizationToEdit.id,
    //                     userId: organizationToEdit.userId,
    //                     title: organizationToEdit.title,
    //                     code: organizationToEdit.code,
    //                     address: organizationToEdit.address
    //                 })
    //                 setShowSnackbar(true); // Show snackbar
    //
    //                 setTimeout(() => {
    //                     setShowSnackbar(false); // Hide after 3s
    //                 }, 3000);
    //             }
    //         } catch (error) {
    //             console.error("Error submitting form:", error);
    //         }
    //     }
    // };

    const handleInvitationDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/invitations/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`,
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                setReceivedInvitations(receivedInvitations.filter(inv => inv.id != id));
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleInvitationUpdate = async (id: string) => {
        const invitationToUpdate = receivedInvitations.find(inv => inv.id === id);
        if (!invitationToUpdate)
            return;
        try {
            const response = await fetch(`http://localhost:8080/api/invitations`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        ...invitationToUpdate,
                        isAccepted: true,
                    }
                )
            });
            if (response.ok) {
                setReceivedInvitations(receivedInvitations.filter(inv => inv.id != id));
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="flex flex-col gap-8 items-center w-full mt-8">
            <div className='org-container relative'>
                <h2 className="org-form-header">{receivedInvitations.length > 0 ? 'Gauti pakvietimai' : 'Gautų pakvietimų nėra'}</h2>
                {receivedInvitations.length > 0 && (
                    <div className='org-units-table'>
                        <div className='flex justify-between bg-green-200 w-full h-[40px] items-center mt-3'>
                            <div className='flex w-[30%] items-center justify-center'>
                                <h2>Gavimo data</h2>
                            </div>
                            <div className='flex w-full items-center justify-center'>
                                <h2>Pranešimas</h2>
                            </div>
                            <div className='flex w-[30%] items-center justify-center'>
                                <h2>Veiksmai</h2>
                            </div>
                        </div>
                        {receivedInvitations.map((invitation) => (
                            <ReceivedInvitationCard
                                key={invitation.id}
                                receivedInvitation={invitation}
                                sender={allUsers.find(u => u.id === invitation.senderId)}
                                organizationToJoin={allOrganizations.find(o => o.id === invitation.organizationId)}
                                handleInvitationUpdate={handleInvitationUpdate}
                                handleInvitationDelete={handleInvitationDelete}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Invitations;