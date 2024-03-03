import { useState, useEffect } from 'react'


function FinanceComponent({ information_id, amount }) {
    const formatter = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });
    const [data, setData] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await fetch('https://zapp.hostingasp.pl/information/text/G6XLgrfsEAIR21t7RgNsgP84UeGeM9QWkq4j6tycNjw/' + information_id + 'name')
                .then(res => res.json());
            setData(data[0]);
        })()
    }, [])

    return (
        <div title={data.output}>
            <p>{formatter.format(amount / 100)}</p>
        </div>
  );
}

export default FinanceComponent;