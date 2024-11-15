import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "../generals/LoadingComponent";
import { FetchInformationGet, FetchInformationGetAll, NumberOutput, StringOutput } from "../features/FetchInformationGet";
import OldEditableElement from "../temp/old-editable-element";
import { User } from "../structs/user";

interface IMass {
    id: string,
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
interface IPriest {
    name: string,
    donatedCount: number,
    donations: number,
    celebratorCount: number
}
export default function ItentionReportElement({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const daySpelling = [
        "Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"
    ]
    const { start_date, end_date } = useParams();
    const tempStart = new Date((Number(start_date) == -1) ? Date.now() : Number(start_date))
    tempStart.setHours(0, 0, 0, 0)
    const tempEnd = new Date((Number(end_date) == -1) ? Date.now() : Number(end_date))
    tempEnd.setHours(0, 0, 0, 0)
    const [start, setStart] = useState(tempStart)
    const [end, setEnd] = useState(tempEnd)
    const [masses, setMasses] = useState<IMass[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getParams({
            func: async (param: string | User) => {
                const token = param as string
                setIsLoading(true)
                setMasses([])
                const massData = await FetchInformationGet('datetime', token, 'new_zielonki_mass', start.getTime(), end.getTime(), 'new_intention_viewer') as unknown as NumberOutput[]
                const tempMasses = [] as IMass[]
                for (let i = 0; i < massData.length; i++) {
                    const intentionData = await FetchInformationGetAll('string', token, massData[i].id + 'intention') as unknown as StringOutput[]
                    const tempIntentions = [] as IIntention[]
                    for (let j = 0; j < intentionData.length; j++) {

                        tempIntentions.push({
                            name: intentionData[j].output,
                            id: intentionData[j].id,
                            celebrator: (await FetchInformationGetAll('string', token, intentionData[j].id + 'celebrator') as unknown as StringOutput[])[0]?.output ?? '',
                            donation: (await FetchInformationGetAll('double', token, intentionData[j].id + 'donation') as unknown as NumberOutput[])[0]?.output ?? 0,
                            donated: (await FetchInformationGetAll('string', token, intentionData[j].id + 'donated') as unknown as StringOutput[])[0]?.output ?? ''
                        })
                    }
                    const isCollective = (await FetchInformationGetAll('double', token, massData[i].id + 'collective') as unknown as NumberOutput[]).length > 0
                    tempMasses.push({
                        id: massData[i].id,
                        time: new Date(massData[i].output),
                        intentions: tempIntentions,
                        isCollective: isCollective,
                        celebrator: tempIntentions.filter(p => p.celebrator != undefined)[0]?.celebrator
                    })
                }
                setIsLoading(false)
                setMasses(tempMasses)
            }, type: 'token', show: false
        })
    }, [getParams, start, end])
    const createReport = () => {
        const tempPriests = []
        for (let i = 0; i < masses.length; i++) {
            for (let j = 0; j < masses[i].intentions.length; j++) {
                tempPriests.push(masses[i].intentions[j].celebrator)
                tempPriests.push(masses[i].intentions[j].donated)
            }
        }
        const priests = tempPriests.filter((v, i, a) => a.indexOf(v) === i).map<IPriest>(i => ({ name: i, donatedCount: 0, celebratorCount: 0, donations: 0 }))
        for (let i = 0; i < masses.length; i++) {
            let intentions = 0;
            for (let j = 0; j < masses[i].intentions.length; j++) {
                priests.map(item => {
                    if (item.name == masses[i].intentions[j].celebrator && masses[i].intentions[j].donation != 0) {
                        item.celebratorCount++
                    }
                })
                priests.map(item => {
                    if (item.name == masses[i].intentions[j].donated && masses[i].intentions[j].donation != 0) {
                        item.donatedCount++
                        item.donations += masses[i].intentions[j].donation
                    }
                })
                if (masses[i].isCollective) {
                    intentions += masses[i].intentions[j].donation
                }
            }
            if (masses[i].isCollective) {
                console.log("123")
                console.log(intentions)
            }
        }
        console.log(priests)
        console.log(masses)
    }


    return (

        <>
            <div style=
                {{
                    position: "relative"
                }}>
                Start:
                <input id="inputDate" type="datetime-local"
                    value={start.toLocaleString('sv').replace(' GMT', '').substring(0, 16)}
                    onChange={(e) => setStart(new Date(e.target.value))} />
                End:
                <input id="inputDate" type="datetime-local"
                    value={end.toLocaleString('sv').replace(' GMT', '').substring(0, 16)}
                    onChange={(e) => setEnd(new Date(e.target.value))} />
                <div style=
                    {{
                        display: isLoading ? 'none' : 'block',
                    }}>
                    <h4>{'Raport: ' + daySpelling[start.getDay()] + ' ' + (start.getDate() + '.').padStart(3, '0') + ((start.getMonth() + 1) + '.').padStart(3, '0') + start.getFullYear() + ' r. - ' + daySpelling[end.getDay()] + ' ' + (end.getDate() + '.').padStart(3, '0') + ((end.getMonth() + 1) + '.').padStart(3, '0') + end.getFullYear() + ' r.'} </h4>
                    {masses.map((mass) => (
                        <>
                            <h5>{(mass.time.getDate() + '.').padStart(3, '0') + ((mass.time.getMonth() + 1) + '.').padStart(3, '0') + mass.time.getFullYear() + ' r. - ' + mass.time.getHours() + ':' + mass.time.getMinutes().toString().padStart(2, '0')}</h5>
                            {mass.intentions.map((intention) => (
                                <>
                                    <div>{intention.name}
                                        <OldEditableElement getParams={getParams} description="Celebrans" type="text" name={intention.id + 'celebrator'} multiple={false} dbkey="intention_raport_admin" />
                                        <OldEditableElement getParams={getParams} description="Ofiara" type="number" name={intention.id + 'donation'} multiple={false} dbkey="intention_raport_admin" />
                                        <OldEditableElement getParams={getParams} description="Ofiaroodbiorca" type="text" name={intention.id + 'donated'} multiple={false} dbkey="intention_raport_admin" />
                                    </div>
                                </>
                            ))}
                        </>
                    ))}
                </div>
                <input type="button" value='Create Report' onClick={createReport} />
                <div className="loadingcontainer" style=
                    {{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                        display: isLoading ? 'block' : 'none',
                    }}>
                    <LoadingComponent />
                </div>
            </div>
        </>
    );
}