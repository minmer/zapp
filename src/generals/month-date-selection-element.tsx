import { useEffect, useState } from "react";
import { DaySpelling, MonthSpelling } from "../structs/consts";

export default function MonthDateSelectionElement({ onSelectionChange }: { onSelectionChange?: (t: Date) => void }) {
    const [date, setDate] = useState(new Date(Date.now()))
    const [preMonth, setPreMonth] = useState([] as string[])
    const [month, setMonth] = useState([] as Date[])
    const [nextMonth, setNextMonth] = useState([] as string[])

    useEffect(
        () => {
            if (onSelectionChange != null)
                onSelectionChange(date)
        }, [date, onSelectionChange])

    useEffect(
        () => {
            if (month[0]?.getMonth() == date.getMonth())
                return
            const start = new Date(date.getTime())
            start.setHours(0, 0, 0, 0)
            start.setDate(1)
            const pre = []
            for (let i = 0; i < start.getDay(); i++) {
                pre.push('')
            }
            const days = []
            for (let i = 2; start.getMonth() == date.getMonth(); i++) {
                days.push(new Date(start.getTime()))
                start.setDate(i)
            }
            const next = []
            for (let i = start.getDay(); i < 7; i++) {
                next.push('')
            }
            setPreMonth(pre)
            setMonth(days)
            setNextMonth(next)
        }, [date, month])

    const changeMonth = (change: number) => {
        date.setMonth(date.getMonth() + change)
        setDate(new Date(date.getTime()));
    }

    const selectedDate = (newDate: Date) => {
        setDate(newDate);
    }
    return (

        <div className="month-date-selection">
            <div className="navigation">
                <input type="button" value="<" onClick={() => changeMonth(-1)} />
                <h4>{MonthSpelling[date.getMonth()] + ' ' + date.getFullYear()}</h4>
                <input type="button" value=">" onClick={() => changeMonth(1)} />
                <div className="clear" />
            </div >
            <div className="calendar">
                <>
                    {DaySpelling.map((spelling, index)=>
                    (
                        <div key={40-index} className="spelling">{spelling}</div>
                    ))
                    }
                    {preMonth.map((_item,index) =>
                    (
                        <div key={30-index} ></div>
                    ))
                    }
                    {
                        month.map((day, index) =>
                        (
                            <input key={index} type="button" value={day.getDate()} onClick={() => selectedDate(day)} />
                        ))
                    }
                    {nextMonth.map((_item, index) =>
                    (
                        <div key={40+index }></div>
                    ))
                    }
                </>
            </div>
        </div>
  );
}