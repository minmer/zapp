import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ItentionMonthElement() {
    const { init_date } = useParams();
    const [date, setDate] = useState(new Date(Number(init_date)))

    return (

        <>
            <div>
                <h3>Intencje w tym miesi¹cu</h3>
                <input id="inputDate" type="date"
                    value={date.toISOString().substring(0, 10)}
                    onChange={(e) => setDate(new Date(e.target.value))} />
                {date.toDateString()}
            </div >
        </>
    );
}