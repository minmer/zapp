import { useEffect, useState } from "react";
import { GetRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import EditableElement from "../../generals/editable-element";
import { FetchOwnerGet } from "../../features/FetchOwnerGet";
import { FetchTokenGet } from "../../features/FetchTokenGet";

export default function CommunionDetailSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [role, setRole] = useState<Role | null>()
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
                    func: async (param: unknown) => {
                        const token = param as string
                        if ((await FetchOwnerGet(token, role.roleID) == null) || !role.isRegistered) {
                            await FetchTokenGet(token)
                            console.log(await FetchOwnerGet(token, role.roleID))
                        }
                    }, type: 'token', show: true
                })
            })();
    }, [getParams, role])
    return (
        <>
            {
                role?.isRegistered ? 
                    <>
                        <div>
                            <EditableElement getParams={getParams} editable={
                                {
                                    name: role?.roleID + 'birthday',
                                    type: 'date',
                                    multiple: false,
                                    description: 'Data urodzenia',
                                    dbkey: role?.roleID,
                                    showdescription: true,
                                    showchildren: false,
                                }} />
                            <span> </span>
                            <EditableElement getParams={getParams} editable={
                                {
                                    name: role?.roleID + 'birthplace',
                                    type: 'text',
                                    multiple: false,
                                    description: 'Miejsce urodzenia',
                                    dbkey: role?.roleID,
                                    showdescription: false,
                                    showchildren: false,
                                }} />
                        </div>
                        <div>
                            <EditableElement getParams={getParams} editable={
                                {
                                    name: role?.roleID + 'address',
                                    type: 'text',
                                    multiple: false,
                                    description: 'Adres zamieszkania',
                                    dbkey: role?.roleID,
                                    showdescription: true,
                                    showchildren: false,
                                }} />
                        </div>
                        <div>
                            <EditableElement getParams={getParams} editable={
                                {
                                    name: role?.roleID + 'telefon',
                                    type: 'tel',
                                    multiple: true,
                                    description: 'Telefon',
                                    dbkey: role?.roleID,
                                    showdescription: true,
                                    showchildren: false,
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
                                    showchildren: false,
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
                                    showchildren: false,
                                }} />
                        </div>
                    </> :
                    <>
                    <h3>Zgłoszenie czeka na zatwierdzenie</h3>
                </> 
            }
        </>
    );
}