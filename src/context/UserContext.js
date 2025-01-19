// context/UserContext.js
"use client"
import React, { createContext, useContext, useState, useEffect } from "react";
import { getLoginUser } from "@/services/session.service";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isUserLoaded, setIsUserLoaded] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getLoginUser();
            setUser(data);
            setIsUserLoaded(true);
        };
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, isUserLoaded }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
