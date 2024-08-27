import { useState } from "react";
import LoadingComponent from "../generals/loading-component";
import { FetchUserGet, UserOutput } from "../features/FetchUserGet";

export default function LoginWidget({onLogin }: {onLogin?: () => void }) {
    const [loading, setLoading] = useState("none")
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")

    const login = async () => {
        setLoading("")
        const output = await FetchUserGet(user, password)
        console.log(output)
        if (output !== undefined) {
            localStorage.setItem("token", (output as unknown as UserOutput).token)
            localStorage.removeItem("user")
        }
        setLoading("none")
        onLogin ? onLogin() : null
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
                    gridColumn: "1 / span 2"
                }}>Logowanie</h2>
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