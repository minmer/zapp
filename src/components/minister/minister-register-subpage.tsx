import { useEffect, useState } from "react";
import { CreateRole, GetRole, Role } from "../../structs/role";
import { ShareUserInformation, User } from "../../structs/user";
import EditableElement from "../../generals/editable-element";
import { FetchInformationDelete } from "../../features/FetchInformationDelete";

export default function MinisterRegisterSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {

    const [selectedUser, setSelectedUser] = useState<User>()
    const [role, setRole] = useState<Role | null>()
    useEffect(() => {
        (async function () {
            await getParams({
                func: async (param: unknown) => {
                    setSelectedUser(param as User)
                    console.log((param as User).id)
                }, type: 'user', show: true
            })
        })();
    }, [getParams])

    const selectUser = async () => {
        if (selectedUser == null)
            await getParams({ func: async (param: unknown) => setSelectedUser(param as User), type: 'user', show: true })
        else
            await getParams({ func: async () => { }, type: 'newuser', show: true })
    }

    useEffect(() => {
        (async function () {
            if (selectedUser != null) {
                console.log(await GetRole({ getParams: getParams, type: "minister", user: selectedUser }))
                setRole(await GetRole({ getParams: getParams, type: "minister", user: selectedUser }))
            }
        }());
    }, [getParams, selectedUser])

    const register = () => {
        (async function () {
            if (selectedUser != null) {
                setRole(await CreateRole({ getParams: getParams, type: 'minister', user: selectedUser, admin: 'd3632117-be3a-41af-9b14-72865e62628a' }))
                ShareUserInformation({ getParams: getParams, name: 'name', user: selectedUser, sharingID: 'd3632117-be3a-41af-9b14-72865e62628a' })
                ShareUserInformation({ getParams: getParams, name: 'surname', user: selectedUser, sharingID: 'd3632117-be3a-41af-9b14-72865e62628a' })
            }
        })();
    }

    const removeAttendee = async () => {
        if (role != null) {
        getParams({
            func: async (token: unknown) => {
                console.log(token)
                console.log(selectedUser)
                console.log(role)
                await FetchInformationDelete(token as string, role.user.id, role.roleID )
            }, type: 'token', show: false
        });
        }
    }

    return (
        <>
            {selectedUser != null ?
                role != null ?
                    <>
                        <div onDoubleClick={removeAttendee}>Następująca osoba jest zgłoszona:</div>
                        <EditableElement getParams={getParams} editable={
                            {
                                name: selectedUser.user + 'name',
                                type: 'text',
                                multiple: false,
                                description: 'Imię',
                                dbkey: selectedUser.id + 'name',
                                showdescription: false,
                                showchildren: false,
                            }} />
                        <span> </span>
                        <EditableElement getParams={getParams} editable={
                            {
                                name: selectedUser.user + 'surname',
                                type: 'text',
                                multiple: false,
                                dbkey: selectedUser.id + 'surname',
                                description: 'Nazwisko',
                                showdescription: false,
                                showchildren: false,
                            }} />
                    </>
                    :
                    <>
                        <div onDoubleClick={removeAttendee}>Czy chcesz zgłosić następujące dziecko do I Komunii Świętej?</div>
                        <EditableElement getParams={getParams} editable={
                            {
                                name: selectedUser.user + 'name',
                                type: 'text',
                                multiple: false,
                                description: 'Imię',
                                dbkey: selectedUser.id,
                                showdescription: false,
                                showchildren: false,
                            }} />
                        <span> </span>
                        <EditableElement getParams={getParams} editable={
                            {
                                name: selectedUser.user + 'surname',
                                type: 'text',
                                multiple: false,
                                dbkey: selectedUser.id,
                                description: 'Nazwisko',
                                showdescription: false,
                                showchildren: false,
                            }} />
                        <input type="button" className="button" value="Zgłoś użytkownika" onClick={register} />
                        <input type="button" className="button" value="Wybierz innego użytkownika" onClick={selectUser} />
                    </>
                :
                <>
                    <h3>Musisz założyć i wybrać użytkownika, aby móc go zgłosić do bierzmowania.
                    </h3>
                    <input type="button" className="button" value="Wybierz użytkownika" onClick={selectUser} />
                </>
            }
        </>
    );
}