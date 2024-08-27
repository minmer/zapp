import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import { FetchInformationPost } from "../features/FetchInformationPost";
import { FetchOwnerPost } from "../features/FetchOwnerPost";
import { FetchShareOwner } from "../features/FetchShareOwner";
import { FetchToken, TokenOutput } from "../features/FetchToken";
import UserDescendantElement from "./user-descendant-component";
import { FetchInformationDelete } from "../features/FetchInformationDelete";

interface IAttribute {
    name: string,
    isArray: boolean
}

export default function UserDescendantsElement() {
    const { token } = useParams();
    const [name, setName] = useState("")
    const [viewerKey, setViewerKey] = useState<undefined | string>(undefined)
    const [roles, setRoles] = useState<string[]>([])
    const [newAttribute, setNewAttribute] = useState("")
    const [isArray, setIsArray] = useState(false)
    const [link, setLink] = useState("")
    const [attributes, setAttributes] = useState<IAttribute[]>([])
    useEffect(() => {
        (async function () {
            if (token !== undefined) {
                for (let i = 0; i < 5; i++)
            try {
                    setViewerKey((await FetchInformationGetAll('text', token, 'key_rolegroup_' + name + '_admin') as unknown as StringOutput[])[0]?.output)
                    setRoles((await FetchInformationGetAll('text', token, 'role_' + name) as unknown as StringOutput[]).map(res => res.output))
                break;
                } catch (e) {
                    console.error(e)
                }
            }
        })();
    }, [token, name])

    const createGroup = async () => {
        await FetchOwnerPost(token ?? '', 'rolegroup_' + name + '_admin', 'main_token')
        const tokenData = await FetchInformationGetAll('text', token ?? '', 'key_main_token') as unknown as StringOutput[]
        await FetchShareOwner(token ?? '', 'rolegroup_' + name + '_viewer', 'rolegroup_' + name + '_admin', tokenData[0]?.output ?? '', false, true)
        setViewerKey((await FetchInformationGetAll('text', token ?? '', 'key_rolegroup_' + name + '_admin') as unknown as StringOutput[])[0]?.output)
    }

    const createRole = async () => {
        const newToken = await FetchToken() as TokenOutput
        const tokenData = await FetchInformationGetAll('text', token ?? '', 'key_main_token') as unknown as StringOutput[]
        await FetchInformationPost(token ?? '', 'rolegroup_' + name + '_admin', ['role_' + name], newToken.id, [0])
        await FetchShareOwner(token ?? '', 'rolegroup_' + name + '_viewer', 'rolegroup_' + name + '_admin', newToken.id, false, true)
        await FetchOwnerPost(token ?? '', 'adminrole_' + newToken.id, 'main_token')
        await FetchShareOwner(token ?? '', 'adminrole_' + newToken.id, 'adminrole_' + newToken.id, newToken.id, false, true)
        await FetchOwnerPost(newToken.token ?? '', 'role_' + newToken.id, 'main_token')
        await FetchShareOwner(newToken.token ?? '', 'role_' + newToken.id, 'role_' + newToken.id, tokenData[0]?.output ?? '', false, true)
        await FetchInformationPost(token ?? '', 'adminrole_' + newToken.id, ['role_token_' + newToken.id], newToken.token, [0])
        setNewAttribute("")
    }

    const addAttribute = async () => {
        console.log(isArray)
        attributes.push({ name: newAttribute, isArray: isArray })
        setNewAttribute("")
    }

    const removeAttribute = async (attribute: string) => {
        setAttributes(attributes.filter(att => att.name != attribute))
    }
    const addLink = async (role : string) => {
        await FetchInformationPost(token ?? '', 'adminrole_' + role, [link], role, [0])
    }

    const removeRole = async (role: string) => {
        FetchInformationDelete(token ?? '', 'main_token',(await FetchInformationGetAll('text', token ?? '', 'role_' + name) as unknown as StringOutput[]).filter(p => p.output == role)[0].id)
    }

    return (

        <>
            <div>
                <input type="string"
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                    value={name} />
                <div>
                    {attributes.map((attribute) => (
                        <>
                            <div>
                                {attribute.name} {attribute.isArray.toString()}
                                <input type="button" onClick={() => (removeAttribute(attribute.name))} value="X" />
                            </div>
                        </>
                    ))}
                    <input type="string"
                        onChange={(e) => {
                            setNewAttribute(e.target.value)
                        }}
                        value={newAttribute} />
                    <input type="checkbox"
                        onChange={(e) => {
                            setIsArray(e.target.checked)
                        }}
                        checked={isArray} />
                    <input type="button" onClick={addAttribute} value="+" />
                </div>
                <div>
                    <input
                        type="text"
                        onChange={(e) => {
                            setLink(e.target.value)
                        }}
                        value={link} />
                </div>
                {roles.map((role) => (
                    <>
                        <UserDescendantElement role={role} attributes={attributes} />
                        <input style=
                            {{
                                display: link ? 'block' : 'none',
                            }}
                            type="button" onClick={() => { addLink(role) }} value={link} />
                        <input type="button" onClick={() => { removeRole(role) }} value='X' />
                    </>
                ))}
                <div style=
                    {{
                    display: (name.length > 0) && (viewerKey == undefined) ? 'block' : 'none',
                    }}>
                    <input type="button" onClick={createGroup} value="Create group" />
                </div>
                <div style=
                    {{
                    display: viewerKey ? 'block' : 'none',
                    }}>
                    <input type="button" onClick={createRole} value="Create new role" />
                </div>
            </div>
        </>
    );
}