import { useState, useEffect } from 'react'


function FinanceComponent({ information_id, amount }: { information_id: string, amount: number }) {
    const formatter = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });
    const [name, setName] = useState("");

    useEffect(() => {
        (async () => {
            const data = await fetch('https://zapp.hostingasp.pl/information/text/G6XLgrfsEAIR21t7RgNsgP84UeGeM9QWkq4j6tycNjw/' + information_id + 'name')
                .then(res => res.json());
            setName((data[0]).output);
        })()
    }, [])

    return (
        <div title={name}>
            <p>{formatter.format(amount / 100)}</p>
        </div>
  );
}

export default FinanceComponent;