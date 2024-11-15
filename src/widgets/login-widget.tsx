import { useState } from "react";
import LoadingComponent from "../generals/LoadingComponent";
import { FetchUserGet, UserOutput } from "../features/FetchUserGet";

export default function LoginWidget({onLogin }: {onLogin?: () => void }) {
    const [loading, setLoading] = useState("none")
    const [user, setUser] = useState("")
    const [message, setMessage] = useState("")
    const [password, setPassword] = useState("")

    const login = async () => {
        setLoading("")
        const output = await FetchUserGet(user, password)
        console.log(output)
        if (output != null) {
            localStorage.setItem("token", (output as unknown as UserOutput).token)
            localStorage.removeItem("user")
            localStorage.removeItem("userid")
            onLogin ? onLogin() : null
        }
        else {
            setMessage('Użytkownik lub hasło są niepoprawne')
        }
        setLoading("none")
    }

    return (
        <>
            <div className="logincontainer">
                <div className="loginloading" style={{
                    display: loading,
                } }>
                    <LoadingComponent />
                </div>
                <div style={{
                    gridColumn: "1 / span 2"
                }}><h2>Logowanie</h2>
                    <h3>{message}</h3></div>
                <div>Użytkownik</div>
                <input type="text" value={user} onChange={(e) => setUser(e.target.value)} />
                <div>Hasło</div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input style={{
                    gridColumn: "1 / span 2"
                }}  type="button" onClick={login} value="Zaloguj się" />
            </div>
        </>
    );
}