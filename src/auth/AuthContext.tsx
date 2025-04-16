import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import {Organization, OrgUnit, User} from "../types.ts";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [orgUnit, setOrgUnit] = useState<OrgUnit | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get("jwt");
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setOrganization(null);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/auth", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsAuthenticated(true);
                    setUser(data);
                    const response1 = await fetch(`http://localhost:8080/api/users/${data.id}/organizations`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    })
                    if (response1.ok) {
                       const data1 = await response1.json();
                       setOrganization(data1);
                        const orgUnitId = Cookies.get("active-org-unit");
                        const response2 = await fetch(`http://localhost:8080/api/org-units/${orgUnitId}`, {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                            credentials: "include",
                        })
                        if(response2.ok) {
                            const data2 = await response2.json();
                            setOrgUnit(data2);
                        } else {
                            setOrgUnit(null)
                        }
                    } else {
                        setOrganization(null);
                    }

                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                    setOrganization(null);
                    Cookies.remove("jwt");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setIsAuthenticated(false);
                setUser(null);
                Cookies.remove("jwt");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, setUser, organization, setOrganization, orgUnit, setOrgUnit, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);