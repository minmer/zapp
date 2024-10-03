import { useEffect, useState } from "react";
import { Alias, GetAdminRole, GetAliases, GetRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import { FetchOwnerGet } from "../../features/FetchOwnerGet";
import { FetchTokenGet } from "../../features/FetchTokenGet";
import EditableElement from "../../generals/editable-element";
import { useNavigate, useParams } from "react-router-dom";

export default function ConfirmationPlanSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [role, setRole] = useState<Role | null>()
    const {role_id } = useParams()
    const [adminRole, setAdminRole] = useState<Role | null>()
    const [aliases, setAliases] = useState<Alias[]>([])
    const navigator = useNavigate()
    useEffect(() => {
        (async function () {
            getParams({
                func: async (param: string | User) => {
                    const user = param as User
                    setAdminRole(await GetAdminRole({ getParams: getParams, type: 'confirmation', user: user }))
                }, type: 'user', show: false
            });
        }());
    }, [getParams])

    useEffect(() => {
        (async function () {
            const aliasList = (await GetAliases({ getParams: getParams, adminID: adminRole?.roleID ?? '' })).sort((a, b) => a.alias?.localeCompare(b.alias ?? '') ?? 0)
            if (role_id != '-' && adminRole != null) {
                const alias = aliasList.find((item) => item.id == role_id)
                if (alias)
                    setRole({ roleID: alias.id, ownerID: alias.ownerID, user: adminRole.user, type: 'alias', isRegistered: true, alias: alias.alias })
            }
            setAliases(aliasList)
        }());
    }, [getParams, adminRole, role_id])
    useEffect(() => {
        (async function () {
            await getParams({
                func: async (user: unknown) => {
                    setRole(await GetRole({ getParams: getParams, type: "confirmation", user: user as User }))
                }, type: 'user', show: true
            })
        })();
    }, [getParams])

    useEffect(() => {
        if (role != null)
            (async function () {
                await getParams({
                    func: async (param: string | User) => {
                        const token = param as string
                        if ((await FetchOwnerGet(token, role.roleID) == null) || !role.isRegistered)
                            await FetchTokenGet(token)
                    }, type: 'token', show: true
                })
            })();
    }, [getParams, role])
    const selectAlias = (alias: Alias) => {
        if (adminRole != null)
            navigator('/zielonki/confirmation/plan/' + alias.id)

    }
    return (
        <div className="confirmation-plan">
            {aliases && adminRole ? <select defaultValue={undefined} onChange={(e) => { selectAlias(aliases[e.currentTarget.selectedIndex]) }}>
                {aliases.map((alias) => (<option>
                    {alias.alias}            </option>))}
            </select> : null}
            {
                role?.isRegistered ?
                    <>
                        <h4><EditableElement getParams={getParams} editable={
                            {
                                name: role.roleID + 'alias',
                                type: 'text',
                                multiple: false,
                                description: 'Alias',
                                dbkey: adminRole?.roleID,
                                showdescription: false,
                                showchildren: false,
                            }} />
                        </h4>
                        <div><EditableElement getParams={getParams} editable={
                            {
                                name: 'point',
                                type: 'string',
                                multiple: true,
                                description: 'Wydarzenie',
                                dbkey: adminRole?.roleID,
                                showdescription: false,
                                showchildren: true,
                                isOrdered: true,
                                children: [
                                    {
                                        name: 'start',
                                        type: 'date',
                                        multiple: false,
                                        description: 'Początek',
                                        showdescription: true,
                                        showchildren: false,
                                    },
                                    {
                                        name: 'end',
                                        type: 'date',
                                        multiple: false,
                                        description: 'Koniec',
                                        showdescription: true,
                                        showchildren: false,
                                    },
                                    {
                                        name: role.roleID + 'note',
                                        type: 'string',
                                        multiple: true,
                                        description: 'Opis uczestnictwa',
                                        dbkey: role?.roleID,
                                        showdescription: true,
                                        showchildren: false,
                                        break: '\n',
                                    },
                                ],

                            }} />
                        </div>
                    </> :
                    <>
                        <h3>Zgłoszenie czeka na zatwierdzenie</h3>
                    </>
            }
        </div>
    );
}