import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchInformationGet, FetchInformationGetAll, NumberOutput, StringOutput } from "../features/FetchInformationGet";
import { FetchInformationDelete } from "../features/FetchInformationDelete";
import { FetchInformationPost } from "../features/FetchInformationPost";
import { FetchContext } from "../features/FetchPostContext";
import { User } from "../structs/user";

interface IIntention {
    id: string,
    name: string,
    mass?: Date
}
interface IMass {
    id: string,
    date: Date
}
export default function ObitEditElement({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const { obit } = useParams();
    const [intentions, setIntentions] = useState<IIntention[]>([])
    const [name, setName] = useState('')
    const [date, setDate] = useState(new Date(Date.now()))
    const [masses, setMasses] = useState<IMass[]>([])
    const [newIntention, setNewIntention] = useState('')
    const [newDonation, setNewDonation] = useState(0)
    const [selectedMass, setSelectedMass] = useState('')
    const [rr, setRR] = useState(true)

    useEffect(() => {
        (async function () {
            getParams({
                func: async (param: string | User) => {
                    const token = param as string
                    setName((await FetchInformationGetAll('string', token, 'obit') as StringOutput[]).filter(p => p.id == obit)[0].output)
                    const tempData = (await FetchInformationGetAll('string', token, obit + 'intention') as StringOutput[]).map(p => ({ id: p.id, name: p.output, mass: undefined as unknown as  Date }))
                    for (let i = 0; i < tempData.length; i++) {
                        const data = (await FetchInformationGetAll('long', token, tempData[i].id + 'mass') as NumberOutput[])[0]?.output
                        if (data) {
                            tempData[i].mass = new Date(data)
                        }
                    }
                    setIntentions(tempData)
                }, type: 'token', show: false
            });
        })();
    }, [getParams, obit])

    useEffect(() => {
        (async function () {
            getParams({
                func: async (param: string | User) => {
                    const token = param as string
                    console.log(123)
                    const start = new Date(date.getTime());
                    start.setHours(0, 0, 0, 0)
                    const end = new Date(start.getTime());
                    end.setDate(end.getDate() + 1)
                    const data = (await FetchInformationGet('datetime', token, 'new_zielonki_mass', start.getTime(), end.getTime(), 'new_intention_viewer') as NumberOutput[]).map(p => ({ id: p.id, date: new Date(p.output) }))
                    setMasses(data)
                    setSelectedMass(data[0].id)
                }, type: 'token', show: false
            });
        })();
    }, [getParams, date])

    const removeIntention = async (intention: IIntention) => {
        getParams({
            func: async (param: string | User) => {
                const token = param as string
                FetchInformationDelete(token ?? '', 'new_intention_admin', intention.id)
            }, type: 'token', show: false
        });
    }

    const linkMass = async (intention: IIntention) => {
        getParams({
            func: async (param: string | User) => {
                const token = param as string
                FetchContext(token ?? '', intention.id, 'new_intention_admin', selectedMass + 'intention', intentions.length)
                FetchContext(token ?? '', selectedMass, 'new_intention_admin', intention.id + 'mass', 0)
                setRR(!rr)
            }, type: 'token', show: false
        });
    }

    const unlinkMass = async (intention: IIntention) => {
        console.log(intention)
    }

    const createIntention = async () => {
        getParams({
            func: async (param: string | User) => {
                const token = param as string
                const id = await FetchInformationPost(token ?? '', 'new_intention_admin', [obit + 'intention'], '+ ' + name + ' / od ' + newIntention, [0])
                await FetchInformationPost(token ?? '', 'intention_raport_admin', [id + 'donation'], newDonation, [0])
                newIntention
            }, type: 'token', show: false
        });
    }

    return (
        <>
            <h4>
                {name}
            </h4>
            {intentions.map((intention) => (
                <div className="inline-communion-list">
                    {intention.name}
                    <input style={{
                        display: intention.mass ? 'none' : 'inline',
                    }} type="button" onClick={() => { linkMass(intention) }} value='+' />
                    <input style={{
                        display: intention.mass ? 'inline' : 'none',
                    }} type="button" onClick={() => { unlinkMass(intention) }} value={intention.mass?.toString() ?? ''} />
                    <input type="button" onClick={() => { removeIntention(intention) }} value='X' />
                </div>
            ))
            }
            <div>
                {'+ ' + name + ' / od '}
                <input type="string"
                    onChange={(e) => {
                        setNewIntention(e.target.value)
                    }}
                    value={newIntention} />
                <input type="number"
                    inputMode="numeric"
                    onChange={(e) => {
                        setNewDonation(+e.target.value)
                    }}
                    value={newDonation} />
                <input type="button" onClick={createIntention} value="Otwórz zapisy" />
            </div>
            <div>
                <input type="datetime-local"
                    value={date.toLocaleString('sv').replace(' GMT', '').substring(0, 16)}
                    onChange={(e) => setDate(new Date(e.target.value))} />
                <select
                    value={selectedMass}
                    onChange={(e) => setSelectedMass(e.target.value)}
                >

                    {masses.map((mass) => (
                        <option value={mass.id}>{mass.date.getHours() + ':' + mass.date.getMinutes().toString().padStart(2, '0')}</option>
                    ))
                    }
                </select>
            </div>
        </>
    );
}