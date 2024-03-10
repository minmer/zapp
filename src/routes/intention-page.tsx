import { Link, Route, Routes } from "react-router-dom";
import IntentionMonthElement from "./intention/intention-month-element";
import IntentionWeekElement from "./intention/intention-week-element";
import NewIntentionElement from "./intention/new-intention-element";

export default function IntentionPage() {
    return (

        <>
            <div>
                <h1>Intencje parafialne</h1>
                <div>
                    <ul>
                        <li>
                            <Link to={`month/` + Date.now()}>Miesiąc</Link>
                        </li>
                        <li>
                            <Link to={`week/` + Date.now()}>Tydzień</Link>
                        </li>
                        <li>
                            <Link to={`new`}>Dodaj intencję</Link>
                        </li>
                    </ul>
                </div>

                <Routes>
                    <Route path="month/:init_date" element={<IntentionMonthElement />} />
                    <Route path="week/:init_date" element={<IntentionWeekElement />} />
                    <Route path="new" element={<NewIntentionElement />} />
                </Routes>
        </div >
        </>
    );
}