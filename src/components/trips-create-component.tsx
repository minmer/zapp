import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import { FetchPostOwner } from "../features/FetchPostOwner";
import { FetchShareOwner } from "../features/FetchShareOwner";
import { FetchToken, TokenOutput } from "../features/FetchToken";
import { FetchInformationPost } from "../features/FetchInformationPost";
import { FetchInformationDelete } from "../features/FetchInformationDelete";
import { FetchReloadToken } from "../features/FetchReloadToken";

interface IAttribute {
    name: string,
    description: string,
    type: string
}
interface IList {
    name: string,
    id: string,
    token: string
}

export default function TripsCreateElement() {
    const { token } = useParams();
    const [name, setName] = useState("")
    const [newAttribute, setNewAttribute] = useState("")
    const [newDescription, setNewDescription] = useState("")
    const [newType, setNewType] = useState("")
    const [attributes, setAttributes] = useState<IAttribute[]>([])
    const [lists, setLists] = useState<IList[]>([])

    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    const tempLists = []
                    const data = await FetchInformationGetAll('text', token, 'trip_enlist') as StringOutput[]
                    for (let i = 0; i < data.length; i++) {
                        tempLists.push({
                            id: data[i].id,
                            name: data[i].output,
                            token: (await FetchInformationGetAll('text', token, data[i].id + 'token') as StringOutput[])[0]?.output
                        })
                        setLists(tempLists);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token])

    const createTrip = async () => {
        const newToken = await FetchToken() as TokenOutput
        await FetchPostOwner(token ?? '', 'token_' + newToken.token, 'main_token')
        const id = await FetchInformationPost(token ?? '', 'token_' + newToken.token, ['trip_enlist'], name, [Date.now()])
        await FetchShareOwner(token ?? '', 'token_' + newToken.token, 'token_' + newToken.token, newToken.id, false, true)
        await FetchPostOwner(token ?? '', 'rolegroup_trip_' + id + '_admin', 'main_token')
        const tokenData = await FetchInformationGetAll('text', token ?? '', 'key_token_' + newToken.token) as unknown as StringOutput[]
        const mainTokenData = await FetchInformationGetAll('text', token ?? '', 'key_main_token') as unknown as StringOutput[]
        await FetchShareOwner(token ?? '', 'rolegroup_trip_' + id + '_viewer', 'rolegroup_trip_' + id + '_admin', tokenData[0]?.output ?? '', false, true)
        await FetchInformationPost(token ?? '', 'rolegroup_trip_' + id + '_admin', [id + 'token'], newToken.token, [0])
        await FetchInformationPost(token ?? '', 'rolegroup_trip_' + id + '_admin', [id + 'creator'], mainTokenData[0].output, [0])
        for (let i = 0; i < attributes.length; i++)
        {
            const attributeID = await FetchInformationPost(token ?? '', 'rolegroup_trip_' + id + '_admin', [id + 'attribute'], attributes[i].name, [i])
            await FetchInformationPost(token ?? '', 'rolegroup_trip_' + id + '_admin', [attributeID + 'type'], attributes[i].type, [i])
            await FetchInformationPost(token ?? '', 'rolegroup_trip_' + id + '_admin', [attributeID + 'description'], attributes[i].description, [i])
        }
        console.log(FetchReloadToken(token ?? ''))
        console.log(FetchReloadToken(newToken.token))
    }

    const addAttribute = async () => {
        attributes.push({ name: newAttribute, type: newType, description: newDescription })
        setNewAttribute("")
        setNewDescription("")
        setNewType("")
    }

    const removeAttribute = async (attribute: string) => {
        setAttributes(attributes.filter(att => att.name != attribute))
    }

    const removeTrip = async (id: string) => {
        FetchInformationDelete(token ?? '', 'main_token', id)
    }

    return (
        <>
            <div>
                <div>
                    {lists.map((list) => (
                        <div>
                            <div>
                                <a href={'#/' + list.token + '/trip/enlist/' + list.id}>{list.name}</a>
                            </div>
                            <input type="button" onClick={() => { removeTrip(list.id) }} value='X' />
                        </div>
                    ))}
                </div>
                <input type="string"
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                    value={name} />
                <div>
                    {attributes.map((attribute) => (
                        <>
                            <div>
                                {attribute.name} {attribute.type}
                                <input type="button" onClick={() => (removeAttribute(attribute.name))} value="X" />
                            </div>
                        </>
                    ))}
                    <input type="string"
                        onChange={(e) => {
                            setNewAttribute(e.target.value)
                        }}
                        value={newAttribute} />
                    <input type="string"
                        onChange={(e) => {
                            setNewDescription(e.target.value)
                        }}
                        value={newDescription} />
                    <input type="string"
                        onChange={(e) => {
                            setNewType(e.target.value)
                        }}
                        value={newType} />
                    <input type="button" onClick={addAttribute} value="+" />
                </div>
                <input type="button" onClick={createTrip} value="Otwórz zapisy" />
            </div>
        
        </>
    );
}