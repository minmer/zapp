import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Mass {
    date: Date,
    description: string[],
    color: string
}
function MassIntentionElement({ information_id, date }: { information_id: string, date: number }) {

    const { token } = useParams();
    const [newIntention, setNewIntention] = useState("")
    const [description, setDescription] = useState("")
    const asd = {} as Mass;
    asd.date.getTime()
    useEffect(() => {
        console.log(156)
        async function loadIntentions() {
            console.log(178)
            const tempData2 = await fetch('https://zapp.hostingasp.pl/information/text/' + token + '/' + information_id + 'description')
                .then(res => res.json())
            setDescription(tempData2[0].output)
        }
        loadIntentions()
    }, [token, information_id, date])

    const addMass = async () => {
        try {
            console.log(112)
            const res = await fetch('https://zapp.hostingasp.pl/information/text/',
                {
                    method: "POST",
                    body: JSON.stringify({
                        "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                        "text": newIntention,
                        "token": token,
                        "id": "7d5de43d-e5fc-42ba-a8cb-5e1aaa2e3d2f",
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            const resJson = await res.json();
            const informationID = resJson.id;
            if (res.status === 200) {
                console.log(134)
                await fetch('https://zapp.hostingasp.pl/context/',
                    {
                        method: "POST",
                        body: JSON.stringify({
                            "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                            "token": token,
                            "id": "7d5de43d-e5fc-42ba-a8cb-5e1aaa2e3d2f",
                            "information": informationID,
                            "context": information_id + 'intention',
                            "preorder": 1234,

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

    const deleteMass = async () => {
        try {
            await fetch('https://zapp.hostingasp.pl/information/',
                {
                    method: "DELETE",
                    body: JSON.stringify({
                        "token": token,
                        "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                        "permission": "7d5de43d-e5fc-42ba-a8cb-5e1aaa2e3d2f",
                        "id": information_id,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        } catch (err) {
            console.log(err);
        }
    }

    return (

        <>
            <div>
                <div>
                    <p>{new Date(date).toLocaleString()}</p>
                </div>
                <div>
                    <p>{description}</p>
                </div>
                <input type="string"
                    onChange={(e) => {
                        setNewIntention(e.target.value)
                    }} />
                <button onClick={deleteMass}>Usuñ Mszê</button>
                <button onClick={addMass}>Dodaj Intencjê</button>
            </div >
            <div>
                {
                }
            </div>
        </>
    );
}
export default MassIntentionElement;