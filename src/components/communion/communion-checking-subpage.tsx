import { useEffect, useState } from "react";
import { Alias, GetAdminRole, GetAliases, Role } from "../../structs/role";
import { User } from "../../structs/user";
import EditableElement from "../../generals/editable-element";

export default function CommunionCheckingSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {

    const [role, setRole] = useState<Role | null>()
    const [aliases, setAliases] = useState<Alias[]>([])
    useEffect(() => {
        (async function () {
            getParams({
                func: async (param: string | User) => {
                    const user = param as User
                    setRole(await GetAdminRole({ getParams: getParams, type: 'communion', user: user }))
                }, type: 'user', show: false
            });
        }());
    }, [getParams])

    useEffect(() => {
        (async function () {
            setAliases((await GetAliases({ getParams: getParams, adminID: role?.roleID ?? '' })).sort((a, b) => a.alias?.localeCompare(b.alias ?? '') ?? 0))
        }());
    }, [getParams, role])

    return (
        <div className="communion-checking">
            {aliases?.map(alias => (
                <div key={alias.id}>
                    <span className='alias'>
                    <EditableElement getParams={getParams} editable={
                        {
                            name: alias.id + 'alias',
                            type: 'text',
                            multiple: false,
                            description: 'Alias',
                            dbkey: alias.id,
                            showdescription: false,
                            showchildren: false,
                            }} />
                    </span>
                    <span className='static-font'>
                    <span>:</span>
                    <EditableElement getParams={getParams} editable={
                        {
                            name: alias.id + 'checking',
                            type: 'binary',
                            multiple: false,
                            description: 'Sprawdzanie',
                            dbkey: alias.id,
                            showdescription: false,
                            showchildren: false,
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
                                { label: 'Święty', value: 'Święty' },
                                { label: 'Aklamacja', value: 'Aklamacja' },
                                { label: 'Ojcze nasz', value: 'Ojcze nasz' },
                                { label: 'Znak pokoju', value: 'Znak pokoju' },
                                { label: 'Baranku Boży', value: 'Baranku Boży' },
                                { label: 'Komunia', value: 'Komunia' },
                                { label: 'Błogosławieństwo', value: 'Błogosławieństwo' },
                            ],
                        }} />
                    <span>-</span>
                    <EditableElement getParams={getParams} editable={
                        {
                            name: alias.id + 'praiers',
                            type: 'binary',
                            multiple: false,
                            description: 'Modlitwy',
                            dbkey: alias.id,
                            showdescription: false,
                            showchildren: false,
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
                    <span>-</span>
                    <EditableElement getParams={getParams} editable={
                        {
                            name: alias.id + 'lists',
                            type: 'binary',
                            multiple: false,
                            description: 'Zestawienia',
                            dbkey: role?.roleID,
                            showdescription: false,
                            showchildren: false,
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

                    <span>-</span>
                    <EditableElement getParams={getParams} editable={
                        {
                            name: alias.id + 'questions',
                            type: 'binary',
                            multiple: false,
                            description: 'Pytania',
                            dbkey: role?.roleID,
                            showdescription: false,
                            showchildren: false,
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
                    </span>
                </div>
            ))}
        </div>
    );
}