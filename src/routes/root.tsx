import { Outlet, Link, useParams } from "react-router-dom";
export default function Root() {

    const { token } = useParams();
    return (
        <>
            <div id="sidebar">
                <h1>Recreatio - zaplecze techniczne</h1>
                <nav>
                    <ul>
                        <li>
                            <h2>
                                Intencje mszalne
                            </h2>
                            <ul>
                                <li>
                                    <Link to={`intention`}>Intencje mszalne</Link>
                                </li>
                                <li>
                                    <Link to={`obits`}>Intencje pogrzebowe</Link>
                                </li>
                            </ul>
                            <h2>
                                Sprawozdania finansowe
                            </h2>
                            <ul>
                                <li>
                                    <Link to={`finance/finanseministrantow`}>Środki LSO</Link>
                                </li>
                                <li>
                                    <Link to={`finance/dofinansowanie`}>Dofinansowanie do wyjazdów</Link>
                                </li>
                                <li>
                                    <Link to={`finance/zakopane`}>Ferie Zakopane (21-23.02.2024 r.)</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
            <div id="detail">
                <Outlet />
            </div>
        </>
    );
}