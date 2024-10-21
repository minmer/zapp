import { useEffect, useState } from "react";
import { Alias, GetAdminRole, GetAliases, GetRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import { FetchOwnerGet } from "../../features/FetchOwnerGet";
import { FetchTokenGet } from "../../features/FetchTokenGet";
import EditableElement from "../../generals/editable-element";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ConfirmationDetailSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [role, setRole] = useState<Role | null>()
    const { role_id } = useParams()
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
                else if (aliasList.length > 0)
                    setRole({ roleID: aliasList[0].id, ownerID: aliasList[0].ownerID, user: adminRole.user, type: 'alias', isRegistered: true, alias: aliasList[0].alias })

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
            navigator('/zielonki/confirmation/detail/' + alias.id)
    }
    return (
        <div className="confirmation-detail">
            {aliases && adminRole ? <select defaultValue={undefined} onChange={(e) => { selectAlias(aliases[e.currentTarget.selectedIndex]) }}>
                {aliases.map((alias) => (<option>
                    {alias.alias}            </option>))}
                <option value="none" selected disabled hidden>Wybierz</option>
            </select> : null}
            {
                role?.isRegistered ?
                    <>
                        <h4><EditableElement getParams={getParams} editable={
                            {
                                name: role.roleID + 'alias',
                                type: 'string',
                                multiple: false,
                                description: 'Alias',
                                dbkey: adminRole?.roleID,
                                showdescription: false,
                                display: 'single',
                            }} />
                        </h4>
                        <div>
                            <EditableElement getParams={getParams} editable={
                                {
                                    name: role?.user.user + 'address',
                                    type: 'text',
                                    multiple: false,
                                    description: 'Adres',
                                    dbkey: role?.user.id + 'address',
                                    showdescription: false,
                                    display: 'single',
                                }} />
                        </div>
                        <div>
                            <EditableElement getParams={getParams} editable={
                                {
                                    name: role?.user.user + 'telefon',
                                    type: 'tel',
                                    multiple: true,
                                    dbkey: role?.user.id + 'telefon',
                                    description: 'Telefon',
                                    showdescription: false,
                                    display: 'single',
                                }} />
                        </div>

                        <div><EditableElement getParams={getParams} editable={
                            {
                                name: role.roleID + 'level',
                                type: 'string',
                                multiple: true,
                                description: 'Rok formacyjny',
                                dbkey: adminRole?.roleID,
                                showdescription: true,
                                display: 'dropdown',
                                isOrdered: true,
                                children: [
                                    {
                                        name: 'aims',
                                        type: 'string',
                                        multiple: true,
                                        description: 'Cele na rok formacyjny',
                                        dbkey: role?.roleID,
                                        showdescription: true,
                                        display: 'single',
                                        break: '\n',
                                    },
                                    {
                                        name: 'printed',
                                        type: 'checkbox',
                                        multiple: false,
                                        description: 'Wydrukowane',
                                        dbkey: adminRole?.roleID,
                                        showdescription: true,
                                        display: 'single',
                                        break: '\n',
                                    },
                                    {
                                        name: 'appointment0',
                                        type: 'datetime',
                                        multiple: false,
                                        description: 'I spotkanie',
                                        display: 'single',
                                    },
                                    {
                                        name: 'appointment_description0',
                                        type: 'string',
                                        multiple: true,
                                        description: 'Ustalenia z I spotkania',
                                        display: 'single',
                                    },
                                    {
                                        name: 'appointment1',
                                        type: 'datetime',
                                        multiple: false,
                                        description: 'II spotkanie',
                                        display: 'single',
                                    },
                                    {
                                        name: 'appointment_description1',
                                        type: 'string',
                                        multiple: true,
                                        description: 'Ustalenia z II spotkania',
                                        display: 'single',
                                    },
                                    {
                                        name: 'note',
                                        type: 'string',
                                        multiple: true,
                                        description: 'Uwagi',
                                        display: 'single',
                                    },
                                ],
                            }} />
                        </div>
                        <Link to='https://docs.google.com/forms/d/e/1FAIpQLSfAnWk9td_pqJEZvllcyonKnzlsYXmP4Ns93_DPfgdGJHmXSg/viewform'>Formularz do zapisów na spotkanie</Link>
                    </> :
                    <>
                        <h3>Zgłoszenie czeka na zatwierdzenie</h3>
                    </>
            }
        </div>
    );
}