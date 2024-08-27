import { Link, Route, Routes} from 'react-router-dom';
import baner from '../assets/obit.jpg'
import { FetchOwnerGet } from '../features/FetchOwnerGet';
import { useEffect, useState } from 'react';
import ObitsIntentionsComponent from '../components/obits-intentions-component';
import ObitsEditComponent from '../components/obits-edit-component';
export default function ObitPage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
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
                        <h1>Pogrzeby</h1>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        <li>
                            <Link to={`intentions`}>Intencje</Link>
                        </li>
                        <li style={{
                            display: isAdmin ? 'block' : 'none',
                        }}>
                            <Link to={`edit`}>Edytuj</Link>
                        </li>
                        <div className="clear"></div>
                    </ul>
                </div>
                <Routes>
                    <Route path="intentions/*" element={<ObitsIntentionsComponent/>} />
                    <Route path="edit/*" element={<ObitsEditComponent/>} />
                </Routes>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące funkcjonalności:</p>
                    <ul>
                        <li>Sprawdzenie najbliższych pogrzebów</li>
                        <li>Sprawdzanie terminów Mszy Świętych pogrzebowych</li>
                        <li>Dopisanie intencji pogrzebowych</li>
                    </ul>
                </div>
            </div>
        </>
    );
}