import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "./loading-component";
import { FetchGet, FetchGetAll, NumberOutput, StringOutput } from "../features/FetchGet";
import EditableElement from "./editable-component";

interface IMass {
    time: Date,
    intentions: IIntention[]
    isCollective: boolean,
    celebrator: string,
}
interface IIntention {
    id: string,
    name: string,
    celebrator: string,
    donation: number,
    donated: string
}
export default function ItentionReportElement() {
    const daySpelling = [
        "Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"
    ]
    const { token, start_date, end_date } = useParams();
    const tempStart = new Date((Number(start_date) == -1) ? Date.now() : Number(start_date))
    tempStart.setHours(0, 0, 0, 0)
    const tempEnd = new Date((Number(end_date) == -1) ? Date.now() : Number(end_date))
    tempEnd.setHours(0, 0, 0, 0)
    const [start, setStart] = useState(tempStart)
    const [end, setEnd] = useState(tempEnd)
    const [masses, setMasses] = useState<IMass[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(
        () => {
            (async function () {
                try {

                    if (token !== undefined) {
                        setIsLoading(true)
                        setMasses([])
                        const massData = await FetchGet('integer', token, 'zielonki_mass', start.getTime(), end.getTime()) as unknown as NumberOutput[]
                        const tempMasses = [] as IMass[]
                        for (let i = 0; i < massData.length; i++) {
                            const intentionData = await FetchGetAll('text', token, massData[i].id + 'intention') as unknown as StringOutput[]
                            const tempIntentions = [] as IIntention[]
                            for (let j = 0; j < intentionData.length; j++) {
                                
                                tempIntentions.push({
                                    name: intentionData[j].output,
                                    id: intentionData[j].id,
                                    celebrator: (await FetchGetAll('text', token, intentionData[j].id + 'celebrator') as unknown as StringOutput[])[0]?.output ?? '',
                                    donation: (await FetchGetAll('integer', token, intentionData[j].id + 'donation') as unknown as NumberOutput[])[0]?.output ?? 0,
                                    donated: (await FetchGetAll('text', token, intentionData[j].id + 'donated') as unknown as StringOutput[])[0]?.output ?? ''
                                })
                            }
                            const isCollective = (await FetchGetAll('number', token, massData[i].id + 'collective') as unknown as StringOutput[]).length > 0
                            tempMasses.push({
                                time: new Date(massData[i].output),
                                intentions: tempIntentions,
                                isCollective: isCollective,
                                celebrator: tempIntentions.filter(p => p.celebrator != undefined)[0].celebrator
                            })
                        }
                        setIsLoading(false)
                        setMasses(tempMasses)
                    }
                } catch (e) {
                    console.error(e);
                }
            })();
        }, [token, start, end])

    return (

        <>
            <div>
                Start:
                <input id="inputDate" type="datetime-local"
                    value={start.toLocaleString('sv').replace(' GMT', '').substring(0, 16)}
                    onChange={(e) => setStart(new Date(e.target.value))} />
                End:
                <input id="inputDate" type="datetime-local"
                    value={end.toLocaleString('sv').replace(' GMT', '').substring(0, 16)}
                    onChange={(e) => setEnd(new Date(e.target.value))} />
                <div className="loadingcontainer" style=
                    {{
                        display: isLoading ? 'block' : 'none',
                    }}>
                    <LoadingComponent />
                </div>
                <div style=
                    {{
                        display: isLoading ? 'none' : 'block',
                    }}>
                    <h4>{'Raport: ' + daySpelling[start.getDay()] + ' ' + (start.getDate() + '.').padStart(3, '0') + ((start.getMonth() + 1) + '.').padStart(3, '0') + start.getFullYear() + ' r. - ' + daySpelling[end.getDay()] + ' ' + (end.getDate() + '.').padStart(3, '0') + ((end.getMonth() + 1) + '.').padStart(3, '0') + end.getFullYear() + ' r.'} </h4>
                    {masses.map((mass) => (
                        <>
                            {mass.intentions.map((intention) => (
                                <>
                                    <div>{intention.name}
                                        <EditableElement type="text" name={intention.id +'donation'} multiple={false} />
                                    <div style=
                                            {{
                                                display: intention.celebrator ? 'inline' : 'none',
                                            }}>
                                            {intention.celebrator}
                                        Edi</div>
                                    </div>
                                </>
                            ))}
                        </>
                    ))}
                </div>
            </div>
        </>
    );
}