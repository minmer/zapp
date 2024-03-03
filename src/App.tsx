import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FinanceComponent from './temp/FinanceComponent';
interface JSON_Object {
    id: string;
    output: number;
}
function App() {
    const [count, setCount] = useState(0);
    const [data, setData] = useState([] as JSON_Object[])
    const [sum, setSum] = useState(0)
    const formatter = new Intl.NumberFormat('pl-PL', {style: 'currency', currency: 'PLN'});


    useEffect(() => {
        (async () => {
            const data = await fetch('https://zapp.hostingasp.pl/information/integer/G6XLgrfsEAIR21t7RgNsgP84UeGeM9QWkq4j6tycNjw/finanseministrantow')
                .then(res => res.json() as unknown as JSON_Object[])
            setData(data)
            let tempSum = 0
            for (let index = 0; index < data.length; index++)
            {
                tempSum = tempSum + data[index].output
            }
            setSum(tempSum)
        })()
    }, [])
    

  return (
    <>
          <div>


        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>

        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Sum</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
          </p>
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
  )
}

export default App
