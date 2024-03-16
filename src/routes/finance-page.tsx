import { useState, useEffect } from 'react'
import FinanceComponent from '../temp/FinanceComponent';
import { useParams } from "react-router-dom";

interface JSON_Number {
    id: string;
    output: number;
}
interface JSON_Text {
    id: string;
    output: string;
}
interface FinanceItem {
    id: string;
    value: number;
    description: string;
}

export default function Finance() {

    const { token, context } = useParams();
    const [data, setData] = useState([] as FinanceItem[])
    const [sum, setSum] = useState(0)
    const [description, setDescription] = useState("")
    const formatter = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });
    const [number, setNumber] = useState(0)
    

    useEffect(() => {
        (async () => {
            const data = await fetch('https://zapp.hostingasp.pl/information/integer/' + token + '/' + context)
                .then(res => res.json() as unknown as JSON_Number[])
            const tempItems = [] as FinanceItem[]
            for (let i = 0; i < data.length; i++) {

                const jsonDescription = await fetch('https://zapp.hostingasp.pl/information/text/' + token + '/' + data[i].id + 'description')
                    .then(res => res.json() as unknown as JSON_Text[])
                tempItems.push(
                    {
                        id : data[i].id,
                        value : data[i].output,
                        description : jsonDescription[0].output
                    }
                )
            }

            setData(tempItems)
            let tempSum = 0
            for (let index = 0; index < data.length; index++) {
                tempSum = tempSum + data[index].output
            }
            setSum(tempSum)
        })()
    })
    
    const handleClick = async () => {
        try {
            const res = await fetch('https://zapp.hostingasp.pl/information/integer/',
                {
                    method: "POST",
                    body: JSON.stringify({
                        "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                        "integer": Math.round(number * 100),
                        "token": token,
                        "id": "ab2d5670-6eeb-4fe7-b812-c0513fedf98f",
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
                            "id": "ab2d5670-6eeb-4fe7-b812-c0513fedf98f",
                            "information": informationID,
                            "context": context,
                            "preorder": Date.now(),

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
                            "id": "ab2d5670-6eeb-4fe7-b812-c0513fedf98f",
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                const resJson2 = await res2.json();
                const informationID2 = resJson2.id;
                if (res2.status === 200) {
                    await fetch('https://zapp.hostingasp.pl/context/',
                        {
                            method: "POST",
                            body: JSON.stringify({
                                "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                                "token": token,
                                "id": "ab2d5670-6eeb-4fe7-b812-c0513fedf98f",
                                "information": informationID2,
                                "context": informationID + 'description',
                                "preorder": 1234,

                            }),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (

        <>
            <div>
                {
                    data.map(item => (
                        <FinanceComponent key={item.id} information_id={item.id} amount={item.value} description={item.description} />
                    ))
                }
            </div>
            <div>
                <input
                    type="number"
                    value={number}
                    placeholder="Number"
                    onChange={(e) => setNumber(Number(e.target.value))}
                />
                <input
                    type="text"
                    value={description}
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={handleClick}>New</button>
            </div>
            <div>
                Suma: {formatter.format(sum / 100)}
            </div>

        </>
    );
}