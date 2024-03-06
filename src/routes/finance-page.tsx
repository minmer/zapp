import { useState, useEffect } from 'react'
import FinanceComponent from '../temp/FinanceComponent';
import { useParams } from "react-router-dom";

interface JSON_Object {
    id: string;
    output: number;
}

export default function Finance() {

    const { context } = useParams();
    const [data, setData] = useState([] as JSON_Object[])
    const [sum, setSum] = useState(0)
    const formatter = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });
    const [number, setNumber] = useState(0)
    

    useEffect(() => {
        (async () => {
            const data = await fetch('https://zapp.hostingasp.pl/information/integer/G6XLgrfsEAIR21t7RgNsgP84UeGeM9QWkq4j6tycNjw/' + context)
                .then(res => res.json() as unknown as JSON_Object[])
            setData(data)
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
                        "token": "DWD0VEwKl_MzZEqzr3g73eQUG3UxNjNveeDKYeEx9Js",
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
                            "token": "DWD0VEwKl_MzZEqzr3g73eQUG3UxNjNveeDKYeEx9Js",
                            "id": "ab2d5670-6eeb-4fe7-b812-c0513fedf98f",
                            "information": informationID,
                            "context": context,
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
    };

    return (

        <>
            <div>
                {
                    data.map(item => (
                        <FinanceComponent key={item.id} information_id={item.id} amount={item.output} />
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
                <button onClick={handleClick}>New</button>
            </div>
            <div>
                Suma: {formatter.format(sum / 100)}
            </div>

        </>
    );
}