import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchGetAll, StringOutput } from "../features/FetchGet";

export default function CommunionDetailElement() {
    const { token, role } = useParams();
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [birthday, setBirthday] = useState("")
    const [birthplace, setBirthplace] = useState("")
    const [permission, setPermission] = useState("")
    const [baptismPlace, setBaptismPlace] = useState("")
    const [baptismDate, setBaptismDate] = useState("")
    const [baptismNote, setBaptismNote] = useState("")
    const [confession, setConfession] = useState("")
    const [catechism, setCatechism] = useState("")
    const [telefon, setTelefon] = useState<string[]>([])
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    setName((await FetchGetAll('text', token, role + 'name') as unknown as StringOutput[])[0]?.output ?? 'Zgłoś problem z imieniem dziecka')
                    setAddress((await FetchGetAll('text', token, role + 'address') as unknown as StringOutput[])[0]?.output ?? 'Proszę o podanie adresu')
                    setPermission((await FetchGetAll('text', token, role + 'permission') as unknown as StringOutput[])[0]?.output ?? 'Nie dotarła jeszcze  zgoda z parafii zamieszkania - jeśli to błędna informacja proszę o kontakt')
                    setBirthday((await FetchGetAll('text', token, role + 'birthday') as unknown as StringOutput[])[0]?.output ?? 'Proszę o podanie daty urodzenia')
                    setBirthplace((await FetchGetAll('text', token, role + 'birthplace') as unknown as StringOutput[])[0]?.output ?? 'Proszę o podanie miejsca urodzenia')
                    setBaptismDate((await FetchGetAll('text', token, role + 'baptismdate') as unknown as StringOutput[])[0]?.output ?? 'Brakuje informacji o Chrzcie - proszę o kontakt')
                    setBaptismPlace((await FetchGetAll('text', token, role + 'baptismplace') as unknown as StringOutput[])[0]?.output)
                    setBaptismNote((await FetchGetAll('text', token, role + 'baptismnote') as unknown as StringOutput[])[0]?.output)
                    setCatechism((await FetchGetAll('text', token, role + 'catechism') as unknown as StringOutput[])[0]?.output ?? 'Katechizm jeszcze nie został w pełni zaliczony - jeśli to błędna informacja proszę o kontakt')
                    setConfession((await FetchGetAll('text', token, role + 'confession') as unknown as StringOutput[])[0]?.output ?? 'Spowiedź jeszcze nie została w pełni zaliczona - jeśli to błędna informacja proszę o kontakt')
                    setTelefon((await FetchGetAll('text', token, role + 'telefon') as unknown as StringOutput[]).map(data => data.output))
                    setIsAdmin(((await FetchGetAll('text', token, 'admin') as []).length == 0 ? false : true))
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token, role])

    return (
        <>
            <h4>{name}</h4>
            <div>Adres</div>
            <h5>{address}</h5>
            <h5>{permission}</h5>
            <div>Data i miejsce urodzin</div>
            <h5>{birthday} - {birthplace}</h5>
            <div>Chrzest Święty</div>
            <h5>{baptismDate}</h5>
            <h5>{baptismPlace}</h5>
            <h5>({baptismNote})</h5>
            <div>Zaliczenia</div>
            <h5>{catechism}</h5>
            <h5>{confession}</h5>
            <div>Telefon</div>
            <h5>{telefon.map((tel) => (
                tel + ", "
            ))}</h5>
            <h5 style=
                {{
                    display: isAdmin ? 'block' : 'none',
                }}>{telefon.map((tel) => (
                    <a href={"sms:+48" + tel + "?body=Szczęść Boże, Proszę sprawdzić dane  dostępne w poniższym linku. Strona jest na razie dostosowana do szerokich ekranów (np. komputer). W razie błędów proszę o kontakt. Z Bogiem ks. Michał Mleczek Link: "}> Send link to {tel} </a>
                ))}</h5>
            <a href={"sms:+48519576943?body=Michał Mleczek"}>Try1</a>
            <a href={"sms:+48519576943?body=Michał Mleczekabcdefghijklmnopqrstuvwxyz"}>Try2</a>
            <a href={"sms:+48519576943?body=Michał Mleczekabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"}>Try3</a>
            <a href={"sms:+48519576943?body=Michał Mleczekabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"}>Try4</a>
            <a href={"sms:+48519576943?body=Michał Mleczekabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"}>Try5</a>
        </>
    );
}