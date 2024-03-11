import { useParams } from "react-router-dom";


function FinanceComponent({ information_id, amount, description }: { information_id: string, amount: number, description: string }) {
    const formatter = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });
    const { token} = useParams();


    const deleteItem = async () => {
        try {
            await fetch('https://zapp.hostingasp.pl/information/',
                {
                    method: "DELETE",
                    body: JSON.stringify({
                        "token": token,
                        "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                        "permission": "ab2d5670-6eeb-4fe7-b812-c0513fedf98f",
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
        <div className="asd17" >
                <div className="asd18">{formatter.format(amount / 100)}</div>
                <div className="asd19">{description}</div>
                <button onClick={deleteItem}>X</button>
        </div>
        <div className="asd16" ></div>
        </>
  );
}

export default FinanceComponent;