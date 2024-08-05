import { useEffect, useState } from 'react';
import baner from '../assets/minister.jpg'
import { FetchOwnerGet } from '../features/FetchOwnerGet';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import ChatComponent from '../components/chat-component';
export default function MinisterPage() {
    const { token } = useParams();
    const [isMinister, setIsMinister] = useState(false)
    
    useEffect(() => {
        (async function () {
            try {
                if (token !== undefined) {
                    setIsMinister((await FetchOwnerGet(token, 'minister_member')))
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
                        <h1>Służba liturgiczna</h1>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        <li style={{
                            display: isMinister ? 'block' : 'none',
                        }}>
                            <Link to={`chat`}>Aktualności</Link>
                        </li>
                        <div className="clear"></div>
                    </ul>
                </div>
                <Routes>
                    <Route path="chat" element={<ChatComponent name='asd' />} />
                </Routes>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące funkcjonalności:</p>
                    <ul>
                        <li>Sprawdzenie najbliższych wydarzeń LSO</li>
                        <li>Zapisywanie się na wyjazdy</li>
                        <li>Zgłoszenie się do służenia na uroczyste asyste</li>
                        <li>Sprawdzenie sprawozdania finansowego wspólnej kasy</li>
                        <li>Organizacja kolędy</li>
                        <li>Kontakt w ramach LSO</li>
                    </ul>
                </div>
            </div>
        </>
    );
}