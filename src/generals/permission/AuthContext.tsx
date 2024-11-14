// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import LoginElement from "./LoginElement";

interface AuthContextProps {
    user: string | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    triggerLoginPopup: () => void;
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
            const response = await fetch("https://zapp.hostingasp.pl/newuser/", {
                method: "GET",
                credentials: "include",
            });

            if (response.status == 200) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Error fetching auth state:", error);
        }
    };

    useEffect(() => {
        fetchAuthState();
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
                setIsAuthenticated(true);
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
            fetchAuthState();
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const triggerLoginPopup = () => {
        setShowLoginPopup(true);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, triggerLoginPopup }}>
            {children}
            {showLoginPopup && <LoginElement onClose={() => setShowLoginPopup(false)} />}
        </AuthContext.Provider>
    );
};
