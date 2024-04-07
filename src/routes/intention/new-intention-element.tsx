import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MassIntentionElement from "./mass-intention-element";

interface JSON_Object {
    id: string;
    output: number;
}

export default function ItentionMonthElement() {

    const { token } = useParams();
    const [date, setDate] = useState(new Date(Date.now()))
    const [description, setDescription] = useState("")
    const [data, setData] = useState([] as JSON_Object[])
    const [color, setColor] = useState("")
    useEffect(() => {
        console.log(234)
        async function loadMasses() {
            console.log(212)
            const start = new Date(date.getTime());
            start.setHours(0, 0, 0, 0)
            const end = new Date(start.getTime());
            end.setDate(end.getDate() + 1)
            const data = await fetch('https://zapp.hostingasp.pl/information/integer/' + token + '/zielonki_mass/' + start.getTime() + '/' + end.getTime())
                .then(res => res.json() as unknown as JSON_Object[])
            setData(data)
        }
        loadMasses();
    }, [token, date])

    const addMass = async () => {
        try {
            date.setSeconds(0)
            date.setMilliseconds(0)
            const res = await fetch('https://zapp.hostingasp.pl/information/integer/',
                {
                    method: "POST",
                    body: JSON.stringify({
                        "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                        "integer": date.getTime(),
                        "token": token,
                        "key": "intention_admin",
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            const resJson = await res.json();
            const informationID = resJson.id;
            if (res.status === 200) {
                await fetch('https://zapp.hostingasp.pl/context/',
                    {
                        method: "POST",
                        body: JSON.stringify({
                            "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                            "token": token,
                            "key": "intention_admin",
                            "information": informationID,
                            "context": "zielonki_mass",
                            "preorder": date.getTime(),

                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                const res2 = await fetch('https://zapp.hostingasp.pl/information/text/',
                    {
                        method: "POST",
                        body: JSON.stringify({
                            "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                            "text": description,
                            "token": token,
                            "key": "intention_admin",
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                const resJson2 = await res2.json();
                const informationID2 = resJson2.id;
                await fetch('https://zapp.hostingasp.pl/context/',
                    {
                        method: "POST",
                        body: JSON.stringify({
                            "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                            "token": token,
                            "key": "intention_admin",
                            "information": informationID2,
                            "context": informationID + 'description',
                            "preorder": 0,

                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                const res3 = await fetch('https://zapp.hostingasp.pl/information/text/',
                    {
                        method: "POST",
                        body: JSON.stringify({
                            "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                            "text": color,
                            "token": token,
                            "key": "intention_admin",
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                const resJson3 = await res3.json();
                const informationID3 = resJson3.id;
                await fetch('https://zapp.hostingasp.pl/context/',
                    {
                        method: "POST",
                        body: JSON.stringify({
                            "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                            "token": token,
                            "key": "intention_admin",
                            "information": informationID3,
                            "context": informationID + 'color',
                            "preorder": 0,

                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (

        <>
            <div>
                <h3>Nowa intencja</h3>
                <input id="inputDate" type="datetime-local"
                    value={date.toLocaleString('sv').replace(' GMT', '').substring(0, 16)}
                    onChange={(e) => setDate(new Date(e.target.value))} />
                <input id="inputDate" type="text"
                    onChange={(e) => setDescription(e.target.value)} />
                <input id="inputDate" type="text"
                    onChange={(e) => setColor(e.target.value)} />
                <button onClick={addMass}>Dodaj Mszę</button>
            </div >
            <div>
                {
                    data.map(item => (
                        <MassIntentionElement key={item.id} information_id={item.id} date={item.output} />
                    ))
                }
            </div>
            <Link to={`/intentionprint/` + token + '/' + date.getTime()}>Przygotuj wydruk</Link>

        </>
    );
}