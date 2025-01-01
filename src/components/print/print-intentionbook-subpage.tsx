import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AddDaysToDate } from "../helpers/DateComparer";
import { User } from "../../structs/user";
import { DaySpelling, MonthSpelling } from "../../structs/consts";
import { BooleanOutput, DateOutput, FetchInformationGet, FetchInformationGetAll, NumberOutput, StringOutput } from "../../features/FetchInformationGet";

export default function PrintIntentionbookSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const { year } = useParams()
    const [dates, setDates] = useState<{
        date: Date,
        description: string[],
        height: number, 
        masses: {
            time?: Date,
            description?: string[],
            color?: string,
            collective?: boolean,
            intentions?:
            {
                description?: string,
                donation?: number,
                donator?: string,
            }[],
        }[],
        appointments:
        {
            time?: Date,
            description?: string[],

        }[],
    }[]>([])

    useEffect(() => {

        (async function () {
            const tempYear = Number(year)
            let tempDates = [] as Date[]
            let date = new Date(tempYear ?? 0, 0, 1, 0, 0, 0, 0)
            while (date.getDate() != 31) {
                tempDates = [...tempDates, date]
                date = AddDaysToDate(date, 1)
            }
            console.log('start')
            await getParams({
                func: async (token: string | User) => {
                    const asd = await Promise.all(tempDates.map(async day => {
                        const appointments = [...await Promise.all(((await FetchInformationGet('datetime', token as string, 'new_zielonki_appointment', day.getTime(), AddDaysToDate(day, 1).getTime(), 'new_intention_admin')) as unknown as DateOutput[]).map(async appointment =>
                        ({
                            time: appointment.output,
                            description: ((await FetchInformationGetAll('string', token as string, appointment.id + 'description')) as unknown as StringOutput[]).map(item => item.output),
                        }))), {}, {}, {}]
                        const masses = [...await Promise.all(
                            ((await FetchInformationGet('datetime', token as string, 'new_zielonki_mass', day.getTime(), AddDaysToDate(day, 1).getTime(), 'new_intention_admin')) as unknown as DateOutput[]).map(async mass => {
                                const intentions = [...await Promise.all(((await FetchInformationGetAll('string', token as string, mass.id + 'intention')) as unknown as StringOutput[]).map(async intention =>
                                ({
                                    description: intention.output,
                                    donation: ((await FetchInformationGetAll('double', token as string, intention.id + 'donation')) as unknown as NumberOutput[]).map(item => item.output)[0],
                                    donated: ((await FetchInformationGetAll('string', token as string, intention.id + 'donated')) as unknown as StringOutput[]).map(item => item.output)[0],
                                }))), {}, {}]
                                const collective = ((await FetchInformationGetAll('bool', token as string, mass.id + 'collective')) as unknown as BooleanOutput[]).map(item => item.output)[0] ?? false
                                return {
                                    time: mass.output,
                                    description: ((await FetchInformationGetAll('string', token as string, mass.id + 'description')) as unknown as StringOutput[]).map(item => item.output),
                                    color: ((await FetchInformationGetAll('string', token as string, mass.id + 'color')) as unknown as StringOutput[]).map(item => item.output)[0],
                                    intentions: intentions.slice(0, collective ? 1 : intentions.length < 5 ? 2 : intentions.length - 2),
                                    collective: collective,
                                }
                            })), { intentions: [{}], description: [], collective: false }, 
                            ]
                        return {
                            date: day,
                            description: ((await FetchInformationGet('string', token as string, 'new_zielonki_date', day.getTime(), AddDaysToDate(day, 1).getTime(), 'new_intention_admin')) as unknown as StringOutput[]).map(item => item.output),
                            masses: masses.slice(0, masses.length > 4 ? masses.length - 1 : masses.length),
                            appointments: appointments.slice(0, appointments.length > 8 ? appointments.length - 1 : appointments.length),
                            height: Math.max(masses.reduce((sum, current) => sum + current.intentions.length, 0) * 24 + masses.reduce((sum, current) => sum + current.description.length, 0) * 8 + appointments.length * 12, 236.25)
                        }
                    }))
                    console.log(asd)
                    setDates(asd)
                }, type: 'token', show: true
            })
            console.log('end')
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
                            <div /><div /><div/><div/>
                        </div>
                        <div className='issue'>
                            {date.description?.map(issue => (
                                <span>{issue}<br/></span>
                            ))}
                            </div>
                    </div>
                    <div className='date'>
                        <div>
                            <div className='day'>
                                {date.date.getDate()}
                            </div>
                            <div className='spelling'>
                                {DaySpelling[date.date.getDay()]}
                            </div>
                            <div className='month'>
                                {MonthSpelling[date.date.getMonth()]}
                            </div>
                        </div>
                    </div>
                    <div className='masses'>
                        {date.masses.map(mass => (
                            <div className='mass'>
                                <div className='type'>
                                    {mass.description?.map(desc => (
                                        <span style={{ height: (1890 / date.height)+'mm' }}>{desc}<br /></span>
                                    ))}</div>
                                <div className={mass.time ? 'hour' : 'hour light'}>
                                    {mass.time ? mass.time.getHours() + ':' + mass.time.getMinutes().toString().padStart(2,'0'): 'godz.'}
                                </div>
                                <div className='color'>
                                    {mass.color?.toLowerCase() == '#00ff00' ? 'zielony' : mass.color?.toLowerCase() == '#800080' ? 'fioletowy' : mass.color?.toLowerCase() == '#ff0000' ? 'czerwony' : mass.color?.toLowerCase() == '#ff80ff' ? 'różowy' : mass.color?.toLowerCase() == '#ffffff' ? 'biały' : ''}
                                </div>
                                <div className='intentions'>
                                    {mass.intentions?.map(intention => (
                                        <div className='intention' style={{ height: 5670 / date.height + 'mm' }}>
                                            <div className='celebrator' style={{ paddingTop: Math.min(Math.max(8 - (date.height - 236.35) * .04, 0), 8) + 'mm' }}>
                                                Cel.
                                            </div>
                                            <div className='lines' >
                                                <div />
                                                <div />
                                            </div>
                                            <div className={intention.description?.startsWith('rez') ? 'intention_desc gray' : 'intention_desc'}>
                                                {mass.collective ? 'Msza Zbiorowa' : intention.description ?? ' '}
                                            </div>
                                            <div className='donator' style={{ paddingTop: Math.min(Math.max(2 - (date.height - 236.35) * .02, 0), 2) + 'mm' }}>
                                                {intention.donation && intention.donator ? intention.donation + intention.donator : 'Ofiara'}
                                            </div>
                                            <div className='sign' style={{ paddingTop: Math.min(Math.max(2 - (date.height - 236.35) * .02, 0), 2) + 'mm' }}>
                                                Podpis
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='appointments'>
                        {date.appointments.map(appointment => (
                            <div className='appointment' style={{ height: 2835 / date.height + 'mm'}}>
                                <div className={appointment.time ? 'hour' : 'hour light'} style={{ height: 2700 / date.height + 'mm', paddingTop: Math.min(Math.max(2 - (date.height - 236.35) * .02, 0), 2) + 'mm' }}>
                                    {appointment.time ? appointment.time.getHours() + ':' + appointment.time.getMinutes().toString().padStart(2, '0') : 'godz.'}
                                </div>
                                <div className={appointment.description ? 'type' : 'type light'} style={{ height: 2700 / date.height + 'mm', paddingTop: Math.min(Math.max(2 - (date.height - 236.35) * .02, 0), 2) + 'mm' }}>
                                    {appointment.description ?? 'Wydarzenie'}
                                </div>
                                <div className='responsible' style={{ height: 2835 / date.height + 'mm', paddingTop: Math.min(Math.max(2 - (date.height - 236.35) * .02, 0), 2) + 'mm' }}>
                                Odpowiedzialny
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}