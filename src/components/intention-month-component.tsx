import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ItentionMonthElement() {
    const { init_date } = useParams();
    const [date, setDate] = useState(new Date(Number(init_date)))
    const [month, setMonth] = useState(new Date(Number(init_date)))
    useEffect(
        () => {
            const newMonth = new Date(date.getTime())
            newMonth.setDate(newMonth.getDate())
            newMonth.setUTCHours(0, 0, 0, 0)
            if (newMonth.getTime() != month.getTime()) {
                {
                    console.log("newWeek")
                    setMonth(newMonth)
                }
            }
        }, [date])

    return (

        <>
            <div>
                <h3>Intencje w tym tygodniu</h3>
                <input id="inputDate" type="date"
                    value={date.toISOString().substring(0, 10)}
                    onChange={(e) => setDate(new Date(e.target.value))} />
                {date.toDateString()}
            </div >
        </>
    );
}