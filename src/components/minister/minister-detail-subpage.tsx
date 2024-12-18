import { useEffect, useState } from "react";
import { Alias, GetAdminRole, GetAliases, GetRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import { FetchOwnerGet } from "../../features/FetchOwnerGet";
import { FetchTokenGet } from "../../features/FetchTokenGet";
import EditableElement from "../../generals/editable-element";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../generals/permission/AuthContext";

export default function MinisterDetailSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [role, setRole] = useState<Role | null>()
    const { user } = useAuth();

    const { role_id } = useParams()
    const [adminRole, setAdminRole] = useState<Role | null>()
    const [aliases, setAliases] = useState<Alias[]>([])
    const navigator = useNavigate()
    useEffect(() => {
        (async function () {
            setAdminRole(await GetAdminRole({ type: 'minister', user: user }))
        }());
    }, [getParams])

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
    }, [getParams, adminRole, role_id])
    useEffect(() => {
        (async function () {
                    setRole(await GetRole({ type: "minister", user: user as User }))
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
            navigator('/zielonki/minister/detail/' + alias.id)
    }
    return (
        <div className="minister-detail">
            {adminRole ? <select defaultValue={undefined} onChange={(e) => { selectAlias(aliases[e.currentTarget.selectedIndex]) }}>
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
                                type: 'text',
                                multiple: false,
                                description: 'Alias',
                                dbkey: adminRole?.roleID,
                                showdescription: false,
                                display: 'single',
                            }} />
                        </h4>
                        <div><EditableElement getParams={getParams} editable={
                            {
                                name: role.roleID + 'function',
                                type: 'radio',
                                multiple: true,
                                description: 'Funkcja',
                                dbkey: adminRole?.roleID,
                                showdescription: true,
                                display: 'single',
                                options: [
                                    { label: 'Zainteresowany', value: '0' },
                                    { label: 'Kandydat', value: '1' },
                                    { label: 'Choralista', value: '2' },
                                    { label: 'Ministrant Ołtarza', value: '3' },
                                    { label: 'Ministrant Światła', value: '4' },
                                    { label: 'Ministrant Księgi', value: '5' },
                                    { label: 'Ministrant Słowa Bożego', value: '6' },
                                    { label: 'Ceremoniarz', value: '7' },
                                ],
                                break: ', '
                            }} />
                        </div>
                        <div>
                            <EditableElement getParams={getParams} editable={
                                {
                                    name: 'minister_suit',
                                    type: 'string',
                                    multiple: true,
                                    description: 'Strój',
                                    dbkey: adminRole?.roleID,
                                    showdescription: false,
                                    display: 'grid',
                                    isOrdered: true,
                                    children: [
                                        {
                                            name: role.roleID,
                                            type: 'string',
                                            multiple: false,
                                            description: 'Opis',
                                            display: 'single',
                                        },
                                    ],
                                }} />
                        </div>
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
                                    type: 'text',
                                    multiple: false,
                                    dbkey: role?.user.id + 'telefon',
                                    description: 'Telefon',
                                    showdescription: false,
                                    display: 'single',
                                }} />
                        </div>
                        <div><EditableElement getParams={getParams} editable={
                            {
                                name: role.roleID + 'service',
                                type: 'radio',
                                multiple: true,
                                description: 'Dyżury',
                                dbkey: role?.roleID + 'groupchannel',
                                showdescription: false,
                                display: 'single',
                                options: [
                                    { label: 'Niedziela 8:00', value: '8' },
                                    { label: 'Niedziela 10:00', value: '10' },
                                    { label: 'Niedziela 12:00', value: '12' },
                                    { label: 'Niedziela 17:00', value: '17' },
                                    { label: 'Poniedziałek 7:00', value: '31' },
                                    { label: 'Poniedziałek 18:00', value: '42' },
                                    { label: 'Wtorek 7:00', value: '55' },
                                    { label: 'Wtorek 18:00', value: '66' },
                                    { label: 'Środa 7:00', value: '79' },
                                    { label: 'Środa 18:00', value: '90' },
                                    { label: 'Czwartek 7:00', value: '103' },
                                    { label: 'Czwartek 18:00', value: '114' },
                                    { label: 'Piątek 7:00', value: '127' },
                                    { label: 'Piątek 18:00', value: '138' },
                                    { label: 'Sobota 7:00', value: '151' },
                                    { label: 'Sobota 18:00', value: '162' },
                                ],
                                break: ', '
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