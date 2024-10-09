import { Route, Routes} from 'react-router-dom';
import { User } from '../structs/user';
import PrintIntentionbookSubpage from '../components/print/print-intentionbook-subpage';
import { useState } from 'react';
import LoginWidget from '../widgets/login-widget';
export default function PrintPage() {

    const [login, setLogin] = useState(false);
    const getParams = async ({ func, type }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => {
        const token = localStorage.getItem("token")
        if (token == null) {
            setLogin(login)
            return null
        }
        if (type == "token")
            return await func(token)
        return null
    }

    return (

        <>
            {login ? <LoginWidget onLogin={() => setLogin(false)} /> : null}
            <Routes>
                <Route path="intentionbook/:year" element={<PrintIntentionbookSubpage getParams={getParams} />} />
            </Routes>
        </>
    );
}