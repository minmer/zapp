import { Route, Routes } from "react-router-dom";
import MenuComponent from "./components/menu-component";
import RootPage from "./pages/root-page";
import BaptismPage from "./pages/baptism-page";
import BibleCirclePage from "./pages/bible_circle-page";
import ChoirPage from "./pages/choir-page";
import CommunionPage from "./pages/communion-page";
import ConfessionPage from "./pages/confession-page";
import ConfirmationPage from "./pages/confirmation-page";
import FinancePage from "./pages/finance-page";
import IntentionPage from "./pages/intention-page";
import MinisterPage from "./pages/minister-page";
import ObitPage from "./pages/obit-page";
import PursuitSaintPage from "./pages/pursuit_saint-page";
import UnctionPage from "./pages/unction-page";
import UserPage from "./pages/user-page";
import TripPage from "./pages/trip-page";
import { useState } from "react";
import LoginWidget from "./widgets/login-widget";
import UsersWidget from "./widgets/users-widget";
import { User } from "./structs/user";

export default function Root() {
    const [login, setLogin] = useState(false);
    const [selectUser, setSelectUser] = useState(false);
    const getParams = async ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => {
        if (type == "token")
        {
            const token = localStorage.getItem("token")
            if (token != null)
                return await func(token)
            setLogin(login || show)
            return null
        }
        if (type == "user") {
            const user = localStorage.getItem("user")
            const userID = localStorage.getItem("userid")
            if (user != null && userID != null)
                return await func({ id: userID, user: user } as User)
            setSelectUser(selectUser || show)
            return null
        }
        return null
    }

    return (
        <>
            <MenuComponent />
            <Routes>
                <Route path="/" element={<RootPage getParams={getParams} />} />
                <Route path="/baptism" element={<BaptismPage />} />
                <Route path="/bible_circle" element={<BibleCirclePage />} />
                <Route path="/choir" element={<ChoirPage />} />
                <Route path="/communion/*" element={<CommunionPage />} />
                <Route path="/confession" element={<ConfessionPage />} />
                <Route path="/confirmation/*" element={<ConfirmationPage getParams={getParams} />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/intention/*" element={<IntentionPage getParams={getParams} />} />
                <Route path="/minister/*" element={<MinisterPage />} />
                <Route path="/obit/*" element={<ObitPage getParams={getParams} />} />
                <Route path="/pursuit_saint" element={<PursuitSaintPage />} />
                <Route path="/unction" element={<UnctionPage />} />
                <Route path="/user/*" element={<UserPage />} />
                <Route path="/trip/*" element={<TripPage getParams={getParams} />} />
            </Routes>

            <div className="login-button" onClick={() => setLogin(true)} />
            <div style={{ right: "3em" }} className="login-button" onClick={() => { localStorage.removeItem("user") }} />
            {(selectUser || login) ? (<div className="popup" onClick={(e) => { if (e.currentTarget == e.target) { setLogin(false); setSelectUser(false) } }} >
                <div>
                    {login ? <LoginWidget onLogin={() => setLogin(false)} /> : null}
                    {selectUser ? <UsersWidget getParams={getParams} onSelected={() => setSelectUser(false)} /> : null}
                </div>
            </div>): null}
        </>
    );
}