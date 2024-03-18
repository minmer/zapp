import { Link, Route, Routes, useParams } from 'react-router-dom';
import baner from '../assets/intention.jpg'
import NewIntentionElement from '../routes/intention/new-intention-element';
import IntentionWeekComponent from '../components/intention-week-component';
import IntentionMonthComponent from '../components/intention-month-component';
import { useEffect, useState } from 'react';
import { FetchGetAll } from '../features/FetchGet';
export default function IntentionPage() {
    const { token } = useParams();
    const [isViewer, setIsViewer] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        (async function () {
            try {
                if (token !== undefined) {
                    setIsViewer((await FetchGetAll('text', token, 'intention')).length != 0)
                    setIsAdmin((await FetchGetAll('text', token, 'intentionadmin')).length != 0)
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
                        <h1>Intencja mszalne</h1>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        <li style={{
                            display: isViewer ? 'block' : 'none',
                        }}>
                            <Link to={`week/` + Date.now()}>Tydzień</Link>
                        </li>
                        <li style={{
                            display: isViewer ? 'block' : 'none',
                        }}>
                            <Link to={`month/` + Date.now()}>Miesiąc</Link>
                        </li>
                        <li style={{
                            display: isAdmin ? 'block' : 'none',
                        } }>
                            <Link to={`report`}>Podsumowania</Link>
                        </li>
                        <li style={{
                            display: isAdmin ? 'block' : 'none',
                        }}>
                            <Link to={`edit`}>Edycja intencji</Link>
                        </li>
                        <div className="clear"></div>
                    </ul>
                </div>
                <Routes>
                    <Route path="week/:init_date" element={<IntentionWeekComponent/>} />
                    <Route path="month/:init_date" element={<IntentionMonthComponent />} />
                    <Route path="report" />
                    <Route path="edit" element={<NewIntentionElement />} />
                </Routes>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące możliwości:</p>
                    <ul>
                        <li>Sprawdzanie intencji na kolejne dni</li>
                        <li>Zgłoszenie poprawek do intencji</li>
                        <li>Dopisanie intencji do Mszy Świętych zbiorowych</li>
                        <li>Przygotowanie miesięcznych sprawozdań</li>
                    </ul>
                </div>
            </div>
        </>
    );
}