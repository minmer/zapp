import { useEffect, useState } from "react";
import { GetRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import EditableElement from "../../generals/editable-element";
import { FetchOwnerGet } from "../../features/FetchOwnerGet";
import { FetchTokenGet } from "../../features/FetchTokenGet";

export default function CommunionDetailSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [role, setRole] = useState<Role | null>()
    useEffect(() => {
        (async function () {
            await getParams({
                func: async (user: unknown) => {
                    setRole(await GetRole({ getParams: getParams, type: "communion", user: user as User }))
                }, type: 'user', show: true
            })
        })();
    }, [getParams])

    useEffect(() => {
        if (role != null)
            (async function () {
                await getParams({
                    func: async (param: unknown) => {
                        const token = param as string
                        if (await FetchOwnerGet(token, role.roleID) == null) {
                            await FetchTokenGet(token)
                            await FetchOwnerGet(token, role.roleID)
                        }
                    }, type: 'token', show: true
                })
            })();
    }, [getParams, role])

    return (
        <>
            {
                role?.isRegistered ? 
                    <>
                        <EditableElement getParams={getParams} editable={
                            {
                                name: role?.roleID + 'alias',
                                type: 'text',
                                multiple: false,
                                description: 'Alias',
                                dbkey: role?.roleID,
                                showdescription: false,
                                showchildren: false,
                            }} />
                    </> :
                    <>
                    <h3>Zgłoszenie czeka na zatwierdzenie</h3>
                </> 
            }
        </>
    );
}