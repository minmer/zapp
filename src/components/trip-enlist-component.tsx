import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchGetAll, NumberOutput, StringOutput } from "../features/FetchGet";
import { FetchToken, TokenOutput } from "../features/FetchToken";
import { FetchPost } from "../features/FetchPost";
import { FetchShareOwner } from "../features/FetchShareOwner";
import { FetchPostOwner } from "../features/FetchPostOwner";
import { FetchDelete } from "../features/FetchDelete";
import { FetchReloadToken } from "../features/FetchReloadToken";

export interface IList {
    name: string,
    role: string,
    id: string
}
export interface IAttribute {
    name: string,
    description: string,
    type: string,
    text?: string,
    date?: number
}
export default function TripEnlistElement() {
    const { token, list } = useParams();
    const [name, setName] = useState("");
    const [listToken, setListToken] = useState("");
    const [attributes, setAttributes] = useState<IAttribute[]>([]);
    const [roles, setRoles] = useState<IList[]>([]);
    const [message, setMessage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    setIsAdmin(((await FetchGetAll('text', token, 'admin') as []).length == 0 ? false : true));
                    setName((await FetchGetAll('text', token, 'trip_enlist') as StringOutput[]).filter(p => p.id == list)[0].output);
                    setListToken((await FetchGetAll('text', token, list + 'token') as StringOutput[])[0]?.output)
                    const tempAttributes = [];
                    const attributesData = await FetchGetAll('text', token, list + 'attribute') as StringOutput[];
                    for (let i = 0; i < attributesData.length; i++) {
                        tempAttributes.push({
                            name: attributesData[i].output,
                            type: (await FetchGetAll('text', token, attributesData[i].id + 'type') as StringOutput[])[0]?.output,
                            description: (await FetchGetAll('text', token, attributesData[i].id + 'description') as StringOutput[])[0]?.output
                        });
                    }
                    setAttributes(tempAttributes);
                    const rolesData = (await FetchGetAll('text', token, 'role_' + list) as StringOutput[]);
                    const tempRoles = [];
                    for (let i = 0; i < rolesData.length; i++) {
                        let role = ''
                        for (let j = 0; j < attributes.length; j++) {
                            if (attributes[j].type == "text") {
                                role += (await FetchGetAll('text', token, rolesData[i].output + attributes[j].name) as StringOutput[])[0]?.output + ', ';
                            }
                            else if (attributes[j].type == "date") {
                                role += new Date((await FetchGetAll('integer', token, rolesData[i].output + attributes[j].name) as NumberOutput[])[0]?.output).toDateString() + ', ';
                            }
                        }
                        tempRoles.push({ name: role, id: rolesData[i].id, role: rolesData[i].output });
                    }
                    setRoles(tempRoles);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token, list, attributes]);

    const enlist = async () => {
        const newToken = await FetchToken() as TokenOutput;
        const tokenData = await FetchGetAll('text', token ?? '', list + 'creator') as unknown as StringOutput[];
        console.log(listToken + tokenData)
        await FetchPost("text", token ?? '', 'token_' + listToken, ['role_' + list], newToken.id, [roles.length]);
        console.log('data')
        await FetchShareOwner(token ?? '', 'token_' + listToken, 'token_' + listToken, newToken.id, false, true);
        await FetchShareOwner(token ?? '', 'rolegroup_trip_' + list + '_viewer', 'rolegroup_trip_' + list + '_viewer', newToken.id, false, true);
        await FetchPostOwner(newToken.token ?? '', 'role_trip_' + newToken.id, 'main_token');
        await FetchShareOwner(newToken.token ?? '', 'role_trip_' + newToken.id, 'role_trip_' + newToken.id, tokenData[0]?.output ?? '', false, true);
        console.log(FetchReloadToken(token ?? ''))
        console.log(FetchReloadToken(newToken.token))
        await FetchPost("text", newToken.token ?? '', 'role_trip_' + newToken.id, ['role_trip_token_' + newToken.id], newToken.token, [0]);
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].type == "text") {
                await FetchPost("text", newToken.token ?? '', 'role_trip_' + newToken.id, [newToken.id + attributes[i].name], attributes[i].text ?? '', [0]);
            }
            else if (attributes[i].type == "date") {
                await FetchPost("integer", newToken.token ?? '', 'role_trip_' + newToken.id, [newToken.id + attributes[i].name], attributes[i].date ?? 0, [0]);
            }
        }
        setMessage("Zapisy udane " + newToken.token);
    };

    const removeRole = async (role: string, id: string) => {
        FetchDelete(token ?? '', 'role_trip_' + role, id);
    };

    return (
        <>
            <h3>{name}</h3>
            <div>
            <ol>
                {roles.map((role) => (
                    <li>
                        {role.name} - | -
                        <input style={{
                            display: isAdmin ? 'block' : 'none',
                        }} type="button" onClick={() => { removeRole(role.role, role.id); }} value='X' />
                    </li>
                ))}
                </ol>
            </div>
            <div>
                {attributes.map((attribute) => (
                    <>
                        <div>
                            {attribute.description}
                            <input style={{
                                display: attribute.type == 'text' ? 'block' : 'none',
                            }} type="text"
                                onChange={(e) => {
                                    attribute.text = e.target.value;
                                }} />
                            <input style={{
                                display: attribute.type == 'date' ? 'block' : 'none',
                            }} type="date"
                                onChange={(e) => {
                                    attribute.date = e.target.valueAsDate?.getTime();
                                }} />
                        </div>
                    </>
                ))}
                <input type="button" onClick={enlist} value="Zapisz" />
                <h4>
                    {message}
                </h4>
            </div>
        </>
    );
}
