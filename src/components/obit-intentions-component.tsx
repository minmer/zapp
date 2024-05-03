import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchGetAll, NumberOutput, StringOutput } from "../features/FetchGet";

interface IIntention {
    id: string,
    name: string,
    mass?: Date
}
export default function ObitIntentionsElement() {
    const { token, obit } = useParams();
    const [intentions, setIntentions] = useState<IIntention[]>([])
    const [name, setName] = useState('')

    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    setName((await FetchGetAll('text', token, 'obit') as StringOutput[]).filter(p => p.id == obit)[0].output)
                    const tempData = (await FetchGetAll('text', token, obit + 'intention') as StringOutput[]).map(p => ({ id: p.id, name: p.output, mass: undefined as unknown as Date }))
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

    return (
        <>
            <h4>
                {name}
            </h4>
            {intentions.map((intention) => (
                <div className="inline-communion-list">
                    {intention.name}
                    <div style={{
                        display: intention.mass ? 'block' : 'none',
                    }}>{
                            (intention.mass?.getDate() + '.').padStart(3, '0') + ((intention.mass?.getMonth() ?? 0 + 1) + '.').padStart(3, '0') + intention.mass?.getFullYear() + ' r. - ' + intention.mass?.getHours() + ':' + intention.mass?.getMinutes().toString().padStart(2, '0')}
                    </div>
                    <div style={{
                        display: intention.mass ? 'none' : 'block',
                    }}>Msza Święta bezterminowa (zostanie odprawiona w parafii lub poza, jednak bez konkretnej daty)
                    </div>
                </div>
            ))
            }
        </>
    );
}