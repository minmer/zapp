import { useEffect, useState } from "react";
import { Alias, ConnectAliasRole, GetAdminRole, GetAliases, GetMembers, RegisterAliasRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import { FetchTokenGet } from "../../features/FetchTokenGet";
import EditableElement from "../../generals/editable-element";
import { FetchInformationDelete } from "../../features/FetchInformationDelete";

export default function MinisterAdminSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {

    const [role, setRole] = useState<Role | null>()
    const [selectedRole, setSelectedRole] = useState<Role | null>()
    const [members, setMembers] = useState<Role[]>()
    const [aliases, setAliases] = useState<Alias[]>([])
    useEffect(() => {
        (async function () {
            getParams({
                func: async (param: string | User) => {
                    const user = param as User
                    setRole(await GetAdminRole({ type: 'minister', user: user }))
                    setMembers(await GetMembers({ type: 'minister' }))
                }, type: 'user', show: false
            });
        }());
    }, [getParams])
    useEffect(() => {
        (async function () {
            setAliases((await GetAliases({ adminID: role?.roleID ?? '' })).sort((a, b) => a.alias?.localeCompare(b.alias ?? '') ?? 0))
        }());
    }, [getParams, role])

    const reload = async () => {
        getParams({
            func: async (param: string | User) => {
                console.log(await FetchTokenGet(param as string))
                setMembers(await GetMembers({ type: 'minister' }))
            }, type: 'token', show: false
        });
    }

    const addAlias = async () => {
        if (role != null) {
            const alias = await RegisterAliasRole({ admin: role })
            if (alias != null)
                setAliases([...aliases, alias])
        }
    }

    const acceptMember = async (member: Role) => {
        setSelectedRole(member)
    }

    const connectAlias = async (alias: Alias) => {
        if (selectedRole != null)
            ConnectAliasRole({ role: selectedRole, alias: alias })
    }

    const deleteAlias = async (alias: Alias) => {
        if (role != null)
            getParams({
                func: async (token: string | User) => {
                    FetchInformationDelete(token as string, role.roleID, alias.id)
                }, type: 'token', show: false
            });
    }

    return (
        <>
            {role?.roleID + ' -|- ' + role?.ownerID + ' -|- ' + role?.type + ' -|- ' + role?.user}
            <input type="button" value="Reload" onClick={reload} />
            {members?.map(member => (
                <div style={{
                    backgroundColor: member.roleID == selectedRole?.roleID ? 'orange' : undefined,
                    opacity: member.alias != null ? '.2' : '1',
                }}
                    key={member.roleID}>
                    <EditableElement getParams={getParams} editable={
                        {
                            name: member.user.user + 'name',
                            type: 'text',
                            multiple: false,
                            description: 'Imię',
                            dbkey: member.user.id,
                            showdescription: false,
                            display: 'single',
                        }} />
                    <span> </span>
                    <EditableElement getParams={getParams} editable={
                        {
                            name: member.user.user + 'surname',
                            type: 'text',
                            multiple: false,
                            dbkey: member.user.id,
                            description: 'Nazwisko',
                            showdescription: false,
                            display: 'single',
                        }} />
                    {member.isRegistered ? null : < input type="button" value="Wybierz" onClick={() => { acceptMember(member) }} />}
                </div>
            ))}
            {aliases?.map(alias => (
                <div key={alias.id}>
                    <EditableElement getParams={getParams} editable={
                        {
                            name: alias.id + 'alias',
                            type: 'text',
                            multiple: false,
                            description: 'Alias',
                            dbkey: alias.id + 'groupchannel',
                            showdescription: false,
                            display: 'single',
                        }} />
                    {selectedRole ? <input type="button" value="Connect to alias" onClick={() => { connectAlias(alias) }} /> : null}
                    <input type="button" value="Delete" onClick={() => { deleteAlias(alias) }} />
                </div>
            ))}
            <input type="button" value="Add alias" onClick={addAlias} />
        </>
    );
}