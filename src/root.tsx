import { Route, Routes } from "react-router-dom";
import MenuComponent from "./components/menu-component";
import RootPage from "./pages/root-page";
import BaptismPage from "./pages/baptism-page";
import BibleCirclePage from "./pages/bible_circle-page";
import ChoirPage from "./pages/choir-page";
import CommunionPage from './pages/communion-page';
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
import { CreateNewUserInformation, User } from "./structs/user";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Root() {
    const [login, setLogin] = useState(false);
    const [selectUser, setSelectUser] = useState(false);
    const getParams = async ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => {
        const token = localStorage.getItem("token")
        if (token == null || type == "newtoken") {
            setLogin(login || show)
            return null
        }
        if (type == "token")
            return await func(token)
        if (type == "user") {
            const user = localStorage.getItem("user")
            const userID = localStorage.getItem("userid")
            if (user != null && userID != null) {
                const userObj = { id: userID, user: user } as User
                await CreateNewUserInformation({ getParams: getParams, user: userObj, name: 'name' })
                await CreateNewUserInformation({ getParams: getParams, user: userObj, name: 'surname' })
                await CreateNewUserInformation({ getParams: getParams, user: userObj, name: 'telefon' })
                await CreateNewUserInformation({ getParams: getParams, user: userObj, name: 'address' })
                await CreateNewUserInformation({ getParams: getParams, user: userObj, name: 'birthday' })
                await CreateNewUserInformation({ getParams: getParams, user: userObj, name: 'birthplace' })
                return await func(userObj)
            }
            setSelectUser(selectUser || show)
            return null
        }
        if (type == "newuser") {
            setSelectUser(selectUser || show)
            return null
        }
        return null
    }


    return (
        <>
            <MenuComponent getParams={getParams} />
            <Routes>
                <Route path="/" element={<RootPage getParams={getParams} />} />
                <Route path="/baptism" element={<BaptismPage />} />
                <Route path="/bible_circle" element={<BibleCirclePage />} />
                <Route path="/choir/*" element={<ChoirPage getParams={getParams} />} />
                <Route path="/communion/*" element={<CommunionPage getParams={getParams} />} />
                <Route path="/confession" element={<ConfessionPage />} />
                <Route path="/confirmation/*" element={<ConfirmationPage getParams={getParams} />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/intention/*" element={<IntentionPage getParams={getParams} />} />
                <Route path="/minister/*" element={<MinisterPage getParams={getParams} />} />
                <Route path="/obit/*" element={<ObitPage getParams={getParams} />} />
                <Route path="/pursuit_saint" element={<PursuitSaintPage />} />
                <Route path="/unction" element={<UnctionPage />} />
                <Route path="/user/*" element={<UserPage />} />
                <Route path="/trip/*" element={<TripPage getParams={getParams} />} />
            </Routes>
            <ToastContainer position='top-center' autoClose={2500} />
            {(selectUser || login) ? (<div className="popup" onClick={(e) => { if (e.currentTarget == e.target) { setLogin(false); setSelectUser(false) } }} >
                <div>
                    {login ? <LoginWidget onLogin={() => setLogin(false)} /> : selectUser ? <UsersWidget getParams={getParams} onSelected={() => setSelectUser(false)} /> : null}
                </div>
            </div>): null}
        </>
    );
}