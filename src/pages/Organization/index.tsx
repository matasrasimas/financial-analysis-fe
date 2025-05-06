import React, {useEffect, useState} from "react";
import {faPlus, faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import type {Invitation, Organization, OrgUnit, User} from "../../types.ts";
import '../../App.css'
import {Link} from "react-router-dom";
import {useAuth} from "../../auth/AuthContext.tsx";
import Cookies from "js-cookie";
import './styles.css'
import OrgUnitCard from "./OrgUnits/OrgUnitCard";
import SentInvitationCard from "./SentInvitationCard";

const Organization = () => {
    const {organization, setOrganization, user} = useAuth()
    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([])
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [organizationToEdit, setOrganizationToEdit] = useState<Organization>({
        id: organization.id,
        userId: organization.userId,
        title: organization.title,
        code: organization.code,
        address: organization.address,
        yearlyGoal: organization.yearlyGoal,
    })
    const [orgTitleError, setOrgTitleError] = useState<string>('')
    const [yearlyGoalError, setYearlyGoalError] = useState<string>('')

    const [allOrganizations, setAllOrganizations] = useState<Organization[]>([])
    const [availableOrganizations, setAvailableOrganizations] = useState<Organization[]>([])

    const [availableUsers, setAvailableUsers] = useState<User[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [sentInvitations, setSentInvitations] = useState<Invitation[]>([])
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

        fetchOrganizations();
    }, []);

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

        const fetchUsersAndInvitations = async () => {
            if (!organization || !user || allOrganizations.length == 0)
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
                const response1 = await fetch(`http://localhost:8080/api/organizations/${organization.id}/invitations`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response1.ok) {
                    const data1 = await response1.json();
                    setSentInvitations(data1);
                    const usersIds = data1.map(inv => inv.receiverId);
                    setAllUsers(data)
                    setAvailableUsers(data.filter(u => u.id !== user.id && !usersIds.includes(u.id)))
                    const response2 = await fetch(`http://localhost:8080/api/users/${user.id}/received-invitations`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${Cookies.get('jwt')}`,
                            "Content-Type": "application/json",
                        },
                    });
                    if (response2.ok) {
                        const data2 = await response2.json()
                        const acceptedInvitations = data2.filter(inv => inv.isAccepted).map(inv => inv.organizationId);
                        const userOrganization = allOrganizations.find(org => org.userId === user.id);
                        setAvailableOrganizations(allOrganizations.filter(org => org.id === userOrganization.id || acceptedInvitations.includes(org.id)));
                    }
                }
            }
        };

        fetchOrgUnits();
        fetchUsersAndInvitations();
    }, [organization.id, user.id, allOrganizations]);

    const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrganizationToEdit({...organizationToEdit, [e.target.name]: e.target.value});
    }

    const validateFields = () => {
        const titleError = organizationToEdit.title.length == 0 ? 'Šis laukas yra privalomas' : ''
        setOrgTitleError(titleError)
        const goalError = organizationToEdit.yearlyGoal <= 0 ? 'Metinis tikslas negali būti 0 arba mažiau' : ''
        setYearlyGoalError(goalError)
        return titleError == '' && goalError == ''
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateFields()) {
            try {
                const response = await fetch("http://localhost:8080/api/organizations", {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('jwt')}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        {
                            id: organizationToEdit.id,
                            userId: organizationToEdit.userId,
                            title: organizationToEdit.title,
                            code: organizationToEdit.code && organizationToEdit.code.length == 0 ? null : organizationToEdit.code,
                            address: organizationToEdit.address && organizationToEdit.address.length == 0 ? null : organizationToEdit.address,
                            yearlyGoal: organizationToEdit.yearlyGoal,
                        }
                    )
                });
                if (response.ok) {
                    setOrganizationToEdit({
                        id: organizationToEdit.id,
                        userId: organizationToEdit.userId,
                        title: organizationToEdit.title,
                        code: organizationToEdit.code,
                        address: organizationToEdit.address,
                        yearlyGoal: organizationToEdit.yearlyGoal,
                    })
                    setOrganization({
                        id: organizationToEdit.id,
                        userId: organizationToEdit.userId,
                        title: organizationToEdit.title,
                        code: organizationToEdit.code,
                        address: organizationToEdit.address,
                        yearlyGoal: organizationToEdit.yearlyGoal,
                    })
                    setShowSnackbar(true); // Show snackbar

                    setTimeout(() => {
                        setShowSnackbar(false); // Hide after 3s
                    }, 3000);
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };

    const handleOrgUnitDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/org-units/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`,
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                setOrgUnits(orgUnits.filter(orgUnit => orgUnit.id != id));
            }
        } catch (e) {
            console.error(e);
        }
    }

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
                setSentInvitations(sentInvitations.filter(inv => inv.id != id));
            }
        } catch (e) {
            console.error(e);
        }
    }

    const enterOrganization = (orgId: string) => {
        Cookies.set('active-org', orgId);
        window.location.href = '/';
    }

    const sendInvitation = async (input: string) => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
        const dd = String(today.getDate()).padStart(2, '0');

        const formattedDate = `${yyyy}-${mm}-${dd}`;
        try {
            const response = await fetch(`http://localhost:8080/api/invitations`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderId: user.id,
                    receiverId: input,
                    organizationId: organization.id,
                    createdAt: formattedDate,
                    isAccepted: false
                })
            });
            if (response.ok) {
                const data: Invitation = await response.json();
                setSentInvitations([
                    ...sentInvitations,
                    data
                ])
                setAvailableUsers(availableUsers.filter(u => u.id !== input))
                setOpen(false)
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="flex flex-col gap-8 items-center w-full mt-8">
            {user.id === organization.userId && (
                <form className='org-container relative h-[220px]' onSubmit={handleSubmit}>
                    <h2 className="org-form-header">Organizacijos nustatymai</h2>
                    <div className='flex w-full justify-between px-10 gap-8 mt-5'>
                        <div className='flex w-full flex-col w-full items-start h-[80px]'>
                            <label className='org-input-label' htmlFor='title'>Pavadinimas:</label>
                            <input
                                type='text'
                                className={`org-input ${orgTitleError ? 'border-red-500 border-[1px]' : 'border-[#dddddd] border-[1px]'}`}
                                name='title'
                                value={organizationToEdit.title}
                                onChange={handleOrganizationChange}
                            />
                            {orgTitleError && (
                                <p className='text-red-500 text-[14px]'>{orgTitleError}</p>
                            )}
                        </div>
                        <div className='flex w-full flex-col w-full items-start h-[80px]'>
                            <label className='org-input-label' htmlFor='code'>Kodas:</label>
                            <input
                                type='text'
                                className='org-input border-[#dddddd] border-[1px]'
                                name='code'
                                value={organizationToEdit.code}
                                onChange={handleOrganizationChange}
                            />
                        </div>
                        <div className='flex w-full flex-col w-full items-start h-[60px]'>
                            <label className='org-input-label' htmlFor='address'>Adresas:</label>
                            <input
                                type='text'
                                className='org-input border-[#dddddd] border-[1px]'
                                name='address'
                                value={organizationToEdit.address}
                                onChange={handleOrganizationChange}
                            />
                        </div>
                    </div>

                    <div className='flex flex-row w-full justify-between items-center'>

                        <div className='flex flex-col w-full items-start pl-10'>
                            <label className='org-input-label' htmlFor='yearlyGoal'>Metų tikslas, €:</label>
                            <input
                                type='number'
                                className={`yearly-goal-input ${yearlyGoalError ? 'border-red-500 border-[1px]' : 'border-[#dddddd] border-[1px]'}`}
                                name='yearlyGoal'
                                value={organizationToEdit.yearlyGoal}
                                onChange={handleOrganizationChange}
                            />
                            {yearlyGoalError && (
                                <p className='text-red-500 text-[14px]'>{yearlyGoalError}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='bg-[#00592b] absolute bottom-5 w-[125px] h-[40px] text-white font-bold text-[16px] rounded-md cursor-pointer hover:text-yellow-500 self-end mr-10'>
                        Saugoti
                    </button>

                </form>
            )}

            {user.id === organization.userId && (
                <div className='org-container relative'>
                    <h2 className="org-form-header">Naudotojai, turintys prieigą prie organizacijos</h2>
                    <div className='org-units-table'>
                        <div className='flex justify-between bg-green-200 w-full h-[40px] items-center mt-3'>
                            <div className='flex w-full items-center justify-center'>
                                <h2>Vardas, pavardė</h2>
                            </div>
                            <div className='flex w-full items-center justify-center'>
                                <h2>El. paštas</h2>
                            </div>
                            <div className='flex w-full items-center justify-center'>
                                <h2>Būsena</h2>
                            </div>
                            <div className='flex w-full items-center justify-center'>
                                <h2>Veiksmai</h2>
                            </div>
                        </div>
                        {sentInvitations.map((invitation) => (
                            <SentInvitationCard
                                key={invitation.id}
                                sentInvitation={invitation}
                                receiver={allUsers.find(u => u.id === invitation.receiverId)}
                                handleInvitationDelete={handleInvitationDelete}/>
                        ))}
                    </div>

                    <div className="absolute, top-0">
                        <button
                            onClick={() => setOpen(!open)}
                            className="absolute w-[40px] h-[40px] bg-[#00592b] top-0 items-center justify-center flex cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-white font-bold text-[20px]"/>
                        </button>

                        {open && (
                            <div
                                className="absolute top-[50px] left-0 bg-white border shadow-md rounded-md w-64 max-h-[200px] overflow-y-auto z-50">
                                {availableUsers.map((user, index) => (
                                    <div
                                        key={index}
                                        onClick={() => sendInvitation(user.id)}
                                        className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                    >
                                        <div className="font-semibold">{user.firstName} {user.lastName}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className='org-container relative'>
                <h2 className="org-form-header">Padaliniai</h2>
                <div className='org-units-table'>
                    <div className='flex justify-between bg-green-200 w-full h-[40px] items-center mt-3'>
                        <div className='flex w-full items-center justify-center'>
                            <h2>Pavadinimas</h2>
                        </div>
                        <div className='flex w-full items-center justify-center'>
                            <h2>Kodas</h2>
                        </div>
                        <div className='flex w-full items-center justify-center'>
                            <h2>Adresas</h2>
                        </div>

                        {user.id === organization.userId && (
                            <div className='flex w-full items-center justify-center'>
                                <h2>Veiksmai</h2>
                            </div>
                        )}

                    </div>
                    {orgUnits.map((orgUnit) => (
                        <OrgUnitCard key={orgUnit.id} orgUnit={orgUnit} handleOrgUnitDelete={handleOrgUnitDelete}
                                     displayTrashCan={orgUnits.length > 1}/>
                    ))}
                </div>
                {user.id === organization.userId && (
                    <Link
                        to='/org-unit-create'
                        className='absolute w-[40px] h-[40px] bg-[#00592b] top-0 items-center justify-center flex cursor-pointer'>
                        <FontAwesomeIcon icon={faPlus} className='text-white font-bold text-[20px]'/>
                    </Link>
                )}
            </div>

            <div className='org-container h-auto'>
                <h2 className="org-form-header mb-2">Organizacijos</h2>

                <div className="grid grid-cols-4 gap-4 p-3">
                    {availableOrganizations.map((org) => (
                        <div
                            onClick={() => {
                                enterOrganization(org.id)
                            }}
                            key={org.id}
                            className={`flex flex-col items-center justify-center ${org.id === organization.id ? 'bg-[#007b2b]' : 'bg-blue-500'} text-white rounded p-2 gap-2 cursor-pointer`}>
                            <h2 className='font-bold'>{org.title}</h2>
                            <FontAwesomeIcon icon={faRightToBracket} className='text-white font-bold text-[25px]'/>
                            {allUsers.length > 0 && (
                                <p className='text-[14px]'>{allUsers.find(u => u.id == org.userId).firstName} {allUsers.find(u => u.id == org.userId).lastName} organizacija</p>
                            )}

                        </div>
                    ))}
                </div>
            </div>

            {showSnackbar && (
                <div className="snackbar">
                    Organizacija sėkmingai atnaujinta!
                </div>
            )}
        </div>
    );
}

export default Organization;