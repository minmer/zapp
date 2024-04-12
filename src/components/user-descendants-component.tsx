import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchGetAll, StringOutput } from "../features/FetchGet";
import { FetchPost } from "../features/FetchPost";
import { FetchPostOwner } from "../features/FetchPostOwner";
import { FetchShareOwner } from "../features/FetchShareOwner";
import { FetchToken, TokenOutput } from "../features/FetchToken";
import UserDescendantElement from "./user-descendant-component";

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
            try {

                if (token !== undefined) {
                    setViewerKey((await FetchGetAll('text', token, 'key_rolegroup_' + name + '_viewer', 'rolegroup_' + name + '_admin') as unknown as StringOutput[])[0]?.output)
                    setRoles((await FetchGetAll('text', token, 'role_' + name, 'rolegroup_' + name + '_admin') as unknown as StringOutput[]).map(res => res.output))
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token, name])

    const createGroup = async () => {
        await FetchPostOwner(token ?? '', 'rolegroup_' + name + '_admin', 'main_token')
        const tokenData = await FetchGetAll('text', token ?? '', 'key_main_token') as unknown as StringOutput[]
        await FetchShareOwner(token ?? '', 'rolegroup_' + name + '_viewer', 'rolegroup_' + name + '_admin', tokenData[0]?.output ?? '', false, true)
    }

    const createRole = async () => {
        const newToken = await FetchToken() as TokenOutput
        const tokenData = await FetchGetAll('text', token ?? '', 'key_main_token') as unknown as StringOutput[]
        await FetchPost("text", token ?? '', 'rolegroup_' + name + '_admin', ['role_' + name], newToken.id, [0])
        await FetchShareOwner(token ?? '', 'rolegroup_' + name + '_viewer', 'rolegroup_' + name + '_admin', newToken.id, false, true)
        await FetchPostOwner(token ?? '', 'adminrole_' + newToken.id, 'main_token')
        await FetchShareOwner(token ?? '', 'adminrole_' + newToken.id, 'adminrole_' + newToken.id, newToken.id, false, true)
        await FetchPostOwner(newToken.token ?? '', 'role_' + newToken.id, 'main_token')
        await FetchShareOwner(newToken.token ?? '', 'role_' + newToken.id, 'role_' + newToken.id, tokenData[0]?.output ?? '', false, true)
        await FetchPost("text", token ?? '', 'adminrole_' + newToken.id, ['role_token_' + newToken.id], newToken.token, [0])
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
        await FetchPost("text", token ?? '', 'adminrole_' + role, [link], role, [0])
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