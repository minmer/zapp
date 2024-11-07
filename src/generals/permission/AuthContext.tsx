// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import LoginElement from "./LoginElement";

interface AuthContextProps {
    user: string | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    fetchAuthState: () => Promise<void>;
    triggerLoginPopup: () => void;  // To trigger login popup
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
    const [user, setUser] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const fetchAuthState = async () => {
        try {
            const response = await fetch("https://zapp.hostingasp.pl/user/get", {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Error fetching auth state:", error);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch("https://zapp.hostingasp.pl/user/get", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ User: username, Password: password }),
                credentials: "include",
            });

            if (response.ok) {
                await fetchAuthState();
                setShowLoginPopup(false); // Close popup on successful login
            } else {
                console.error("Failed to log in");
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const logout = async () => {
        try {
            await fetch("/api/user/logout", {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const triggerLoginPopup = () => {
        setShowLoginPopup(true);
    };

    useEffect(() => {
        fetchAuthState();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, fetchAuthState, triggerLoginPopup }}>
            {children}
            {showLoginPopup && <LoginElement onClose={() => setShowLoginPopup(false)} />}
        </AuthContext.Provider>
    );
};
