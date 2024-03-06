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
    const [number, setNumber] = useState(0);


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
            console.log("Hello 1");
            console.log(number);

            const res = await fetch('https://zapp.hostingasp.pl/token/',
                {
                    method: "POST",
                    body: JSON.stringify({
                        "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            /*const res = await fetch('https://zapp.hostingasp.pl/information/integer/',
                {
                    method: "POST",
                    body: JSON.stringify({
                        "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                        "integer": 13,
                        "token": "DWD0VEwKl_MzZEqzr3g73eQUG3UxNjNveeDKYeEx9Js",
                        "id": "ab2d5670-6eeb-4fe7-b812-c0513fedf98f",
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });*/
            console.log("Hello 2");
            const resJson = await res.json();

            console.log("Hello 3");
            console.log(resJson);
            if (res.status === 200) {
                setNumber(0);
            }
        } catch (err) {
            console.log("Hello 4");
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
                <form onSubmit={handleClick}>
                    <input
                        type="number"
                        value={number}
                        placeholder="Number"
                        onChange={(e) => setNumber(Number(e.target.value))}
                    />

                    <button type="submit">New</button>
                </form>

            </div>
            <div>
                Suma: {formatter.format(sum / 100)}
            </div>

        </>
    );
}