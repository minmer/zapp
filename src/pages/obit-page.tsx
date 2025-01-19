import { Link, Route, Routes} from 'react-router-dom';
import baner from '../assets/obit.jpg'
import { FetchOwnerGet } from '../features/FetchOwnerGet';
import { useEffect, useState } from 'react';
import ObitsIntentionsComponent from '../components/obits-intentions-component';
import ObitsEditComponent from '../components/obits-edit-component';
import { User } from '../structs/user';
import ObitPrintSubpage from '../components/Obit/ObitPrintSubpage';
import { GetAdminRole, GetRole } from '../structs/role';
import { useAuth } from '../generals/permission/AuthContext';
export default function ObitPage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [isAdmin, setIsAdmin] = useState(false)
    const [isRole, setIsRole] = useState(false)
    const { triggerLoginPopup, triggerUserPopup, isAuthenticated, user, logout } = useAuth()
    useEffect(() => {
        (async function () {
            if (user != null) {
                setIsRole(await GetRole({ type: 'confirmation', user: user }) != null)
                setIsAdmin(await GetAdminRole({ type: 'confirmation', user: user }) != null)
            }
        })();
    }, [getParams, user])
    const selectUser = () => {
        if (!isAuthenticated)
            triggerLoginPopup();
        if (!user)
            triggerUserPopup();
    };
    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Pogrzeby</h1>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        <li>
                            <Link to={`intentions`}>Intencje</Link>
                        </li>
                        <li style={{
                            display: isAdmin ? 'block' : 'none',
                        }}>
                            <Link to={`edit`}>Edytuj</Link>
                        </li>
                        <li style={{
                            display: isAdmin ? 'block' : 'none',
                        }}>
                            <Link to={`print`}>Szablony</Link>
                        </li>
                        {!(isRole || isAdmin) ? <li>
                            <a onClick={selectUser}>Zaloguj</a>
                        </li> : null}
                        {isRole || isAdmin ? <li>
                            <a onClick={logout}>Wyloguj</a>
                        </li> : null}
                        <div className="clear"></div>
                    </ul>
                </div>
                <Routes>
                    <Route path="intentions/*" element={<ObitsIntentionsComponent />} />
                    <Route path="edit/*" element={<ObitsEditComponent getParams={getParams} />} />
                    <Route path="print/*" element={<ObitPrintSubpage />} />
                </Routes>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące funkcjonalności:</p>
                    <ul>
                        <li>Sprawdzenie najbliższych pogrzebów</li>
                        <li>Sprawdzanie terminów Mszy Świętych pogrzebowych</li>
                        <li>Dopisanie intencji pogrzebowych</li>
                    </ul>
                </div>
            </div>
        </>
    );
}