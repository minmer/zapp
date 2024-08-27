import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "../generals/loading-component";
import { FetchInformationGet, FetchInformationGetAll, DateOutput, StringOutput } from "../features/FetchInformationGet";

interface Mass {
    time: Date,
    intentions: string[]
}
export default function ItentionMonthElement() {
    const monthSpelling = [
        "Styczeń ", "Luty ", "Marzec ", "Kwiecień ", "Maj ", "Czerwiec ", "Lipiec ", "Sierpień ", "Wrzesień ", "Październik ", "Listopad ", "Grudzień "
    ]
    const daySpelling = [
        "Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"
    ]
    const { init_date } = useParams();
    const token = "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U"
    const [date, setDate] = useState(new Date((Number(init_date) == -1) ? Date.now() : Number(init_date)))
    const [preMonth, setPreMonth] = useState([] as string[])
    const [month, setMonth] = useState([] as Date[])
    const [nextMonth, setNextMonth] = useState([] as string[])
    const [masses, setMasses] = useState([] as Mass[])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(
        () => {
            const start = new Date(date.getTime())
            start.setHours(0,0,0,0)
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
        }, [date])
    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    setIsLoading(true)
                    setMasses([])
                    date.setHours(0,0,0,0)
                    const massData = await FetchInformationGet('datetime', token, 'new_zielonki_mass', date.getTime(), date.getTime() + 86400000, 'new_intention_viewer') as unknown as DateOutput[]
                        const tempMasses = [] as Mass[]
                        for (let j = 0; j < massData.length; j++) {
                            const intentionData = await FetchInformationGetAll('string', token, massData[j].id + 'intention') as unknown as StringOutput[]
                            tempMasses.push({
                                time: massData[j].output,
                                intentions: intentionData.map(item => item.output),
                            })
                        }
                        setIsLoading(false)
                        setMasses(tempMasses)
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [date, token])

    const changeMonth = (change: number) => {
        date.setMonth(date.getMonth() + change)
        setDate(new Date(date.getTime()));
    }

    const selectedDate = (newDate: Date) => {
        setDate(new Date(newDate.getTime()));
    }

    return (

        <>
            <div className="content-intentionmonth">
                <div className="navigation">
                    <input type="button" value="<" onClick={() => changeMonth(-1)} />
                    <h3>{monthSpelling[date.getMonth()] + date.getFullYear()}</h3>
                    <input type="button" value=">" onClick={() => changeMonth(1)} />
                    <div className="clear"/>
                </div >
                <div className="calendar">
                    <>
                        {daySpelling.map(spelling =>
                        (
                            <div className="spelling">{spelling}</div>
                        ))
                        }
                        {preMonth.map(() =>
                        (
                            <div></div>
                        ))
                        }
                        {
                            month.map(day =>
                            (
                                <input type="button" value={day.getDate()} onClick={() => selectedDate(day) } />
                            ))
                        }
                        {nextMonth.map(() =>
                        (
                            <div></div>
                        ))
                        }
                    </>
                </div>
                <div className="day">
                    <div className="loadingcontainer" style=
                        {{
                            display: isLoading ? 'block' : 'none',
                        }}>
                        <LoadingComponent />
                    </div>
                    <h4 style=
                        {{
                            display: isLoading ? 'none' : 'block',
                        }}>{daySpelling[date.getDay()] + ' ' + (date.getDate() + '.').padStart(3, '0') + ((date.getMonth() + 1) + '.').padStart(3, '0') + date.getFullYear() + ' r.'} </h4>
                    <div className="daygrid">
                        {masses.map(mass => (
                            <>
                                <div className="masshour" style={{
                                    gridRow: 'span ' + mass.intentions.length,
                                }}>
                                    {mass.time.getHours() + ':' + mass.time.getMinutes().toString().padStart(2, '0')}
                                </div>
                                {
                                    mass.intentions.map(intention => (
                                        <div className="intention">
                                            <div>
                                                {intention}
                                            </div>
                                        </div>
                                    ))
                                }
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}