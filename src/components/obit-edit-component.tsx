import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchGet, FetchGetAll, NumberOutput, StringOutput } from "../features/FetchGet";
import { FetchDelete } from "../features/FetchDelete";
import { FetchPost } from "../features/FetchPost";
import { FetchContext } from "../features/FetchPostContext";

interface IIntention {
    id: string,
    name: string,
    mass?: Date
}
interface IMass {
    id: string,
    date: Date
}
export default function ObitEditElement() {
    const { token, obit } = useParams();
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
            try {

                if (token !== undefined) {
                    setName((await FetchGetAll('text', token, 'obit') as StringOutput[]).filter(p => p.id == obit)[0].output)
                    const tempData = (await FetchGetAll('text', token, obit + 'intention') as StringOutput[]).map(p => ({ id: p.id, name: p.output, mass: undefined as unknown as  Date }))
                    for (let i = 0; i < tempData.length; i++) {
                        const data = (await FetchGetAll('integer', token, tempData[i].id + 'mass') as NumberOutput[])[0]?.output
                        if (data) {
                            tempData[i].mass = new Date(data)
                        }
                    }
                    setIntentions(tempData)
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token, obit])

    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    console.log(123)
                    const start = new Date(date.getTime());
                    start.setHours(0, 0, 0, 0)
                    const end = new Date(start.getTime());
                    end.setDate(end.getDate() + 1)
                    const data = (await FetchGet('integer', token, 'zielonki_mass', start.getTime(), end.getTime()) as NumberOutput[]).map(p => ({ id: p.id, date: new Date(p.output) }))
                    setMasses(data)
                    setSelectedMass(data[0].id)
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token, date])

    const removeIntention = async (intention: IIntention) => {
        FetchDelete(token ?? '', 'intention_admin', intention.id)
    }

    const linkMass = async (intention: IIntention) => {
        FetchContext(token ?? '', intention.id, 'intention_admin', selectedMass + 'intention', intentions.length)
        FetchContext(token ?? '', selectedMass, 'intention_admin', intention.id + 'mass', 0)
        setRR(!rr)
    }

    const unlinkMass = async (intention: IIntention) => {
        console.log(intention)
    }

    const createIntention = async () => {
        const id = await FetchPost("text", token ?? '', 'intention_admin', [obit + 'intention'], '+ ' + name + ' / od ' + newIntention, [0])
        await FetchPost("integer", token ?? '', 'intention_raport_admin', [id + 'donation'], newDonation, [0])
        newIntention
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
                    }} type="button" onClick={() => { unlinkMass(intention) }} value={intention.mass?.toISOString() ?? ''} />
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