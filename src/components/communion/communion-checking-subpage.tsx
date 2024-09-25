import { useEffect, useState } from "react";
import { Alias, GetAdminRole, GetAliases, Role } from "../../structs/role";
import { User } from "../../structs/user";
import EditableElement from "../../generals/editable-element";

export default function CommunionCheckingSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {

    const [role, setRole] = useState<Role | null>()
    const [aliases, setAliases] = useState<Alias[]>([])
    useEffect(() => {
        (async function () {
            getParams({
                func: async (param: unknown) => {
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
                    <span>: </span>
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
                            ],
                        }} />
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
                                { label: 'Uwielbienie Trójcy', value: 'Uwielbienie Trójcy' },
                                { label: 'Uwielbienie Najświętszego Sakramentu', value: 'Uwielbienie Najświętszego Sakramentu' },
                                { label: 'Anioł Pański', value: 'Anioł Pański' },
                                { label: 'Akt wiary', value: 'Akt wiary' },
                                { label: 'Akt nadziei', value: 'Akt nadziei' },
                                { label: 'Akt miłości', value: 'Akt miłości' },
                                { label: 'Akt żalu', value: 'Akt żalu' },
                                { label: 'Pod twoją obronę', value: 'Pod twoją obronę' },
                                { label: 'Skład apostolski', value: 'Skład apostolski' },
                            ],
                        }} />
                </div>
            ))}
        </div>
    );
}