import { useState } from "react";
import LoadingComponent from "./loading-component";
import { useNavigate } from "react-router-dom";

export default function LoginComponent() {
    const [loading, setLoading] = useState("none")
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    const login = () => {
        setLoading("")
        navigate('/token');
    }

    return (
        <>
            <div className="logincontainer">
                <div className="loginloading" style={{
                    display: loading,
                } }>
                    <LoadingComponent />
                </div>
                <h2 style={{
                    gridColumn: "1 / span 2",
                    gridRow: "1"
                }} >Logowanie</h2>
                <div style={{
                    gridColumn: "1",
                    gridRow: "2"
                }} >Użytkownik</div>
                <input style={{
                    gridColumn: "2",
                    gridRow: "2"
                }}  type="text" value={user} onChange={(e) => setUser(e.target.value)} />
                <div style={{
                    gridColumn: "1",
                    gridRow: "3"
                }} >Hasło</div>
                <input style={{
                    gridColumn: "2",
                    gridRow: "3"
                }}  type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input style={{
                    gridColumn: "1 / span 2",
                    gridRow: "4"
                }}  type="button" onClick={login} value="Zaloguj się" />
            </div>
        </>
    );
}