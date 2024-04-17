import { Link, Route, Routes, useParams } from 'react-router-dom';
import baner from '../assets/trip.jpg'
import TripsEnlistComponent from '../components/trips-enlist-component';
import TripsCreateComponent from '../components/trips-create-component';
import { FetchGetAll } from '../features/FetchGet';
import { useEffect, useState } from 'react';
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
                        <h1>Wycieczki</h1>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        <li>
                            <Link to={`enlist`}>Zapisy</Link>
                        </li>
                        <li style={{
                            display: isAdmin ? 'block' : 'none',
                        }}>
                            <Link to={`create`}>Nowa wycieczka</Link>
                        </li>
                        <div className="clear"></div>
                    </ul>
                </div>
                <Routes>
                    <Route path="enlist/*" element={<TripsEnlistComponent />} />
                    <Route path="create/*" element={<TripsCreateComponent />} />
                </Routes>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące możliwości:</p>
                    <ul>
                        <li>Zapisy na wyjazdy</li>
                        <li>Sprawdzenie informacji o wyjeździe</li>
                        <li>Podanie danych osobowych</li>
                        <li>Sprawdzenie ilości osób zapisanych</li>
                    </ul>
                </div>
            </div>
        </>
    );
}