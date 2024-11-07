// src/components/LoginPopup.tsx
import React, { useState } from "react";
import { useAuth } from "./AuthContext";

interface LoginElementProps {
    onClose: () => void;
}

const LoginPopup: React.FC<LoginElementProps> = ({ onClose }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            onClose();
        } catch {
            setError("Invalid credentials, please try again.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="close-btn">?</button>
                <h2>Login</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPopup;
