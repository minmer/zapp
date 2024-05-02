import { Link, Route, Routes, useParams } from 'react-router-dom';
import baner from '../assets/obit.jpg'
import { FetchCheckOwner } from '../features/FetchCheckOwner';
import { useEffect, useState } from 'react';
import ObitsIntentionsComponent from '../components/obits-intentions-component';
import ObitsEditComponent from '../components/obits-edit-component';
export default function ObitPage() {
    const { token } = useParams();
    const [isViewer, setIsViewer] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        (async function () {
            try {
                if (token !== undefined) {
                    setIsViewer((await FetchCheckOwner(token, 'intention_viewer')) ?? false)
                    setIsAdmin((await FetchCheckOwner(token, 'intention_admin')) ?? false)
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
                        <h1>Pogrzeby</h1>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        <li style={{
                            display: isViewer ? 'block' : 'none',
                        }}>
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