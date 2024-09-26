import { Link, Route, Routes, useParams } from 'react-router-dom';
import baner from '../assets/trip.jpg'
import TripsEnlistComponent from '../components/trips-enlist-component';
import TripsCreateComponent from '../components/trips-create-component';
import { FetchInformationGetAll } from '../features/FetchInformationGet';
import { useEffect, useState } from 'react';
import TripsDetailComponent from '../components/trips-detail-component';
import { User } from '../structs/user';
export default function UserPage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const { token } = useParams();
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        (async function () {
            try {
                if (token !== undefined) {
                    setIsAdmin(((await FetchInformationGetAll('text', token, 'admin') as []).length == 0 ? false : true))
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
                        <li>
                            <Link to={`detail`}>Szczegóły</Link>
                        </li>
                        <div className="clear"></div>
                    </ul>
                </div>
                <Routes>
                    <Route path="enlist/*" element={<TripsEnlistComponent getParams={getParams} />} />
                    <Route path="create/*" element={<TripsCreateComponent />} />
                    <Route path="detail/*" element={<TripsDetailComponent getParams={getParams} />} />
                </Routes>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące funkcjonalności:</p>
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