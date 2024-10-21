
import { useEffect, useState } from "react";
import { Alias, GetAdminRole, GetAliases, GetRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import { FetchOwnerGet } from "../../features/FetchOwnerGet";
import { FetchTokenGet } from "../../features/FetchTokenGet";
import EditableElement from "../../generals/editable-element";
import { useNavigate, useParams } from "react-router-dom";

export default function CommunionDetailSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
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
                    setAdminRole(await GetAdminRole({ getParams: getParams, type: 'communion', user: user }))
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
                    setRole(await GetRole({ getParams: getParams, type: "communion", user: user as User }))
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
            navigator('/zielonki/communion/detail/' + alias.id)
    }
    return (
        <div className="communion-detail">
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
                                    multiple: false,
                                    dbkey: role?.user.id + 'telefon',
                                    description: 'Telefon',
                                    showdescription: false,
                                    display: 'single',
                                }} />
                        </div>
                        <div>
                            <EditableElement getParams={getParams} editable={
                                {
                                    name: role?.user.user + 'birthday',
                                    type: 'date',
                                    multiple: false,
                                    description: 'Data urodzenia',
                                    dbkey: role?.user.id,
                                    showdescription: true,
                                    display: 'single',
                                }} />
                            <span> </span>
                            <EditableElement getParams={getParams} editable={
                                {
                                    name: role?.user.user + 'birthplace',
                                    type: 'text',
                                    multiple: false,
                                    description: 'Miejsce urodzenia',
                                    dbkey: role?.user.id,
                                    showdescription: false,
                                    display: 'single',
                                }} />
                        </div>
                        <div>
                            <EditableElement getParams={getParams} editable={
                                {
                                    name: role?.roleID + 'set0',
                                    type: 'checkbox',
                                    multiple: false,
                                    description: 'Zestaw podstawowy (Katechizm + Naklejki + Teczka + Książeczka I Piątek + Rachunek Sumienia + Wydruki) - 30 zł',
                                    dbkey: role?.roleID,
                                    showdescription: true,
                                    display: 'single',
                                }} />
                        </div>
                        <div>
                            <EditableElement getParams={getParams} editable={
                                {
                                    name: role?.roleID + 'set1',
                                    type: 'checkbox',
                                    multiple: false,
                                    description: 'Zestaw dodatkowy (Modlitewnik + Medalik + Łańcuch + Pamiątka I Komunii) - 100 zł',
                                    dbkey: role?.roleID,
                                    showdescription: true,
                                    display: 'single',
                                }} />
                        </div>
                        <EditableElement getParams={getParams} editable={
                            {
                                name: role?.roleID + 'checking',
                                type: 'binary',
                                multiple: false,
                                description: 'Części Mszy Świętej',
                                showdescription: true,
                                display: 'single',
                                options: [
                                    { label: 'Pozdrowienie ludu', value: 'Pozdrowienie ludu' },
                                    { label: 'Akt pokutny', value: 'Akt pokutny' },
                                    { label: 'Panie zmiłuj się', value: 'Panie zmiłuj się' },
                                    { label: 'Chwała na wysokości Bogu', value: 'Chwała na wysokości Bogu' },
                                    { label: 'Czytania i Ewangelia', value: 'Czytania i Ewangelia' },
                                    { label: 'Wyznanie wiary', value: 'Wyznanie wiary' },
                                    { label: 'Modlitwa Wiernych', value: 'Modlitwa Wiernych' },
                                    { label: 'Modlitwa za kapłana', value: 'Modlitwa za kapłana' },
                                    { label: 'Prefacja', value: 'Prefacja' },
                                    { label: 'Święty, święty, święty', value: 'Święty, święty, święty' },
                                    { label: 'Aklamacja', value: 'Aklamacja' },
                                    { label: 'Ojcze nasz', value: 'Ojcze nasz' },
                                    { label: 'Znak pokoju', value: 'Znak pokoju' },
                                    { label: 'Baranku Boży', value: 'Baranku Boży' },
                                    { label: 'Oto Baranek Boży', value: 'Oto Baranek Boży' },
                                    { label: 'Błogosławieństwo', value: 'Błogosławieństwo' },
                                ],
                            }} />
                        <EditableElement getParams={getParams} editable={
                            {
                                name: role?.roleID + 'praiers',
                                type: 'binary',
                                multiple: false,
                                description: 'Modlitwy',
                                showdescription: true,
                                display: 'single',
                                options: [
                                    { label: 'Znak krzyża', value: 'Znak krzyża' },
                                    { label: 'Ojcze nasz', value: 'Ojcze nasz' },
                                    { label: 'Zdrowaś Maryjo', value: 'Zdrowaś Maryjo' },
                                    { label: 'Modlitwa przed nauką', value: 'Modlitwa przed nauką' },
                                    { label: 'Uwielbienie Najświętszego Sakramentu', value: 'Uwielbienie Najświętszego Sakramentu' },
                                    { label: 'Uwielbienie Trójcy', value: 'Uwielbienie Trójcy' },
                                    { label: 'Anioł Pański', value: 'Anioł Pański' },
                                    { label: 'Akt wiary', value: 'Akt wiary' },
                                    { label: 'Akt nadziei', value: 'Akt nadziei' },
                                    { label: 'Akt miłości', value: 'Akt miłości' },
                                    { label: 'Akt żalu', value: 'Akt żalu' },
                                    { label: 'Pod twoją obronę', value: 'Pod twoją obronę' },
                                    { label: 'Skład apostolski', value: 'Skład apostolski' },
                                ],
                            }} />
                        <EditableElement getParams={getParams} editable={
                            {
                                name: role?.roleID + 'lists',
                                type: 'binary',
                                multiple: false,
                                description: 'Zestawienia',
                                showdescription: true,
                                display: 'single',
                                options: [
                                    { label: 'Sakramenty Święte', value: 'Sakramenty Święte' },
                                    { label: 'Główne Prawdy Wiary', value: 'Główne Prawdy Wiary' },
                                    { label: 'Trzy cnoty Boskie', value: 'Trzy cnoty Boskie' },
                                    { label: '10 Przykazań Bożych', value: '10 Przykazań Bożych' },
                                    { label: 'Przykazanie Miłości', value: 'Przykazanie Miłości' },
                                    { label: '5 Warunkach Dobrej Spowiedzi', value: '5 Warunkach Dobrej Spowiedzi' },
                                    { label: 'Przykazania kościelne', value: 'Przykazania kościelne' },
                                    { label: 'Grzechy główne', value: 'Grzechy główne' },
                                    { label: 'Rzeczy ostateczne człowieka', value: 'Rzeczy ostateczne człowieka' },
                                ],
                            }} />
                        <EditableElement getParams={getParams} editable={
                            {
                                name: role?.roleID + 'questions',
                                type: 'binary',
                                multiple: false,
                                description: 'Pytania',
                                showdescription: true,
                                display: 'single',
                                options: [
                                    { label: 'O Panu Bogu', value: 'O Panu Bogu' },
                                    { label: 'O Panu Jezusie', value: 'O Panu Jezusie' },
                                    { label: 'O Duchu Świętym', value: 'O Duchu Świętym' },
                                    { label: 'O aniołach', value: 'O aniołach' },
                                    { label: 'O czowieku', value: 'O czowieku' },
                                    { label: 'O rzeczach ostatecznych', value: 'O rzeczach ostatecznych' },
                                    { label: 'O łasce', value: 'O łasce' },
                                    { label: 'O grzechu', value: 'O grzechu' },
                                    { label: 'O grzechu pierworodnym', value: 'O grzechu pierworodnym' },
                                    { label: 'O Kościele', value: 'O Kościele' },
                                    { label: 'O Sakramentach', value: 'O Sakramentach' },
                                    { label: 'O Sakramencie Eucharystii', value: 'O Sakramencie Eucharystii' },
                                    { label: 'O Sakramencie Pokuty', value: 'O Sakramencie Pokuty' },
                                ],
                            }} />
                    </> :
                    <>
                        <h3>Zgłoszenie czeka na zatwierdzenie</h3>
                    </>
            }
        </div>
    );
}