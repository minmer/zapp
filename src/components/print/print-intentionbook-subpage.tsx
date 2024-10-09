import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AddDaysToDate } from "../helpers/DateComparer";
import { User } from "../../structs/user";
import { DaySpelling, MonthSpelling } from "../../structs/consts";
import { LoadMasses } from "../../structs/mass";

export default function PrintIntentionbookSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const {year } = useParams()
    const [dates, setDates] = useState<{
        date: Date,
        masses: {
            time: Date,
            intentions:
            {
                description: string,

            }
        }
    }[]>([])

    useEffect(() => {

        (async function () {
            const tempYear = Number(year)
            let tempDates = [] as Date[]
            let date = new Date(tempYear ?? 0, 0, 1, 0, 0, 0, 0)
            while (date.getFullYear() == tempYear) {
                await LoadMasses(getParams, date, AddDaysToDate(date, 1))
                tempDates = [...tempDates, date]
                date = AddDaysToDate(date, 1)
                console.log(date)
            }
            setDates(tempDates)
        })()
    }, [year, getParams])

    return (

        <div className='intentionbook'>
            {dates.map(date => (
                <div className='print-page'>
                    <div className='homily'>
                    Kazanie
                    </div>
                    <div className='issues'>
                        <div className='header'>Wspomnienia, wydarzenia i nieobecności</div>
                        <div className='lines'>
                            <div /><div /><div /><div />
                        </div>
                    </div>
                    <div className='date'>
                        <div>
                            <div className='day'>
                                {date.getDate()}
                            </div>
                            <div className='spelling'>
                                {DaySpelling[date.getDay()]}
                            </div>
                            <div className='month'>
                                {MonthSpelling[date.getMonth()]}
                            </div>
                        </div>
                    </div>
                    <div className='masses'>
                        <div className='mass'>
                            <div className='hour'>
                                7:00
                            </div>
                            <div className='intentions'>
                                <div className='intention'>
                                    <div className='celebrator'>
                                        Cel.
                                    </div>
                                    <div className='lines' >
                                        <div />
                                        <div />
                                    </div>
                                    <div className='donator'>
                                        Ofiara
                                    </div>
                                    <div className='sign'>
                                        Podpis
                                    </div>
                                </div>
                                <div className='intention'>
                                    <div className='celebrator'>
                                        Cel.
                                    </div>
                                    <div className='lines' >
                                        <div />
                                        <div />
                                    </div>
                                    <div className='donator'>
                                        Ofiara
                                    </div>
                                    <div className='sign'>
                                        Podpis
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mass'>
                            <div className='hour'>
                                18:00
                            </div>
                            <div className='intentions'>
                                <div className='intention'>
                                    <div className='celebrator'>
                                        Cel.
                                    </div>
                                    <div className='lines' >
                                        <div />
                                        <div />
                                    </div>
                                    <div className='donator'>
                                        Ofiara
                                    </div>
                                    <div className='sign'>
                                        Podpis
                                    </div>
                                </div>
                                <div className='intention'>
                                    <div className='celebrator'>
                                        Cel.
                                    </div>
                                    <div className='lines' >
                                        <div />
                                        <div />
                                    </div>
                                    <div className='donator'>
                                        Ofiara
                                    </div>
                                    <div className='sign'>
                                        Podpis
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}