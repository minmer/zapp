import { Link, Route, Routes, useParams } from 'react-router-dom';
import baner from '../assets/user.jpg'
import { useEffect, useState } from 'react';
import { FetchGetAll } from '../features/FetchGet';
import UsersDetailComponent from '../components/users-detail-component';
import UserPermissionsComponent from '../components/user-permissions-component';
import UserDescendantComponent from '../components/user-descendants-component';
export default function UserPage() {
    const { token } = useParams();
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        (async function () {
            try {
                if (token !== undefined) {
                    setIsAdmin(((await FetchGetAll('text', token, 'admin') as []).length == 0 ? false : true))
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token])
    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>UserPage</h1>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        <li style={{
                            display: isAdmin ? 'block' : 'none',
                        }}>
                            <Link to={`detail`}>Pogląd</Link>
                        </li>
                        <li style={{
                            display: isAdmin ? 'block' : 'none',
                        }}>
                            <Link to={`permission`}>Dostęp</Link>
                        </li>
                        <li style={{
                            display: isAdmin ? 'block' : 'none',
                        }}>
                            <Link to={`descendant`}>Powiązane profile</Link>
                        </li>
                        <div className="clear"></div>
                    </ul>
                </div>
                <Routes>
                    <Route path="detail/*" element={<UsersDetailComponent />} />
                    <Route path="permission" element={<UserPermissionsComponent />} />
                    <Route path="descendant" element={<UserDescendantComponent />} />
                </Routes>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące możliwości:</p>
                    <ul>
                        <li>Zmiana informacji swojego personalnego profilu</li>
                        <li>Zmiana hasła do swojego profilu</li>
                        <li>Obsługa powiązanymi profilami</li>
                    </ul>
                </div>
            </div>
        </>
    );
}