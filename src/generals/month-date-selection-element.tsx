import { useEffect, useState } from "react";
import { DaySpelling, MonthSpelling } from "../structs/consts";
import { AddDaysToDate, CompareDate, ResetTime } from "../components/helpers/DateComparer";

export default function MonthDateSelectionElement({ onSelectionChange, isRange = false }: { onSelectionChange?: (t: Date | undefined, s: Date | undefined, e: Date | undefined) => void, isRange?: boolean }) {
    const [date, setDate] = useState<Date | undefined>()
    const [preMonth, setPreMonth] = useState([] as string[])
    const [month, setMonth] = useState([] as Date[])
    const [nextMonth, setNextMonth] = useState([] as string[])
    const [viewDate, setViewDate] = useState(new Date(Date.now()))
    const [start, setStart] = useState<Date | undefined>()
    const [end, setEnd] = useState<Date | undefined>()
    const [duringSelection, setDuringSelection] = useState(false)

    useEffect(
        () => {
            if (onSelectionChange != null && (date != undefined || start != undefined || end != undefined)) {

                onSelectionChange(date ? ResetTime(date) : undefined, start ? ResetTime(start) : undefined, end ? AddDaysToDate(ResetTime(end), 1) : undefined)
            }
        }, [date, start, end, onSelectionChange])

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
        if (isRange) {
            if (duringSelection)
                setEnd(newDate)
            else
                setStart(newDate)
            setDuringSelection(!duringSelection)
        }
        else
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
                                borderLeft: CompareDate(day, start) ? '20px orange solid' : '20px transparent solid',
                                borderTop: CompareDate(day, start) ? '20px orange solid' : '20px transparent solid',
                                borderRight: CompareDate(day, end) ? '20px orange solid' : '20px transparent solid',
                                borderBottom: CompareDate(day, end) ? '20px orange solid' : '20px transparent solid',
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