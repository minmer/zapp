import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "../generals/LoadingComponent";
import { FetchInformationGet, FetchInformationGetAll, DateOutput, StringOutput } from "../features/FetchInformationGet";
import MonthDateSelectionElement from "../generals/month-date-selection-element";
import { DaySpelling } from "../structs/consts";

interface Mass {
    time: Date,
    intentions: string[]
}
export default function ItentionMonthElement() {
    const { init_date } = useParams();
    const token = "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U"
    const [date, setDate] = useState(new Date((Number(init_date) == -1) ? Date.now() : Number(init_date)))
    const [masses, setMasses] = useState([] as Mass[])
    const [isLoading, setIsLoading] = useState(true)
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

    return (

        <>
            <div className="content-intentionmonth">
                <MonthDateSelectionElement onSelectionChange={(date) => { if (date) setDate(date) }} />
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
                        }}>{DaySpelling[date.getDay()] + ' ' + (date.getDate() + '.').padStart(3, '0') + ((date.getMonth() + 1) + '.').padStart(3, '0') + date.getFullYear() + ' r.'} </h4>
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