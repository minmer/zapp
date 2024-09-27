import { Link } from "react-router-dom";
import { User } from "../structs/user";
import { useEffect, useState } from "react";
export default function Root({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isShown, setIsShown] = useState(false)


    useEffect(
        () => {
            getParams({
                func: async () => {
                    setIsLoggedIn(true)
                }, type: 'token', show: false
            })
        }, [getParams])

    const showLogin = () => {
        getParams({
            func: async () => {
                setIsLoggedIn(true)
            }, type: 'newtoken', show: true
        })
    }

    const logout = () => {
        setIsLoggedIn(false)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("userid")
    }

    return (
        <>
            <div id="menu"
                style=
                {{
                    display: isShown ? 'flex' : undefined,
                }}>
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
                                Ogłoszenia
                            </h2>
                            <ul>
                                <li>
                                    <Link to={`finance`}>Sprawozdania</Link>
                                </li>
                                <li>
                                    <Link to={`trip`}>Wycieczki</Link>
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
                        <li>
                            <h2>
                                Logowanie
                            </h2>
                            <ul>
                                {isLoggedIn ?
                                    <>
                                        <li>
                                            <a onClick={showLogin} href='javascript:void(0)'>Zmień użytkownika</a>
                                        </li>
                                        <li>
                                            <a onClick={logout} href='javascript:void(0)'>Wyloguj się</a>
                                        </li>
                                    </>
                                    :
                                    <li>
                                        <a onClick={showLogin} href='javascript:void(0)'>Zaloguj się</a>
                                    </li>
                                }
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className={isShown ? 'menu-button menu-button-close' : 'menu-button'} onClick={() => { setIsShown(!isShown) }}>
                <div><div/></div>
            </div>
        </>
    );
}