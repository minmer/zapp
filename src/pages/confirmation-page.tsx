import { Link, Route, Routes } from 'react-router-dom';
import baner from '../assets/confirmation.jpg'
import ConfirmationOverviewSubpage from '../components/confirmation/confirmation-overview-subpage';
import ConfirmationRegisterSubpage from '../components/confirmation/confirmation-register-subpage';
import ConfirmationAdminSubpage from '../components/confirmation/confirmation-admin-subpage';
import ConfirmationDetailSubpage from '../components/confirmation/confirmation-detail-subpage';
import { useEffect, useState } from 'react';
import { User } from '../structs/user';
import { CreateAdminRole, GetAdminRole, GetRole } from '../structs/role';
import ConfirmationPlanSubpage from '../components/confirmation/confirmation-plan-subpage';
import ConfirmationChatSubpage from '../components/confirmation/confirmation-chat-subpage';
import { useAuth } from '../generals/permission/AuthContext';
export default function ConfirmationPage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
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
    const register = () => {
        (async function () {
            await getParams({
                func: async (param: string | User) => {
                    const user = param as User;
                    console.log(await CreateAdminRole({ type: 'confirmation', user: user }));
                }, type: 'user', show: true
            });
        })();
    };
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
                        <h1>Bierzmowanie</h1>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        <li>
                            <Link to={`overview`}>Ogólne informacje</Link>
                        </li>
                        {user && !(isRole || isAdmin) ? <li>
                            <Link to={`register`}>Zapisy</Link>
                        </li> : null}
                        {isRole || isAdmin ? <li>
                            <Link to={`detail/-`}>Szczegóły</Link>
                        </li> : null}
                        {isRole || isAdmin ? <li>
                            <Link to={`plan/-`}>Katechumenat</Link>
                        </li> : null}
                        {/*isRole || isAdmin ? <li>
                            <Link to={`chat`}>Chat</Link>
                        </li> : null*/}
                        {isAdmin ? <li>
                            <Link to={`admin`}>Admin</Link>
                        </li> : null}
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
                    <Route path="overview" element={<ConfirmationOverviewSubpage getParams={getParams} />} />
                    <Route path="register" element={<ConfirmationRegisterSubpage getParams={getParams} />} />
                    <Route path="detail/:role_id" element={<ConfirmationDetailSubpage />} />
                    <Route path="plan/:role_id" element={<ConfirmationPlanSubpage getParams={getParams} />} />
                    <Route path="chat/*" element={<ConfirmationChatSubpage getParams={getParams} />} />
                    <Route path="admin" element={<ConfirmationAdminSubpage />} />
                </Routes>
                <div className="description">
                    <p>Aby móc korzystać ze strony internetowej należy się zalogować.</p>
                </div>
            </div>
        </>
    );
}