import { Link } from "react-router-dom";
export default function Root() {

    return (
        <>
            <div id="menu">
                <nav>
                    <ul>
                        <li>
                            <h2>
                                Msze Święte
                            </h2>
                            <ul>
                                <li>
                                    <Link to={`intention`}>Intencje mszalne</Link>
                                </li>
                                <li >
                                    <Link to={`obit`}>Pogrzeby</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h2>
                                Sakramenty
                            </h2>
                            <ul>
                                <li>
                                    <Link to={`baptism`}>Chrzest Święty</Link>
                                </li>
                                <li>
                                    <Link to={`communion`}>Komunia Święta</Link>
                                </li>
                                <li>
                                    <Link to={`confirmation`}>Bierzmowanie</Link>
                                </li>
                                <li>
                                    <Link to={`confession`}>Spowiedź Święta</Link>
                                </li>
                                <li>
                                    <Link to={`unction`}>Namaszczenie Chorych</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h2>
                                Wspólnoty
                            </h2>
                            <ul>
                                <li>
                                    <Link to={`minister`}>Ministranci</Link>
                                </li>
                                <li>
                                    <Link to={`choir`}>Chór Mieszany</Link>
                                </li>
                                <li>
                                    <Link to={`bible_circle`}>Krąg biblijny</Link>
                                </li>
                                <li>
                                    <Link to={`pursuit_saint`}>W pogoni za Świętym</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h2>
                                Sprawozdania
                            </h2>
                            <ul>
                                <li>
                                    <Link to={`finance`}>Finansowe</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h2>
                                Ustawienia
                            </h2>
                            <ul>
                                <li>
                                    <Link to={`user`}>Użytkownik</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}