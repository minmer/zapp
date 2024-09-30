import { useEffect, useState } from "react";
import { CreateRole, GetRole, Role } from "../../structs/role";
import { ShareUserInformation, User } from "../../structs/user";
import EditableElement from "../../generals/editable-element";
import { FetchInformationDelete } from "../../features/FetchInformationDelete";

export default function ConfirmationRegisterSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {

    const [selectedUser, setSelectedUser] = useState<User>()
    const [role, setRole] = useState<Role | null>()
    useEffect(() => {
        (async function () {
            await getParams({
                func: async (param: string | User) => {
                    setSelectedUser(param as User)
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
                setRole(await GetRole({ getParams: getParams, type: "confirmation", user: selectedUser }))
            }
        }());
    }, [getParams, selectedUser])

    const register = () => {
        (async function () {
            if (selectedUser != null) {
                setRole(await CreateRole({ getParams: getParams, type: 'confirmation', user: selectedUser, admin: 'dc31033d-ffea-469c-9d2e-9091280ece69' }))
                ShareUserInformation({ getParams: getParams, name: 'name', user: selectedUser, sharingID: 'dc31033d-ffea-469c-9d2e-9091280ece69' })
                ShareUserInformation({ getParams: getParams, name: 'surname', user: selectedUser, sharingID: 'dc31033d-ffea-469c-9d2e-9091280ece69' })
            }
        })();
    }

    const removeAttendee = async () => {
        if (role != null) {
            getParams({
                func: async (token: string | User) => {
                    await FetchInformationDelete(token as string, role.user.id, role.roleID)
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
                        <div onDoubleClick={removeAttendee}>Czy chcesz zgłosić następującą osobę do bierzmowania?</div>
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
                        <span><input type="button" className="button" value="Zgłoś użytkownika" onClick={register} /></span>
                        <span><input type="button" className="button" value="Wybierz innego użytkownika" onClick={selectUser} /></span>
                    </>
                :
                <>
                    <h3>Musisz założyć i wybrać użytkownika, aby móc go zgłosić do bierzmowania.
                    </h3>
                    <span><input type="button" className="button" value="Wybierz użytkownika" onClick={selectUser} /></span>
                </>
            }
        </>
    );
}