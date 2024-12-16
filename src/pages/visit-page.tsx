import { Link, Routes, Route } from 'react-router-dom';
import baner from '../assets/visit.jpg'
import VisitCheckSubpage from '../components/visit/VisitCheckSubpage';
import VisitMinisterSubpage from '../components/visit/VisitMinisterSubpage';
import VisitPriestSubpage from '../components/visit/VisitPriestSubpage';
import VisitRegisterSubpage from '../components/visit/VisitRegisterSubpage';
import { useEffect, useState } from 'react';
import { User } from '../structs/user';
import { GetAdminRole, GetRole } from '../structs/role';
import { useAuth } from '../generals/permission/AuthContext';

export default function VisitPage() {
    const [isMinister, setIsMinister] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { triggerLoginPopup, isAuthenticated, user, logout } = useAuth();

    useEffect(() => {
        (async function () {
            if (user != null) {
                setIsMinister(await GetRole({ type: 'minister', user: user }) != null);
                setIsAdmin(await GetAdminRole({ type: 'minister', user: user }) != null);
            }
        })();
    }, [user]);

    const selectUser = () => {
        if (!isAuthenticated)
            triggerLoginPopup();
    };

    return (
        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Kolęda</h1>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        <li>
                            <Link to={`check`}>Sprawdź godzinę</Link>
                        </li>
                        <li>
                            <Link to={`register`}>Zgłoś obecność</Link>
                        </li>
                        {isMinister || isAdmin ? <li>
                            <Link to={`minister`}>Ministranci</Link>
                        </li> : null}
                        {isAdmin ? <li>
                            <Link to={`priest`}>Admin</Link>
                        </li> : null}
                        {!isAuthenticated ? <li>
                            <a onClick={selectUser}>Zaloguj</a>
                        </li> : <li>
                            <a onClick={logout}>Wyloguj</a>
                        </li>}
                        <div className="clear"></div>
                    </ul>
                </div>
                <Routes>
                    <Route path="" element={
                        <div className="description">
                            <p>Wybierz jedną ze zakładek</p>
                        </div>} />
                    <Route path="check" element={<VisitCheckSubpage />} />
                    <Route path="register" element={<VisitRegisterSubpage />} />
                    <Route path="minister" element={<VisitMinisterSubpage />} />
                        <Route path="priest" element={<VisitPriestSubpage />} />
                </Routes>
            </div>
        </>
    );
}