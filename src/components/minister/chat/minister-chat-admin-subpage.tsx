import { useEffect, useState } from "react";
import { Alias, GetAdminRole, GetAliases, GetRole, Role } from "../../../structs/role";
import { User } from "../../../structs/user";
import ChatElement from "../../../generals/chat-element";
import { FetchInformationGetAll, StringOutput } from "../../../features/FetchInformationGet";
import { FetchOwnerGet } from "../../../features/FetchOwnerGet";
import { FetchOwnerPut } from "../../../features/FetchOwnerPut";
import { useAuth } from "../../../generals/permission/AuthContext";

export default function MinisterChatAdminSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string| User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [role, setRole] = useState<Role | null>()
    const { token, user } = useAuth();

    const [adminRole, setAdminRole] = useState<Role | null>()
    const [aliases, setAliases] = useState<Alias[]>([])
    const [alias, setAlias] = useState('')
    useEffect(() => {
        (async function () {
            setAdminRole(await GetAdminRole({ type: 'minister', user: user }))
            setRole(await GetRole({ type: "minister", user: user as User }))
        }());
    }, [])

    useEffect(() => {
        (async function () {
            setAliases((await GetAliases({ adminID: adminRole?.roleID ?? '' })).sort((a, b) => a.alias?.localeCompare(b.alias ?? '') ?? 0))
        }());
    }, [adminRole])
    const selectAlias = (alias: Alias) => {
        if (adminRole != null)
            setRole({ roleID: alias.id, ownerID: alias.ownerID, user: adminRole.user, type: 'alias', isRegistered: true, alias: alias.alias })
    }
    const addViewer = async () => {
        const groupID = await FetchOwnerGet(token, role?.roleID + 'group')
        await FetchOwnerPut(token, role?.roleID + 'groupchannel_viewer', role?.roleID + 'groupchannel', groupID, false, false, true)
    }
    useEffect(() => {
        if (!adminRole && role)
            (async function () {
                        setAlias((await FetchInformationGetAll('string', token as string, role ? (role.roleID + 'alias') : '') as StringOutput[])[0]?.id)
            }());
    }, [getParams, adminRole, role])

    return (
        <div className="minister-group-chat">
            {aliases && adminRole ? <div><select defaultValue={undefined} onChange={(e) => { selectAlias(aliases[e.currentTarget.selectedIndex]) }}>
                {aliases.map((alias) => (<option>
                    {alias.alias}            </option>))}
                <option value="none" selected disabled hidden>Wybierz</option>
            </select>
                <input type='button' value='Add viewer' onClick={addViewer} />
            </div> : null}
            <ChatElement getParams={getParams} name={'minister_' + role?.roleID} viewer={role?.roleID + 'common'} writer={adminRole ? (adminRole.roleID) : (role?.roleID)} alias={alias} />
        </div>
    );
}