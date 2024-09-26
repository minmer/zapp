import { useEffect, useState } from "react";
import { Alias, GetAliases, GetRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import { FetchOwnerGet } from "../../features/FetchOwnerGet";
import { FetchTokenGet } from "../../features/FetchTokenGet";
import { DateOutput, FetchInformationGet } from "../../features/FetchInformationGet";
import EditableElement from "../../generals/editable-element";

export default function MinisterPresenceSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [role, setRole] = useState<Role | null>()

    const [aliases, setAliases] = useState<Alias[]>([])
    const [masses, setMasses] = useState<DateOutput[]>([])

    useEffect(() => {
        (async function () {
            setAliases((await GetAliases({ getParams: getParams, adminID: 'c2202738-d09e-4b3e-a7e2-56846e1dfb91' })).sort((a, b) => a.alias?.localeCompare(b.alias ?? '') ?? 0))
            await getParams({
                func: async (user: unknown) => {
                    setRole(await GetRole({ getParams: getParams, type: "minister", user: user as User }))
                }, type: 'user', show: false
            })
            setMasses(await FetchInformationGet('datetime', 'bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U', 'new_zielonki_mass', Date.now()-5400000, Date.now() + 5400000, 'new_intention_viewer') as unknown as DateOutput[])
        }());
    }, [getParams])
    useEffect(() => {
        if (role != null)
            (async function () {
                await getParams({
                    func: async (param: unknown) => {
                        const token = param as string
                        if ((await FetchOwnerGet(token, role.roleID) == null) || !role.isRegistered)
                            await FetchTokenGet(token)
                    }, type: 'token', show: true
                })
            })();
    }, [getParams, role])

    return (
        <div className="minister-presence">
            {masses.map(mass => (
                <div>
                    <h4>
                        Msza Święta - {mass.output.getHours() + ':' + mass.output.getMinutes().toString().padStart(2, '0') + ' - ' + (mass.output.getDate() + '.').padStart(3, '0') + ((mass.output.getMonth() + 1) + '.').padStart(3, '0') + mass.output.getFullYear() + ' r.'}
                    </h4>
                    <div>
                        {aliases.map(alias => (
                            <EditableElement getParams={getParams} editable={
                                {
                                    name: mass.id + alias.id,
                                    type: 'checkbox',
                                    multiple: false,
                                    description: alias.alias,
                                    dbkey: 'minister_presence',
                                    showdescription: true,
                                    showchildren: false,
                                }} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}