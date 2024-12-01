import { useEffect, useState } from "react";
import { Alias, GetAdminRole, GetAliases, GetRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import { FetchOwnerGet } from "../../features/NewFetchOwnerGet";
import { useNavigate, useParams } from "react-router-dom";
import EditableDisplay from "../../generals/editable/EditableDisplay";
import { useAuth } from "../../generals/permission/AuthContext";

export default function ConfirmationPlanSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [role, setRole] = useState<Role | null>()
    const {role_id } = useParams()
    const [adminRole, setAdminRole] = useState<Role | null>()
    const [aliases, setAliases] = useState<Alias[]>([])
    const navigator = useNavigate()
    const { user } = useAuth()
    useEffect(() => {
        (async function () {
            if (user != null) {
                setAdminRole(await GetAdminRole({ type: 'confirmation', user: user }))
            }
        }());
    }, [getParams, user])

    useEffect(() => {
        (async function () {
            if (user != null) {
                const aliasList = (await GetAliases({ adminID: adminRole?.roleID ?? '' })).sort((a, b) => a.alias?.localeCompare(b.alias ?? '') ?? 0)
                if (role_id != '-' && adminRole != null) {
                    const alias = aliasList.find((item) => item.id == role_id)
                    if (alias)
                        setRole({ roleID: alias.id, ownerID: alias.ownerID, user: adminRole.user, type: 'alias', isRegistered: true, alias: alias.alias })
                }
                setAliases(aliasList)
            }
        }());
    }, [getParams, adminRole, role_id])
    useEffect(() => {
        (async function () {
            if (user != null) {
                setRole(await GetRole({ type: "confirmation", user: user }))
            }
        })();
    }, [getParams, user])

    const selectAlias = (alias: Alias) => {
        if (adminRole != null)
            navigator('/zielonki/confirmation/plan/' + alias.id)

    }
    return (
        <div className="confirmation-plan">
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
                                type: 'text',
                                multiple: false,
                                description: 'Alias',
                                dbkey: adminRole?.roleID,
                                showdescription: false,
                                display: 'single',
                            }} />
                        </h4>
                        <div><EditableDisplay editableProps={
                            {
                                name: 'point',
                                type: 'string',
                                multiple: true,
                                description: 'Wydarzenie',
                                dbkey: adminRole?.roleID,
                                showdescription: false,
                                display: 'expander',
                                isOrdered: true,
                                children: [
                                    {
                                        name: 'start',
                                        type: 'date',
                                        multiple: false,
                                        description: 'Początek',
                                        showdescription: true,
                                        display: 'single',
                                    },
                                    {
                                        name: 'end',
                                        type: 'date',
                                        multiple: false,
                                        description: 'Koniec',
                                        showdescription: true,
                                        display: 'single',
                                    },
                                    {
                                        name: role.roleID + 'note',
                                        type: 'string',
                                        multiple: true,
                                        description: 'Opis uczestnictwa',
                                        dbkey: role?.roleID,
                                        showdescription: true,
                                        display: 'single',
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