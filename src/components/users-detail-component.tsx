import { useParams } from "react-router-dom";
import { FetchReloadToken } from "../features/FetchReloadToken";
import { useState } from "react";

export default function UsersDetailElement() {
    const { token } = useParams();
    const [message, setMessage] = useState("");

    const reloadWallet = () => {
        setMessage("")
        console.log(FetchReloadToken(token ?? ''))
        setMessage("Reloaded wallet")
    }

    return (
        <>
            <input type="button" onClick={reloadWallet} value="Reload Wallet" />
            {message}
        </>
    );
}