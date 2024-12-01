import { useEffect, useState } from "react";
import { Alias, GetAdminRole, GetAliases, Role } from "../../structs/role";
import { User } from "../../structs/user";
import EditableDisplay from "../../generals/editable/EditableDisplay";
import { useAuth } from "../../generals/permission/AuthContext";

export default function CommunionCheckingSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {

    const [check0, setCheck0] = useState(false)
    const [check1, setCheck1] = useState(false)
    const [check2, setCheck2] = useState(false)
    const [check3, setCheck3] = useState(false)
    const [role, setRole] = useState<Role | null>()
    const [aliases, setAliases] = useState<Alias[]>([])
    const { user } = useAuth();
    useEffect(() => {
        (async function () {
            setRole(await GetAdminRole({ type: 'communion', user: user }))
        }());
    }, [getParams])

    const loadAliases = async (filter: string) =>
    {
        setAliases((await GetAliases({ adminID: role?.roleID ?? '' })).filter((alias) => alias.alias?.startsWith(filter)).sort((a, b) => a.alias?.localeCompare(b.alias ?? '') ?? 0))
    }

    return (
        <div className="communion-checking">
            <input type='button' value='3A' onClick={() => loadAliases('3A')} />
            <input type='button' value='3B' onClick={() => loadAliases('3B')} />
            <input type='button' value='3C' onClick={() => loadAliases('3C')} />
            <input type='button' value='3D' onClick={() => loadAliases('3D')} />
            <input type='button' value='3E' onClick={() => loadAliases('3E')} />
            <input type='button' value='3F' onClick={() => loadAliases('3F')} />
            <input style={{ height: '40px', width: '40px', margin: '0 5px', verticalAlign: 'middle' }} type='checkbox' onChange={(e) => setCheck0(e.target.checked == true)} />
            <input style={{ height: '40px', width: '40px', margin: '0 5px', verticalAlign: 'middle' }} type='checkbox' onChange={(e) => setCheck1(e.target.checked == true)} />
            <input style={{ height: '40px', width: '40px', margin: '0 5px', verticalAlign: 'middle' }} type='checkbox' onChange={(e) => setCheck2(e.target.checked == true)} />
            <input style={{ height: '40px', width: '40px', margin: '0 5px', verticalAlign: 'middle' }} type='checkbox' onChange={(e) => setCheck3(e.target.checked == true)} />
            {aliases?.map(alias => (
                <div key={alias.id}>
                    <span className='alias'>
                        <EditableDisplay editableProps={
                        {
                            name: alias.id + 'alias',
                            type: 'text',
                            multiple: false,
                            description: 'Alias',
                            dbkey: alias.id,
                            showdescription: false,
                            display: 'single',
                            }} />
                    </span>
                    <span className='static-font'>
                        <span>:</span>
                        {check0 ? <EditableDisplay editableProps={
                            {
                                name: alias.id + 'checking',
                                type: 'binary',
                                multiple: false,
                                description: 'Sprawdzanie',
                                dbkey: alias.id,
                                showdescription: false,
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
                            }} />: null}
                    <span>-</span>
                        {check1 ? <EditableDisplay editableProps={
                        {
                            name: alias.id + 'praiers',
                            type: 'binary',
                            multiple: false,
                            description: 'Modlitwy',
                            dbkey: alias.id,
                            showdescription: false,
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
                            }} />: null}
                    <span>-</span>
                        {check2 ? <EditableDisplay editableProps={
                        {
                            name: alias.id + 'lists',
                            type: 'binary',
                            multiple: false,
                            description: 'Zestawienia',
                            dbkey: role?.roleID,
                            showdescription: false,
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
                            }} />: null}

                        <span>-</span>
                        {check3 ? <EditableDisplay editableProps={
                        {
                            name: alias.id + 'questions',
                            type: 'binary',
                            multiple: false,
                            description: 'Pytania',
                            dbkey: role?.roleID,
                            showdescription: false,
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
                            }} />: null}
                    </span>
                </div>
            ))}
        </div>
    );
}