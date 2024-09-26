import { useEffect, useState } from "react";
import { DaySpelling, MonthSpelling } from "../structs/consts";
import { CompareDate } from "../components/helpers/DateComparer";

export default function MonthDateSelectionElement({ onSelectionChange }: { onSelectionChange?: (t: Date) => void }) {
    const [date, setDate] = useState(new Date(Date.now()))
    const [preMonth, setPreMonth] = useState([] as string[])
    const [month, setMonth] = useState([] as Date[])
    const [nextMonth, setNextMonth] = useState([] as string[])
    const [viewDate, setViewDate] = useState(new Date(Date.now()))

    useEffect(
        () => {
            if (onSelectionChange != null)
                onSelectionChange(date)
        }, [date, onSelectionChange])

    useEffect(
        () => {
            if (month[0]?.getMonth() == viewDate.getMonth())
                return
            const start = new Date(viewDate.getTime())
            start.setHours(0, 0, 0, 0)
            start.setDate(1)
            const pre = []
            for (let i = 0; i < start.getDay(); i++) {
                pre.push('')
            }
            const days = []
            for (let i = 2; start.getMonth() == viewDate.getMonth(); i++) {
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
        }, [viewDate, month])

    const changeMonth = (change: number) => {
        viewDate.setMonth(viewDate.getMonth() + change)
        setViewDate(new Date(viewDate.getTime()));
    }

    const selectedDate = (newDate: Date) => {
        setDate(newDate);
    }

    return (

        <div className="month-date-selection">
            <div className="navigation">
                <input type="button" value="<" onClick={() => changeMonth(-1)} />
                <h4>{MonthSpelling[viewDate.getMonth()] + ' ' + viewDate.getFullYear()}</h4>
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
                            <input style={{
                                backgroundColor: CompareDate(day, date) ? 'orange' : CompareDate(day, new Date(Date.now())) ? 'gray' : undefined,
                            }} key={index} type="button" value={day.getDate()} onClick={() => selectedDate(day)} />
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