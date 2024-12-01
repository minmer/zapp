import { useEffect, useState } from "react";
import { User } from "../../structs/user";
import { GetAdminRole, GetAliases, Role } from "../../structs/role";
import { BooleanOutput, FetchInformationGetAll, StringOutput } from "../../features/FetchInformationGet";
import { useAuth } from "../../generals/permission/AuthContext";

export default function PrintConfirmationaimsSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [adminRole, setAdminRole] = useState<Role | null>()
    const { token, user } = useAuth();
    const [aliases, setAliases] = useState<
        {
            alias?: string,
            level?: string,
            aims?: string[],
            printed: boolean,
        }[]>([])
    useEffect(() => {
        (async function () {
            setAdminRole(await GetAdminRole({ type: 'confirmation', user: user }))
        }());
    }, [getParams])

    useEffect(() => {
        (async function () {
            const tempAliases = await Promise.all((await GetAliases({ adminID: adminRole?.roleID ?? '' })).map(async alias => {
                const level = ((await FetchInformationGetAll('string', token as string, alias.id + 'level')) as unknown as StringOutput[]).sort((a, b) => a.output.localeCompare(b.output ?? ''))
                return {
                    alias: alias.alias,
                    level: level[level.length - 1]?.output,
                    aims: ((await FetchInformationGetAll('string', token as string, level[level.length - 1]?.id + 'aims')) as unknown as StringOutput[]).map(aim => aim.output),
                    printed: ((await FetchInformationGetAll('bool', token as string, level[level.length - 1]?.id + 'printed')) as unknown as BooleanOutput[]).map(printed => printed.output)[0] == true,
                }
            }))
            setAliases(tempAliases.filter(alias => alias.aims.length > 0 && !alias.printed))
        }());
    }, [getParams, adminRole])

    useEffect(() => {
        console.log(aliases)
    }, [aliases])

    return (

        <div className='confirmationaims'>
            {aliases.map(alias => (
                <div className='print-page-quarter'>
                    <div className='header'>
                        {alias.alias}
                    </div>
                    <div className='aims'>
                        {alias.aims?.map(aim => (
                            <div className='aim'>
                                {aim}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}