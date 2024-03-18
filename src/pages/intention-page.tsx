import { Link, Route, Routes } from 'react-router-dom';
import baner from '../assets/intention.jpg'
import NewIntentionElement from '../routes/intention/new-intention-element';
import IntentionWeekComponent from '../components/intention-week-component';
import IntentionMonthComponent from '../components/intention-month-component';
export default function IntentionPage() {
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
                        <li>
                            <Link to={`week/` + Date.now()}>Tydzień</Link>
                        </li>
                        <li>
                            <Link to={`month/` + Date.now()}>Miesiąc</Link>
                        </li>
                        <li>
                            <Link to={`report`}>Podsumowania</Link>
                        </li>
                        <li>
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