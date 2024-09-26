import { useNavigate, useParams } from 'react-router-dom';
import logo from '../assets/logo.svg'
import OldEditableElement from '../temp/old-editable-element';
import { FetchUserPost } from '../features/FetchUserPost';
import { useEffect, useState } from 'react';
import { FetchUserGet, UserOutput } from '../features/FetchUserGet';
import LoadingComponent from '../generals/loading-component';
import { FetchInformationGetAll, StringOutput } from '../features/FetchInformationGet';
export default function SignInPage() {
    const { entry, token } = useParams()
    const [loading, setLoading] = useState("none")
    const [verified, setVerified] = useState(false)
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const login = async () => {
        setLoading("")
        await FetchUserPost(user, password)
        const output = await FetchUserGet(user, password)
        if (output !== undefined) {
            localStorage.setItem("token", (output as unknown as UserOutput).token)
            navigate('/zielonki/' + entry);
        }
        setLoading("none")
    }

    useEffect(() => {
        (async function () {
            setVerified((((await FetchInformationGetAll('string', "zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc", 'entries') as []) as unknown as StringOutput[]).filter(p => p.output == entry).length > 0))
        })();
    }, [entry])
    return (

        <>
            <div className="home">
                <div className="homedescription">
                    <img alt="Logo reCreatio" src={logo}/>
                    <h1>Witamy na stronie reCreatio.eu</h1>
                    {verified ?
                        <>
                            <div>
                                <p>Wybierz sobie login oraz hasło aby utworzyć konto.</p>
                            </div>
                            <div className="logincontainer">
                                <div className="loginloading" style={{
                                    display: loading,
                                }}>
                                    <LoadingComponent />
                                </div>
                                <h2 style={{
                                    gridColumn: "1 / span 2"
                                }}>Utworzenie konta</h2>
                                <div>Użytkownik</div>
                                <input type="text" value={user} onChange={(e) => setUser(e.target.value)} />
                                <div>Hasło</div>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <input style={{
                                    gridColumn: "1 / span 2"
                                }} type="button" onClick={login} value="Załóż konto" />
                            </div>
                        </> : null}
                    {(token != null) ? <OldEditableElement getParams={async ({ func }: { func: (p: string) => Promise<unknown> }) => { return await func(token ?? '') }} dbkey="signin_admin" multiple={true} showdescription={false} description="Entries" type="text" name="entries" /> : null}
                </div>
            </div>
        </>
    );
}