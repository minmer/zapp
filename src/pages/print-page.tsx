import { Route, Routes} from 'react-router-dom';
import { CreateNewUserInformation, User } from '../structs/user';
import PrintIntentionbookSubpage from '../components/print/print-intentionbook-subpage';
import { useState } from 'react';
import LoginWidget from '../widgets/login-widget';
import PrintConfirmationaimsSubpage from '../components/print/print-confirmationaims-subpage';
import UsersWidget from '../widgets/users-widget';
import PrintIntentionreportSubpage from '../components/print/print-intentionreport-subpage';
export default function PrintPage() {

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
                await CreateNewUserInformation({ user: userObj, name: 'name' })
                await CreateNewUserInformation({ user: userObj, name: 'surname' })
                await CreateNewUserInformation({ user: userObj, name: 'telefon' })
                await CreateNewUserInformation({ user: userObj, name: 'address' })
                await CreateNewUserInformation({ user: userObj, name: 'birthday' })
                await CreateNewUserInformation({ user: userObj, name: 'birthplace' })
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
            <Routes>
                <Route path="intentionreport/:start/:end" element={<PrintIntentionreportSubpage getParams={getParams} />} />
                <Route path="intentionbook/:year" element={<PrintIntentionbookSubpage getParams={getParams} />} />
                <Route path="confirmationaims" element={<PrintConfirmationaimsSubpage getParams={getParams} />} />
            </Routes>
            {(selectUser || login) ? (<div className="popup" onClick={(e) => { if (e.currentTarget == e.target) { setLogin(false); setSelectUser(false) } }} >
                <div>
                    {login ? <LoginWidget onLogin={() => setLogin(false)} /> : selectUser ? <UsersWidget onSelected={() => setSelectUser(false)} /> : null}
                </div>
            </div>) : null}
        </>
    );
}