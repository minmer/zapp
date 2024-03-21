import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FetchGet, FetchGetAll, NumberOutput, StringOutput } from "../features/FetchGet";
import LoadingComponent from "./loading-component";
interface Day {
    day: Date,
    masses: Mass[]
}
interface Mass {
    time: Date,
    intentions: string[]
}
export default function ItentionWeekElement() {
    const daySpelling = [
        "Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"
    ]
    const { token, init_date } = useParams();
    const [selectedDate, setSelectedDate] = useState(new Date((Number(init_date) == -1) ? Date.now() : Number(init_date)))
    const [week, setWeek] = useState(new Date(0))
    const [endWeek, setEndWeek] = useState(new Date(0))
    const [days, setDays] = useState([] as Day[])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const newWeek = new Date(selectedDate.getTime())
        newWeek.setDate(newWeek.getDate() - newWeek.getDay() + 1 - (newWeek.getDay() == 0 ? 7 : 0))
        newWeek.setHours(0, 0, 0, 0)
        if (newWeek.getTime() != week?.getTime()) {
            {
                setWeek(new Date(newWeek.getTime()))
                newWeek.setDate(newWeek.getDate() + 7)
                newWeek.setMilliseconds(-1)
                setEndWeek(new Date(newWeek.getTime()))
            }
        }
    }, [week, endWeek, selectedDate])
    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    setIsLoading(true)
                    setDays([])
                    const tempDays = [] as Day[]
                    for (let i = 0; i < 7; i++) {
                        const massData = await FetchGet('integer', token, 'zielonki_mass', week.getTime() + (i * 86400000), week.getTime() + ((i + 1) * 86400000)) as unknown as NumberOutput[]
                        const tempMasses = [] as Mass[]
                        for (let j = 0; j < massData.length; j++) {
                            const intentionData = await FetchGetAll('text', token, massData[j].id + 'intention') as unknown as StringOutput[]
                            tempMasses.push({
                                time: new Date(massData[j].output),
                                intentions: intentionData.map(item => item.output),
                            })
                        }
                        tempDays.push({
                            day: new Date(week.getTime() + (i * 86400000)),
                            masses: tempMasses,
                        })
                    }
                    if (!(tempDays[0]?.day?.getDay() != 1)) {
                        setIsLoading(false)
                        setDays(tempDays)
                    }
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [week, token])

    return (

        <>
            <div className="content-intentionweek">
                <h3>Intencje w tygodniu ({(week.getDate() + '.').padStart(3, '0') + ((week.getMonth() + 1) + '.').padStart(3, '0') + week.getFullYear() + ' r. - ' + (endWeek.getDate() + '.').padStart(3, '0') + ((endWeek.getMonth() + 1) + '.').padStart(3, '0') + endWeek.getFullYear() + ' r.'})</h3>
                <input id="inputDate" type="date"
                    value={selectedDate.toISOString().substring(0, 10)}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))} />
                {days.map(day => (
                    <>
                        <h4>{daySpelling[day.day.getDay()] + ' ' + (day.day.getDate() + '.').padStart(3, '0') + ((day.day.getMonth() + 1) + '.').padStart(3, '0') + day.day.getFullYear() + ' r.'} </h4>
                        {day.masses.map(mass => (
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
                    </>
                ))
                }
                <div className="loadingcontainer" style=
                    {{
                    display: isLoading ? 'block' : 'none',
                    }}>
                    <LoadingComponent/>
                </div>
            </div >
            <Link to={`/intentionprint/` + token + '/' + week.getTime()} style=
                {{
                    display: isLoading ? 'none' : 'block',
                    margin: "36px 72px",
                    fontSize: "1.5em",
                }}>
                <h4>
                    Przygotuj pełną rozpiskę do wydruku
                </h4>
            </Link >
        </>
    );
}