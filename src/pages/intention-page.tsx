import { Link, Route, Routes } from 'react-router-dom';
import baner from '../assets/intention.jpg'
import IntentionWeekComponent from '../components/intention-week-component';
import IntentionMonthComponent from '../components/intention-month-component';
import { useEffect, useState } from 'react';
import { FetchOwnerGet } from '../features/FetchOwnerGet';
import IntentionReportComponent from '../components/intention-report-component';
import IntentionEditComponent from '../components/intention-edit-component';
import IntentionReportBookSubpage from '../components/intention/intention-report-book-subpage';
export default function IntentionPage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        getParams({
            func: async (param: unknown) => setIsAdmin((await FetchOwnerGet(param as string, 'intention_admin'))), type: 'token', show: false
        });
    }, [getParams])

    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Intencje mszalne</h1>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        <li>
                            <Link to={`week/-1`}>Tydzień</Link>
                        </li>
                        <li>
                            <Link to={`month/-1`}>Miesiąc</Link>
                        </li>
                        {isAdmin ? <li>
                            <Link to={`report/book`}>Książka</Link>
                        </li> : null}
                        <li style={{
                            display: isAdmin ? 'block' : 'none',
                        }}>
                            <Link to={`oldreport/` + Date.now() + '/' + (Date.now() + 86400000)}>Podsumowania</Link>
                        </li>
                        <li style={{
                            display: isAdmin ? 'block' : 'none',
                        }}>
                            <Link to={`edit/-1`}>Edycja intencji</Link>
                        </li>
                        <div className="clear"></div>
                    </ul>
                </div>
                <Routes>
                    <Route path="week/:init_date" element={<IntentionWeekComponent/>} />
                    <Route path="month/:init_date" element={<IntentionMonthComponent />} />
                    <Route path="oldreport/:start_date/:end_date" element={<IntentionReportComponent getParams={getParams} />} />
                    <Route path="report/book" element={<IntentionReportBookSubpage getParams={getParams} />} />
                    <Route path="edit/:init_date" element={<IntentionEditComponent getParams={getParams} />} />
                </Routes>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące funkcjonalności:</p>
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