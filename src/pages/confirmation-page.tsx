import { Link, Route, Routes } from 'react-router-dom';
import baner from '../assets/confirmation.jpg'
import ConfirmationOverviewSubpage from '../components/confirmation/confirmation-overview-subpage';
import ConfirmationRegisterSubpage from '../components/confirmation/confirmation-register-subpage';
import ConfirmationAdminSubpage from '../components/confirmation/confirmation-admin-subpage';
import ConfirmationDetailSubpage from '../components/confirmation/confirmation-detail-subpage';
import { useEffect, useState } from 'react';
import { User } from '../structs/user';
import { CreateAdminRole, GetAdminRole, GetRole } from '../structs/role';
export default function ConfirmationPage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [isAdmin, setIsAdmin] = useState(false)
    const [isToken, setIsToken] = useState(false)
    const [isRole, setIsRole] = useState(false)
    useEffect(() => {
        (async function () {
            getParams({
                func: async () => {
                    setIsToken(true)
                    getParams({
                        func: async (param: unknown) => {
                            const user = param as User
                            setIsRole(await GetRole({ getParams: getParams, type: 'confirmation', user: user }) != null)
                            setIsAdmin(await GetAdminRole({ getParams: getParams, type: 'confirmation', user: user }) != null)
                        }, type: 'user', show: false
                    });
                }, type: 'token', show: false
            });
        }());
    }, [getParams])
    const register = () => {
        (async function () {
            await getParams({
                func: async (param: unknown) => {
                    const user = param as User;
                    console.log(await CreateAdminRole({ getParams: getParams, type: 'confirmation', user: user }));
                }, type: 'user', show: true
            });
        })();
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
                        {isToken ? <li>
                            <Link to={`register`}>Zapisy</Link>
                        </li> : null}
                        {isRole || isAdmin ? <li>
                            <Link to={`detail`}>Szczegóły</Link>
                        </li> : null}
                        {isAdmin ? <li>
                            <Link to={`admin`}>Admin</Link>
                        </li> : null}
                        <div className="clear"></div>
                    </ul>
                </div>
                <Routes>
                    <Route path="overview" element={<ConfirmationOverviewSubpage getParams={getParams} />} />
                    <Route path="register" element={<ConfirmationRegisterSubpage getParams={getParams} />} />
                    <Route path="detail" element={<ConfirmationDetailSubpage getParams={getParams} />} />
                    <Route path="admin" element={<ConfirmationAdminSubpage getParams={getParams} />} />
                </Routes>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące funkcjonalności:</p>
                    <ul>
                        <li>Zgłoszenie do Bierzmowania</li>
                        <li>Sprawdzenie potrzebnych dokumentów do Bierzmowani</li>
                        <li>Sprawdzenie wszystkich terminów spotkań</li>
                        <li onDoubleClick={register}>Kontakt z kapłanem w sprawie bierzmowania</li>
                    </ul>
                </div>
            </div>
        </>
    );
}