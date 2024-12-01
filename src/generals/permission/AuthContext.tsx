// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import LoginElement from "./LoginElement";
import { User } from "../../structs/user";
import UserElement from "./UserElement";
import { FetchInformationGetAll, StringOutput } from "../../features/NewFetchInformationGet";

interface AuthContextProps {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    selectUser: (user: User) => Promise<void>;
    logout: () => void;
    triggerLoginPopup: () => void;
    triggerUserPopup: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showUserPopup, setShowUserPopup] = useState(false);

    const fetchAuthState = async () => {
        try {
            const response = await fetch("https://zapp.hostingasp.pl/newuser/", {
                method: "GET",
                credentials: "include",
            });
            if (response.status == 200) {
                setIsAuthenticated(true);
                setToken(await response.text())
                const users = (await FetchInformationGetAll('string', 'user') as StringOutput[]).map<User>((output) => ({ id: output.id, user: output.output, roles: [] }))
                if (users.length == 1) {
                    selectUser(users[0]);
                }
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Error fetching auth state:", error);
        }
    };

    useEffect(() => {
        fetchAuthState();
        if (localStorage.getItem("user") != null) {
            setUser({ id: localStorage.getItem("userid"), user: localStorage.getItem("user"),roles: []})
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch("https://zapp.hostingasp.pl/newuser/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user: username, password }),
                credentials: "include",
            });

            if (response.ok) {
                await fetchAuthState();
                setShowLoginPopup(false);

            } else {
                console.error("Failed to log in");
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const logout = async () => {
        try {
            await fetch("https://zapp.hostingasp.pl/newuser/logout", {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
            localStorage.removeItem("user")
            localStorage.removeItem("userid")
            fetchAuthState();
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const selectUser = async (selectedUser: User) => {
        setUser(selectedUser)
        localStorage.setItem("user", selectedUser.user)
        localStorage.setItem("userid", selectedUser.id)
    };

    const triggerLoginPopup = () => {
        setShowLoginPopup(true);
    };

    const triggerUserPopup = () => {
        setShowUserPopup(true);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, triggerLoginPopup, triggerUserPopup, selectUser }}>
            {children}
            {showLoginPopup && <LoginElement onClose={() => setShowLoginPopup(false)} />}
            {(!showLoginPopup && showUserPopup) && <UserElement onSelected={() => setShowUserPopup(false)} />}
        </AuthContext.Provider>
    );
};
