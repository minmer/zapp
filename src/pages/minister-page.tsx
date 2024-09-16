import { Link, Route, Routes } from 'react-router-dom';
import baner from '../assets/minister.jpg'
import { CreateAdminRole, GetAdminRole, GetRole } from '../structs/role';
import { User } from '../structs/user';
import MinisterOverviewSubpage from '../components/minister/minister-overview-subpage';
import MinisterRegisterSubpage from '../components/minister/minister-register-subpage';
import MinisterDetailSubpage from '../components/minister/minister-detail-subpage';
import MinisterAdminSubpage from '../components/minister/minister-admin-subpage';
import { useEffect, useState } from 'react';
import MinisterEncyclopaediaSubpage from '../components/minister/minister-encyclopaedia-subpage';
export default function MinisterPage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
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
                            setIsRole(await GetRole({ getParams: getParams, type: 'minister', user: user }) != null)
                            setIsAdmin(await GetAdminRole({ getParams: getParams, type: 'minister', user: user }) != null)
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
                    const user = param as User
                    console.log(await CreateAdminRole({ getParams: getParams, type: 'minister', user: user }))
                }, type: 'user', show: true
            });
        })();
    }

    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Służba liturgiczna</h1>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        <li>
                            <Link to={`overview`}>Ogólne informacje</Link>
                        </li>
                        <li>
                            <Link to={`encyclopaedia`}>Skarbiec wiedzy</Link>
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
                    <Route path="overview" element={<MinisterOverviewSubpage getParams={getParams} />} />
                    <Route path="encyclopaedia" element={<MinisterEncyclopaediaSubpage getParams={getParams} />} />
                    <Route path="register" element={<MinisterRegisterSubpage getParams={getParams} />} />
                    <Route path="detail" element={<MinisterDetailSubpage getParams={getParams} />} />
                    <Route path="admin" element={<MinisterAdminSubpage getParams={getParams} />} />
                </Routes>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące funkcjonalności:</p>
                    <ul>
                        <li>Sprawdzenie najbliższych wydarzeń LSO</li>
                        <li>Zapisywanie się na wyjazdy</li>
                        <li>Zgłoszenie się do służenia na uroczyste asyste</li>
                        <li>Sprawdzenie sprawozdania finansowego wspólnej kasy</li>
                        <li>Organizacja kolędy</li>
                        <li onDoubleClick={register}>Kontakt w ramach LSO</li>
                    </ul>
                </div>
            </div>
        </>
    );
}