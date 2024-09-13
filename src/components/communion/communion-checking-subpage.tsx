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
                    console.log('asd1')
                }, type: 'user', show: false
            });
        }());
    }, [getParams])

    useEffect(() => {
        (async function () {
            console.log('asd2')
            setAliases(await GetAliases({ getParams: getParams, adminID: role?.roleID ?? '' }))
        }());
    }, [getParams, role])

    return (
        <>
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
                </div>
            ))}
        </>
    );
}