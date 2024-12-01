import { useEffect, useState } from "react";
import { Alias, GetAdminRole, GetAliases, GetRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import { FetchOwnerGet } from "../../features/NewFetchOwnerGet";
import { FetchTokenGet } from "../../features/FetchTokenGet";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditableDisplay from "../../generals/editable/EditableDisplay";
import { useAuth } from "../../generals/permission/AuthContext";

export default function ConfirmationDetailSubpage() {
    const [role, setRole] = useState<Role | null>()
    const { token, user } = useAuth();
    const { role_id } = useParams()
    const [adminRole, setAdminRole] = useState<Role | null>()
    const [aliases, setAliases] = useState<Alias[]>([])
    const navigator = useNavigate()
    useEffect(() => {
        (async function () {
            setAdminRole(await GetAdminRole({ type: 'confirmation', user: user }))
        }());
    }, [])

    useEffect(() => {
        (async function () {
            const aliasList = (await GetAliases({ adminID: adminRole?.roleID ?? '' })).sort((a, b) => a.alias?.localeCompare(b.alias ?? '') ?? 0)
            if (role_id != '-' && adminRole != null) {
                const alias = aliasList.find((item) => item.id == role_id)
                if (alias)
                    setRole({ roleID: alias.id, ownerID: alias.ownerID, user: adminRole.user, type: 'alias', isRegistered: true, alias: alias.alias })
                else if (aliasList.length > 0)
                    setRole({ roleID: aliasList[0].id, ownerID: aliasList[0].ownerID, user: adminRole.user, type: 'alias', isRegistered: true, alias: aliasList[0].alias })

            }
            setAliases(aliasList)
        }());
    }, [adminRole, role_id])
    useEffect(() => {
        (async function () {
                    setRole(await GetRole({ type: "confirmation", user: user as User }))
        })();
    }, [])

    useEffect(() => {
        if (role != null)
            (async function () {
                        if ((await FetchOwnerGet(role.roleID) == null) || !role.isRegistered)
                            await FetchTokenGet(token)
            })();
    }, [role])
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
                        <h4><EditableDisplay editableProps={
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
                            <EditableDisplay editableProps={
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
                            <EditableDisplay editableProps={
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

                        <div><EditableDisplay editableProps={
                            {
                                name: role.roleID + 'level',
                                type: 'string',
                                multiple: true,
                                description: 'Rok formacyjny',
                                dbkey: adminRole?.roleID,
                                showdescription: true,
                                display: 'expander',
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