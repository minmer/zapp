import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchInformationGetAll, NumberOutput, StringOutput } from "../features/FetchInformationGet";
import { FetchToken, TokenOutput } from "../features/FetchToken";
import { FetchInformationPost } from "../features/FetchInformationPost";
import { FetchShareOwner } from "../features/FetchShareOwner";
import { FetchOwnerPost } from "../features/FetchOwnerPost";
import { FetchInformationDelete } from "../features/FetchInformationDelete";
import { FetchReloadToken } from "../features/FetchReloadToken";
import LoadingComponent from "../generals/loading-component";

export interface IList {
    name: string,
    role: string,
    token: string,
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
    const [newToken, setNewToken] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);




    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    setIsLoading(true);
                    setIsAdmin(((await FetchInformationGetAll('string', token, 'admin') as []).length == 0 ? false : true));
                    setName((await FetchInformationGetAll('string', token, 'trip_enlist') as StringOutput[]).filter(p => p.id == list)[0].output);
                    setListToken((await FetchInformationGetAll('string', token, list + 'token') as StringOutput[])[0]?.output)
                    const tempAttributes = [];
                    const attributesData = await FetchInformationGetAll('string', token, list + 'attribute') as StringOutput[];
                    for (let i = 0; i < attributesData.length; i++) {
                        tempAttributes.push({
                            name: attributesData[i].output,
                            type: (await FetchInformationGetAll('string', token, attributesData[i].id + 'type') as StringOutput[])[0]?.output,
                            description: (await FetchInformationGetAll('string', token, attributesData[i].id + 'description') as StringOutput[])[0]?.output
                        });
                    }
                    setAttributes(tempAttributes);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token, list]);

    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    const rolesData = (await FetchInformationGetAll('string', token, 'role_' + list) as StringOutput[]);
                    const tempRoles = [];
                    for (let i = 0; i < rolesData.length; i++) {
                        let role = ''
                        for (let j = 0; j < attributes.length; j++) {
                            if (attributes[j].type == "text") {
                                role += (await FetchInformationGetAll('string', token, rolesData[i].output + attributes[j].name) as StringOutput[])[0]?.output + ', ';
                            }
                            else if (attributes[j].type == "date") {
                                role += new Date((await FetchInformationGetAll('long', token, rolesData[i].output + attributes[j].name) as NumberOutput[])[0]?.output).toDateString() + ', ';
                            }
                        }
                        tempRoles.push({ name: role, id: rolesData[i].id, role: rolesData[i].output, token: (await FetchInformationGetAll('string', token, 'role_trip_token_' + rolesData[i].output) as StringOutput[])[0]?.output });
                    }
                    setRoles(tempRoles);
                    setIsLoading(false);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token, list, attributes]);

    const enlist = async () => {
        setIsLoading(true);
        const newToken = await FetchToken() as TokenOutput;
        const tokenData = await FetchInformationGetAll('string', token ?? '', list + 'creator') as unknown as StringOutput[];
        console.log(listToken + tokenData[0].output)
        await FetchInformationPost(token ?? '', 'token_' + listToken, ['role_' + list], newToken.id, [roles.length]);
        console.log('data')
        await FetchShareOwner(token ?? '', 'token_' + listToken, 'token_' + listToken, newToken.id, false, true);
        await FetchShareOwner(token ?? '', 'rolegroup_trip_' + list + '_viewer', 'rolegroup_trip_' + list + '_viewer', newToken.id, false, true);
        await FetchOwnerPost(newToken.token ?? '', 'role_trip_' + newToken.id, 'main_token');
        await FetchShareOwner(newToken.token ?? '', 'role_trip_' + newToken.id, 'role_trip_' + newToken.id, tokenData[0]?.output ?? '', false, true);
        console.log(FetchReloadToken(token ?? ''))
        console.log(FetchReloadToken(newToken.token))
        await FetchInformationPost(newToken.token ?? '', 'role_trip_' + newToken.id, ['role_trip_token_' + newToken.id], newToken.token, [0]);
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].type == "text") {
                await FetchInformationPost(newToken.token ?? '', 'role_trip_' + newToken.id, [newToken.id + attributes[i].name], attributes[i].text ?? '', [0]);
            }
            else if (attributes[i].type == "date") {
                await FetchInformationPost(newToken.token ?? '', 'role_trip_' + newToken.id, [newToken.id + attributes[i].name], attributes[i].date ?? 0, [0]);
            }
        }
        setIsLoading(false);
        setMessage("Zapisy udane\r\nMożna sprawdzić dane za pomocą dedykowanego linku:");
        setNewToken(newToken.token);
    };

    const removeRole = async (id: string) => {
        FetchInformationDelete(token ?? '', 'token_' + listToken, id);
    };

    return (
        <>
            <h3>{name}</h3>
            <div className="enlist-container">
            <div>
            <ol>
                {roles.map((role) => (
                    <li>
                        {role.name} - <a href={isAdmin ? '#/' + role.token + '/trip/enlist/' + list : ''}>{role.token}</a>
                        <input style={{
                            display: isAdmin ? 'block' : 'none',
                        }} type="button" onClick={() => { removeRole(role.id); }} value='X' />
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
                        <a href={'#/' + newToken + '/trip/enlist/' + list}>{newToken}</a>
                </h4>
                </div>
            <div className="loadingcontainer" style=
                {{
                    display: isLoading ? 'block' : 'none',
                }}>
                <LoadingComponent />
                </div>
            </div>
        </>
    );
}
