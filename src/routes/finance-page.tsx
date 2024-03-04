import { useState, useEffect } from 'react'
import FinanceComponent from '../temp/FinanceComponent';

interface JSON_Object {
    id: string;
    output: number;
}

export default function Contact() {

    const [data, setData] = useState([] as JSON_Object[])
    const [sum, setSum] = useState(0)
    const formatter = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });


    useEffect(() => {
        (async () => {
            const data = await fetch('https://zapp.hostingasp.pl/information/integer/G6XLgrfsEAIR21t7RgNsgP84UeGeM9QWkq4j6tycNjw/finanseministrantow')
                .then(res => res.json() as unknown as JSON_Object[])
            setData(data)
            let tempSum = 0
            for (let index = 0; index < data.length; index++) {
                tempSum = tempSum + data[index].output
            }
            setSum(tempSum)
        })()
    }, [])

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
                Suma: {formatter.format(sum / 100)}
            </div>

        </>
    );
}