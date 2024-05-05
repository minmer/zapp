import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchPost } from "../../features/FetchPost";

interface JSON_StringObject {
    id: string;
    output: string;
}
interface IIntention {
    id: string;
    output: string;
    isEdit: boolean;
}

function MassIntentionElement({ information_id, date }: { information_id: string, date: number }) {

    const { token } = useParams();
    const [newIntention, setNewIntention] = useState("")
    const [description, setDescription] = useState("")
    const [editedIntention, setEditedIntention] = useState("")
    const [data, setData] = useState([] as IIntention[])
    const [rr, setRR] = useState(false)
    useEffect(() => {
        async function loadIntentions () {
            const tempData = (await fetch('https://zapp.hostingasp.pl/information/text/' + token + '/' + information_id + 'intention')
                .then(res => res.json() as unknown as JSON_StringObject[])).map(item => ({ id: item.id, output: item.output, isEdit: false }))
            setData(tempData)
            const tempData2 = await fetch('https://zapp.hostingasp.pl/information/text/' + token + '/' + information_id + 'description')
                .then(res => res.json() as unknown as JSON_StringObject[])
            setDescription(tempData2[0].output)
        }
        loadIntentions()
    }, [token, information_id, date])

    const addMass = async () => {
        try {
            const res = await fetch('https://zapp.hostingasp.pl/information/text/',
                {
                    method: "POST",
                    body: JSON.stringify({
                        "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                        "text": newIntention,
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
                        "key": "intention_admin",
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

    const deleteIntention = async(id: string ) => {
        try {
            await fetch('https://zapp.hostingasp.pl/information/',
                {
                    method: "DELETE",
                    body: JSON.stringify({
                        "token": token,
                        "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                        "key": "intention_admin",
                        "id": id,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        } catch (err) {
            console.log(err);
        }
    }

    const updateIntention = (item: IIntention) => {
        item.isEdit = false
        setRR(!rr)
    }

    const editIntention = (item: IIntention) => {
        item.isEdit = true
        setEditedIntention(item.output)
        setRR(!rr)
    }

    const setCollectiveIntentions = async () => {
        await FetchPost("integer", token ?? '', 'intention_admin', [information_id + 'collective'], 0, [0])
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
                <button onClick={deleteMass}>Usuń Mszę</button>
                <button onClick={addMass}>Dodaj Intencję</button>
                <button onClick={setCollectiveIntentions}>Zbiorowa</button>
            </div >
            <div>
                {
                    data.map(item => (
                        <div>
                            <div style={{
                                display: item.isEdit ? 'none' : 'inline',
                            }} onClick={() => editIntention(item)} key={item.id}>{item.output}</div>
                            <button style={{
                                display: item.isEdit ? 'none' : 'inline',
                            }} onClick={() => deleteIntention(item.id)}>Usuń Intencję</button>
                            <input style={{
                                display: item.isEdit ? 'inline' : 'none',
                            }} onChange={(e) => {
                                setEditedIntention(e.target.value)
                                }}
                                value={editedIntention}></input>
                            <button style={{
                                display: item.isEdit ? 'inline' : 'none',
                            }} onClick={() => updateIntention(item)}>Odśwież Intencję</button>
                        </div>
                    ))
                }
            </div>
        </>
    );
}
export default MassIntentionElement;