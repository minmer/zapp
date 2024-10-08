import { useEffect, useState } from "react";
import MonthDateSelectionElement from "../../generals/month-date-selection-element";
import EditableElement from "../../generals/editable-element";
import { User } from "../../structs/user";
import { LoadMasses, Mass } from "../../structs/mass";
import { AddDaysToDate } from "../helpers/DateComparer";
import { DateOutput, FetchInformationGet, FetchInformationGetAll, StringOutput } from "../../features/FetchInformationGet";
import { FetchInformationDelete } from "../../features/FetchInformationDelete";
export default function IntentionEditSubpage    ({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [date, setDate] = useState<Date>()
    const [masses, setMasses] = useState<Mass[]>([])
    const [issues, setIssues] = useState<StringOutput[]>([])
    const [appointments, setAppointments] = useState<{id: string, time: Date, type: string}[]>([])
    useEffect(
        () => {
            if (date != null)
                (async function () {
                    getParams({
                        func: async (param: string | User) => {
                            const token = param as string
                            setMasses(await LoadMasses(getParams, date, AddDaysToDate(date, 1)))
                            console.log(date.getTime(), AddDaysToDate(date, 1).getTime())
                            setIssues((await FetchInformationGet('string', token, 'new_zielonki_date', date.getTime(), AddDaysToDate(date, 1).getTime(), 'new_intention_admin')) as unknown as StringOutput[])
                            setAppointments(await Promise.all(((await FetchInformationGet('datetime', token, 'new_zielonki_appointment', date.getTime(), AddDaysToDate(date, 1).getTime(), 'new_intention_admin')) as unknown as DateOutput[]).map(async item => ({id: item.id, time: item.output, type: ((await FetchInformationGetAll('string', token, item.id + 'description')) as unknown as StringOutput[])[0].output }))))
                        }, type: 'token', show: false
                    })
                })();
        }, [getParams, date])

    const deleteByID = (id: string) => {
        getParams({
            func: async (param: string | User) => {
                const token = param as string
                FetchInformationDelete(token, 'new_intention_admin', id)
            }, type: 'token', show: false
        });
    }

    return (

        <>
            <MonthDateSelectionElement onSelectionChange={(date) => setDate(date)} />
            {masses.map(mass => (
                <div key={mass.id} >
                    <h2>{'Msza ' + mass.time.getHours() + ':' + mass.time.getMinutes().toString().padStart(2, '0')} <input type='button' value='Kasuj' onClick={() => deleteByID(mass.id)} /></h2>
                    <div>
                    <EditableElement getParams={getParams} editable={
                        {
                            name: mass.id + 'intention',
                            type: 'string',
                            multiple: true,
                            dbkey: 'new_intention_admin',
                            description: 'Intencje',
                            isOrdered: true,
                            showchildren: false,
                            showdescription: true,
                            break: '\n',
                        }
                    } />
                    </div>
                    <div>
                        <EditableElement getParams={getParams} editable={
                            {
                                name: mass.id + 'color',
                                type: 'color',
                                multiple: true,
                                dbkey: 'new_intention_admin',
                                description: 'Kolor',
                                isOrdered: true,
                                showchildren: false,
                                showdescription: true,
                                break: ', ',
                            }
                        } />
                    </div>
                    <div>
                    <EditableElement getParams={getParams} editable={
                        {
                            name: mass.id + 'description',
                            type: 'string',
                            multiple: true,
                            dbkey: 'new_intention_admin',
                            description: 'Wspomnienie',
                            isOrdered: true,
                            showdescription: true,
                            showchildren: false,
                            break: ', ',
                        }
                    } />
                    </div>
                    <div>
                    <EditableElement getParams={getParams} editable={
                        {
                            name: mass.id + 'collective',
                            type: 'checkbox',
                            dbkey: 'new_intention_admin',
                            description: 'Zbiorowa',
                            break: ', ',
                            isOrdered: true,
                            multiple: false,
                            showdescription: true,
                            showchildren: false,
                        }
                    } />
                    </div>
                </div>
            ))}
            <h2>Spotkania</h2>
            {appointments.map(appointment => (
                <div key={appointment.time.getTime() + appointment.type}>
                    {appointment.time.getHours() + ':' + appointment.time.getMinutes().toString().padStart(2, '0') + ' ' + appointment.type}
                    <input type='button' value='Kasuj' onClick={() => deleteByID(appointment.id)} />
                </div>
            ))}
            <h2>Wydarzenia</h2>
            {issues.map(issue => (
                <div >
                    {issue.output}
                    <input type='button' value='Kasuj' onClick={() => deleteByID(issue.id)} />
                </div>
            ))}
            
        </>
    );
}