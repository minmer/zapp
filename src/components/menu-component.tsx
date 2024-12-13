import icon from '../assets/logo.svg'
import { Link } from "react-router-dom";
import { User } from "../structs/user";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import { useAuth } from '../generals/permission/AuthContext';
export default function Root({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {

    const [token, setToken] = useState<string | undefined>()
    const [isShown, setIsShown] = useState(false)
    const { logout } = useAuth();


    useEffect(
        () => {
            getParams({
                func: async (param: string | User) => {
                    const newToken = param as string
                    if (newToken != token) {
                        setToken(newToken)
                        toast.success('Użytkownik jest zalogowany')
                        let user = { id: localStorage.getItem("userid"), user: localStorage.getItem("user") } as User
                        if (user.id)
                            return toast.success('Użytkownik jest wybrany')
                        user = (await FetchInformationGetAll('string', newToken, 'user') as StringOutput[]).map<User>((output) => ({ id: output.id, user: output.output, roles: [] }))[0]
                        if (!user.id)
                            return toast.dismiss('Żadna osoba nie jest wybrana')
                        localStorage.setItem("userid", user.id)
                        localStorage.setItem("user", user.user)
                        toast.success('Użytkownik jest wybrany')
                    }
                }, type: 'token', show: false
            })
        }, [getParams, token])

    const showLogin = () => {
        getParams({
            func: async () => {
            }, type: 'newtoken', show: true
        })
    }

    const onLogout = () => {
        toast.success('Użytkownik został wylogowany')
        setToken(undefined)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("userid")
        logout();
    }

    return (
        <>
            <div id="menu"
                style=
                {{
                    display: isShown ? 'flex' : undefined,
                }}>
                <nav>
                    <div>
                        <Link to={``}><img alt="icon" src={icon} /></Link>
                        
                    </div>
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
                                    <Link to={`advent`}>Roraty</Link>
                                </li>
                                <li>
                                    <Link to={`visit`}>Kolęda</Link>
                                </li>
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
                                {token != undefined ?
                                    <>
                                        <li>
                                            <span onClick={showLogin}>Zmień użytkownika</span>
                                        </li>
                                        <li>
                                            <span onClick={onLogout}>Wyloguj się</span>
                                        </li>
                                    </>
                                    :
                                    <li>
                                        <span onClick={showLogin}>Zaloguj się</span>
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