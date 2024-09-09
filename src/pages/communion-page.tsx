import { Link, Route, Routes } from 'react-router-dom';
import baner from '../assets/communion.jpg';
import { useEffect, useState } from 'react';
import { CreateAdminRole, GetAdminRole, GetRole } from '../structs/role';
import { User } from '../structs/user';
import CommunionOverviewSubpage from '../components/communion/communion-overview-subpage';
import CommunionRegisterSubpage from '../components/communion/communion-register-subpage';
import CommunionDetailSubpage from '../components/communion/communion-detail-subpage';
import CommunionAdminSubpage from '../components/communion/communion-admin-subpage';

export default function CommunionPage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>; type: string; show: boolean; }) => Promise<unknown>; }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isToken, setIsToken] = useState(false);
    const [isRole, setIsRole] = useState(false);
    useEffect(() => {
        (async function () {
            getParams({
                func: async () => {
                    setIsToken(true);
                    getParams({
                        func: async (param: unknown) => {
                            const user = param as User;
                            setIsRole(await GetRole({ getParams: getParams, type: 'communion', user: user }) != null);
                            setIsAdmin(await GetAdminRole({ getParams: getParams, type: 'communion', user: user }) != null);
                        }, type: 'user', show: false
                    });
                }, type: 'token', show: false
            });
        }());
    }, [getParams]);
    const register = () => {
        (async function () {
            await getParams({
                func: async (param: unknown) => {
                    const user = param as User;
                    console.log(await CreateAdminRole({ getParams: getParams, type: 'communion', user: user }));
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
                        <h1>Komunia Święta</h1>
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
                        {isRole ? <li>
                            <Link to={`detail`}>Szczegóły</Link>
                        </li> : null}
                        {isAdmin ? <li>
                            <Link to={`admin`}>Admin</Link>
                        </li> : null}
                        <div className="clear"></div>
                    </ul>
                </div>
                <Routes>
                    <Route path="overview" element={<CommunionOverviewSubpage getParams={getParams} />} />
                    <Route path="register" element={<CommunionRegisterSubpage getParams={getParams} />} />
                    <Route path="detail" element={<CommunionDetailSubpage getParams={getParams} />} />
                    <Route path="admin" element={<CommunionAdminSubpage getParams={getParams} />} />
                </Routes>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące funkcjonalności:</p>
                    <ul>
                        <li>Zgłoszenie dziecka do Komunii</li>
                        <li>Sprawdzenie potrzebnych dokumentów do Komunii</li>
                        <li>Sprawdzenie postępu dziecka w zdawaniu</li>
                        <li>Zgłoszenie się na wyjazd w białym tygodniu</li>
                        <li>Sprawdzenie wszystkich terminów spotkań</li>
                        <li onDoubleClick={register}>Możliwość dodatkowych terminów do zdawania</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

