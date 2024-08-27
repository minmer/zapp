import { useState } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "../generals/loading-component";
import { FetchInformationGet, DateOutput, FetchInformationGetAll, StringOutput, BooleanOutput } from "../features/FetchInformationGet";

interface IntentionDays {
    day: Date,
    description: string[],
    masses: Mass[],
    row: number
    rowSpan: number
}
interface Mass {
    time: Date,
    color: string,
    collective: boolean,
    intentions: Intention[]
    row: number
    rowSpan: number
}
interface Intention {
    title: string
    columnspan: number,
    column: number,
    row: number
    index: string,
}

export default function IntentionPage() {
    const daySpelling = [
        "Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"
    ]
    const { token, init_date } = useParams();
    const startDate = new Date(Number(init_date))
    const endDate = new Date(Number(init_date))
    endDate.setHours(24 * 6 + endDate.getHours())
    const [days, setDays] = useState([] as IntentionDays[])
    const [collective, setCollective] = useState([] as Intention[])
    const [collectiveDate, setCollectiveDate] = useState<Date>()
    const [span, setSpan] = useState("")
    const [rows, setRows] = useState(0)
    const [loading, setLoading] = useState("block")
    const loadMasses = async function loadMasses() {
        const tempDays = [] as IntentionDays[]
        let daySpan = -1;
        let dayRow = 2;
        for (let i = startDate.getDate(); i < startDate.getDate() + 7; i++) {
            daySpan = -1;
            let massRow = dayRow;
            const newDay = new Date(startDate.getTime());
            newDay.setDate(i);
            const start = new Date(newDay.getTime());
            start.setHours(0, 0, 0, 0)
            const end = new Date(start.getTime());
            end.setDate(end.getDate() + 1)
            const massData = await FetchInformationGet('datetime', token ?? '', 'new_zielonki_mass', start.getTime(), end.getTime(), 'new_intention_viewer') as unknown as DateOutput[]
            const descriptions = [] as string[]
            const masses = [] as Mass[]
            for (let j = 0; j < massData.length; j++) {

                const descriptionData = await FetchInformationGetAll('string', token ?? '', massData[j].id + 'description') as unknown as StringOutput[]
                if (!descriptions.includes(descriptionData[0].output)) {
                    descriptions.push(descriptionData[0].output);
                }

                const intentionData = await FetchInformationGetAll('string', token ?? '', massData[j].id + 'intention') as unknown as StringOutput[]
                const intentions = [] as Intention[]
                let intentionRow = massRow;
                for (let k = 0; k < intentionData.length; k++) {
                    intentions.push({
                        title: intentionData[k].output.replace(" ", " "),
                        row: intentionRow,
                        columnspan: intentionData.length == 1 ? 2 : 1,
                        column: intentionData.length == 1 ? 6 : 7,
                        index: intentionData.length == 1 ? '' : (k + 1) + ')',
                    })
                    intentionRow += 2
                }
                const colorData = await FetchInformationGetAll('string', token ?? '', massData[j].id + 'color') as unknown as StringOutput[]
                const collectiveData = await FetchInformationGetAll('bool', token ?? '', massData[j].id + 'collective') as unknown as BooleanOutput[]
                if (collectiveData.length > 0) {
                    masses.push({
                        row: massRow,
                        time: new Date(massData[j].output),
                        intentions: [{
                            title: " - Msza Święta Zbiorowa - ",
                            row: massRow,
                            columnspan: 2,
                            column: 6,
                            index: '',
                        }],
                        color: colorData[0]?.output ?? '#fff',
                        rowSpan: 1,
                        collective: true
                    });
                    massRow += 2
                    daySpan += 2
                    setCollective(intentions)
                    setCollectiveDate(new Date(massData[j].output))
                }
                else {
                    masses.push({
                        row: massRow,
                        time: new Date(massData[j].output),
                        intentions: intentions,
                        color: colorData[0]?.output ?? '#fff',
                        rowSpan: intentions.length * 2 - 1,
                        collective: false
                    });
                    massRow += intentions.length * 2
                    daySpan += intentions.length * 2
                }
            }
            tempDays.push({
                row: dayRow,
                rowSpan: daySpan,
                day: newDay,
                description: descriptions,
                masses: masses,
            });
            dayRow += daySpan + 1;
        }
        let span = "1px";
        for (let i = 1; i < dayRow / 2; i++) {
            span += ' Auto 1px'
        }
        setDays(tempDays)
        setSpan(span)
        setRows(dayRow-1)
        setLoading("none")
    }
    if (days.length == 0)
        loadMasses();
    

    return (

        <>
            <div className="asd00">
                <div className="asd01">Intencje Mszy Świętych</div>
                <div className="asd02">
                    {(startDate.getDate() + '.').padStart(3, '0') + ((startDate.getMonth() + 1) + '.').padStart(3, '0') + startDate.getFullYear() + ' r. - ' + (endDate.getDate() + '.').padStart(3, '0') + ((endDate.getMonth() + 1) + '.').padStart(3, '0') + endDate.getFullYear() + ' r.'}
                </div>
                <div style=
                    {{
                        height: "500px",
                        display: loading,
                    }}>
                    <LoadingComponent />
                </div>
                <div className="asd03" style=
                    {{
                        gridTemplateRows: span
                    }}>
                    <div className="asd04"></div>
                    {days.map(item => (
                        

                        <>
                    <div className="asd05" style=
                        {{
                            gridRow: item.row + ' / span ' + item.rowSpan
                        } }>
                            <div className="asd06" >
                                <div className="asd07">
                                    {daySpelling[item.day.getDay()]}
                                </div>
                            <div className="asd08">
                                        {(item.day.getDate() + '.').padStart(3, '0') + ((item.day.getMonth() + 1) + '.').padStart(3, '0') + item.day.getFullYear() + ' r.'}
                                    </div>

                                    {item.description.map(desc => (
                                        <div className="asd09">
                                            {desc}
                                        </div>
                                    ))}
                        </div>
                        </div>
                            <div className="asd04" style=
                                {{
                                    gridRow: item.row -1
                                }}></div>


                            {item.masses.map(mass => (
                                <>
                                <div className="asd10" style=
                                    {{
                                        gridRow: mass.row + ' / span ' + mass.rowSpan
                                        }}>
                                        {mass.time.getHours() + ':' + mass.time.getMinutes().toString().padStart(2, '0')}
                                </div>
                                <div className="asd11" style=
                                    {{
                                        gridRow: mass.row + ' / span ' + mass.rowSpan,
                                        background: mass.color
                                    }}>
                                    </div>
                                    {mass.intentions.map(intention => (
                                        <>
                                            <div className="asd12" style=
                                                {{
                                                gridRow: intention.row,
                                                gridColumn: intention.column + ' / span ' + intention.columnspan,
                                                }}>
                                                {intention.title}
                                            </div>
                                            <div className="asd13" style=
                                                {{
                                                gridRow: intention.row
                                                }}>
                                                {intention.index}
                                            </div>
                                        </>
                                    ))}
                                    <div className="asd14" style=
                                        {{
                                            gridRow: mass.row-1
                                        }}></div>

                        </>
                            ))}
                        </>
                    ))}
                    <div className="asd15" style=
                        {{
                        gridColumn: 1,
                        gridRow: '1 / span ' + rows
                        }}></div>
                    <div className="asd15" style=
                        {{
                        gridColumn: 3,
                        gridRow: '1 / span ' + rows
                        }}></div>
                    <div className="asd15" style=
                        {{
                        gridColumn: 5,
                        gridRow: '1 / span ' + rows
                        }}></div>
                    <div className="asd15" style=
                        {{
                        gridColumn: 8,
                        gridRow: '1 / span ' + rows
                        }}></div>
                    <div className="asd04" style=
                        {{
                            gridRow: rows
                        }}></div>
                </div>
                    <div className="asd20" style=
                        {{
                            display: collectiveDate ? 'block': 'none'
                        }}>
                        <div className="asd21">
                        {(collectiveDate?.getDate() + '.').padStart(3, '0') + ((collectiveDate?.getMonth() ?? 0 )+1 + '.').padStart(3, '0') + collectiveDate?.getFullYear() + ' r. - 18:00'}
                        </div>
                        {collective.map(intention => (
                            <div className="asd22">
                                {intention.title}
                            </div>
                        ))}
                    </div>
            </div>
        </>
    );
}