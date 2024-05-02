import { Link, Route, Routes, useParams } from 'react-router-dom';
import baner from '../assets/communion.jpg'
import { useEffect, useState } from 'react';
import { FetchGetAll } from '../features/FetchGet';
import CommunionsDetailComponent from '../components/communions-detail-component';
export default function CommunionPage() {
    const { token } = useParams();
    const [isAvailable, setIsAvailable] = useState(false)

    useEffect(() => {
        (async function () {
            try {
                if (token !== undefined) {
                    setIsAvailable(((await FetchGetAll('text', token, 'communion_child') as []).length == 0 ? false : true))
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
                        <h1>Komunia Święta</h1>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        <li style={{
                            display: isAvailable ? 'block' : 'none',
                        }}>
                            <Link to={`detail`}>Pogląd</Link>
                        </li>
                        <div className="clear"></div>
                    </ul>
                </div>
                <Routes>
                    <Route path="detail/*" element={<CommunionsDetailComponent/>} />
                </Routes>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące funkcjonalności:</p>
                    <ul>
                        <li>Zgłoszenie dziecka do Komunii</li>
                        <li>Sprawdzenie potrzebnych dokumentów do Komunii</li>
                        <li>Sprawdzenie postępu dziecka w zdawaniu</li>
                        <li>Zgłoszenie się na wyjazd w białym tygodniu</li>
                        <li>Sprawdzenie wszystkich terminów spotkań</li>
                        <li>Możliwość dodatkowych terminów do zdawania</li>
                    </ul>
                </div>
            </div>
        </>
    );
}