import { useParams } from "react-router-dom";
import { FetchReloadToken } from "../features/FetchReloadToken";

export default function UsersDetailElement() {
    const { token } = useParams();

    const reloadWallet = () => {
        console.log(FetchReloadToken(token ?? ''))

    }

    return (
        <>
            <input type="button" onClick={reloadWallet} value="Reload Wallet" />
        </>
    );
}