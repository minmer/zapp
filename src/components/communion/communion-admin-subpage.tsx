import { useEffect, useState } from "react";
import { GetAdminRole, GetMembers, RegisterRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import { FetchTokenGet } from "../../features/FetchTokenGet";
import EditableElement from "../../generals/editable-element";

export default function CommunionAdminSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {

    const [role, setRole] = useState<Role | null>()
    const [ministers, setMinisters] = useState<Role[]>()
    useEffect(() => {
        (async function () {
            getParams({
                func: async (param: unknown) => {
                    const user = param as User
                    setRole(await GetAdminRole({ getParams: getParams, type: 'communion', user: user }))
                    setMinisters(await GetMembers({ getParams: getParams, type: 'communion'}))
                }, type: 'user', show: false
            });
        }());
    }, [getParams])

    const reload = async () => {
        getParams({
            func: async (param: unknown) => {
                    FetchTokenGet(param as string)
            }, type: 'token', show: false
        });
    }

    const acceptMinister = async (minister: Role) =>
    {
        if (role != null) {
            await RegisterRole({ getParams: getParams, admin: role, role: minister })
            minister.isRegistered = true;
        }
    }

    return (
        <>
            {role?.roleID + ' -|- ' + role?.ownerID + ' -|- ' + role?.type + ' -|- ' + role?.user}
            <input type="button" value="Reload" onClick={reload} />
            {ministers?.map(minister => (
                <div key={minister.roleID}>
                    <EditableElement getParams={getParams} editable={
                        {
                            name: minister.user.user + 'name',
                            type: 'text',
                            multiple: false,
                            description: 'Imię',
                            dbkey: minister.user.id,
                            showdescription: false,
                            showchildren: false,
                        }} />
                        <span> </span>
                    <EditableElement getParams={getParams} editable={
                        {
                            name: minister.user.user + 'surname',
                            type: 'text',
                            multiple: false,
                            dbkey: minister.user.id,
                            description: 'Nazwisko',
                            showdescription: false,
                            showchildren: false,
                        }} />
                    {minister.isRegistered ? null : < input type="button" value="Accept" onClick={() => { acceptMinister(minister) }} />}
                </div>
            ))}
        </>
    );
}