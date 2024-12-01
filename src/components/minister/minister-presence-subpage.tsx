import { useEffect, useState } from "react";
import { Alias, GetAdminRole, GetAliases, GetRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import { DateOutput, FetchInformationGet, FetchInformationGetAll, StringOutput } from "../../features/FetchInformationGet";
import MonthDateSelectionElement from "../../generals/month-date-selection-element";
import { AddDaysToDate } from "../helpers/DateComparer";
import MinisterPresenceMassComponent from "./component/minister-presence-mass-component";
import { FetchOwnerGet } from "../../features/FetchOwnerGet";
import { useAuth } from "../../generals/permission/AuthContext";

export interface AliasExt
{
    alias: Alias,
    weeks: number[]
}
export default function MinisterPresenceSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [date, setDate] = useState<Date>(new Date(Date.now() - Date.now() % 86400000))
    const [role, setRole] = useState<Role | null>()
    const [presence, setPresence] = useState(false)
    const [adminRole, setAdminRole] = useState<Role | null>()
    const [aliases, setAliases] = useState<AliasExt[]>([])
    const [masses, setMasses] = useState<DateOutput[]>([])
    const { user, token } = useAuth();

    useEffect(() => {
        (async function () {
                setAliases(await Promise.all((await GetAliases({ adminID: 'c2202738-d09e-4b3e-a7e2-56846e1dfb91' })).sort((a, b) => a.alias?.localeCompare(b.alias ?? '') ?? 0).map(async alias =>
                ({
                    alias: alias,
                    weeks: (await FetchInformationGetAll('string', token as string, alias.id + 'service') as StringOutput[]).map(serv => Number(serv.output)) as number[],
                } as AliasExt))))
            setRole(await GetRole({ type: "minister", user: user as User }))
            setAdminRole(await GetAdminRole({ type: "minister", user: user as User }))
                setPresence(await FetchOwnerGet(token as string, 'minister_presence'))
        }());
    }, [getParams])

    useEffect(() => {
        (async function () {
            setMasses(await FetchInformationGet('datetime', 'bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U', 'new_zielonki_mass', date?.getTime() ?? 1, AddDaysToDate(date, 1).getTime(), 'new_intention_viewer') as unknown as DateOutput[])
        }());
    }, [getParams, date])

    return (
        <>
            <MonthDateSelectionElement onSelectionChange={(date) => {if (date) setDate(date) }} />
            <div className="minister-presence">
                {masses.map(mass => (
                    <div>
                        <h4>
                            Msza Święta - {mass.output.getHours() + ':' + mass.output.getMinutes().toString().padStart(2, '0') + ' - ' + (mass.output.getDate() + '.').padStart(3, '0') + ((mass.output.getMonth() + 1) + '.').padStart(3, '0') + mass.output.getFullYear() + ' r.'}
                        </h4>
                        <MinisterPresenceMassComponent getParams={getParams} aliases={aliases} mass={mass} role={role ?? adminRole ?? null} presence={presence} />
                    </div>
                ))}
            </div>
        </>
    );
}