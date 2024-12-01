import { useEffect, useState } from "react";
import { CreateRole, GetRole, Role } from "../../structs/role";
import { ShareUserInformation, User } from "../../structs/user";
import EditableElement from "../../generals/editable-element";
import { FetchInformationDelete } from "../../features/FetchInformationDelete";
import { useAuth } from "../../generals/permission/AuthContext";

export default function CommunionRegisterSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const { user, selectUser } = useAuth();
    const [role, setRole] = useState<Role | null>()

    const selectedUser = async () => {
        if (user == null)
            await getParams({ func: async (param: unknown) => selectUser(param as User), type: 'user', show: true })
        else
            await getParams({ func: async () => { }, type: 'newuser', show: true })
    }

    useEffect(() => {
        (async function () {
            if (selectedUser != null) {
                setRole(await GetRole({ type: "communion", user: user }))
            }
        }());
    }, [getParams, selectedUser])

    const register = () => {
        (async function () {
            if (selectedUser != null) {
                setRole(await CreateRole({ type: 'communion', user: user, admin: '4344984e-0583-4148-82f0-76a29651f47d' }))
                ShareUserInformation({ name: 'name', user: user, sharingID: '4344984e-0583-4148-82f0-76a29651f47d' })
                ShareUserInformation({ name: 'surname', user: user, sharingID: '4344984e-0583-4148-82f0-76a29651f47d' })
                ShareUserInformation({ name: 'telefon', user: user, sharingID: '4344984e-0583-4148-82f0-76a29651f47d' })
                ShareUserInformation({ name: 'address', user: user, sharingID: '4344984e-0583-4148-82f0-76a29651f47d' })
                ShareUserInformation({ name: 'birthday', user: user, sharingID: '4344984e-0583-4148-82f0-76a29651f47d' })
                ShareUserInformation({ name: 'birthplace', user: user, sharingID: '4344984e-0583-4148-82f0-76a29651f47d' })
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
                                name: user.user + 'name',
                                type: 'text',
                                multiple: false,
                                description: 'Imię',
                                dbkey: user.id + 'name',
                                showdescription: false,
                                display: 'single',
                            }} />
                        <span> </span>
                        <EditableElement getParams={getParams} editable={
                            {
                                name: user.user + 'surname',
                                type: 'text',
                                multiple: false,
                                dbkey: user.id + 'surname',
                                description: 'Nazwisko',
                                showdescription: false,
                                display: 'single',
                            }} />
                    </>
                    :
                    <>
                        <div onDoubleClick={removeAttendee}>Czy chcesz zgłosić następującą osobę do Komunii Świętej?</div>
                        <EditableElement getParams={getParams} editable={
                            {
                                name: user.user + 'name',
                                type: 'text',
                                multiple: false,
                                description: 'Imię',
                                dbkey: user.id + 'name',
                                showdescription: false,
                                display: 'single',
                            }} />
                        <span> </span>
                        <EditableElement getParams={getParams} editable={
                            {
                                name: user.user + 'surname',
                                type: 'text',
                                multiple: false,
                                dbkey: user.id + 'surname',
                                description: 'Nazwisko',
                                showdescription: false,
                                display: 'single',
                            }} />
                        <span><input type="button" className="button" value="Zgłoś użytkownika" onClick={register} /></span>
                        <span><input type="button" className="button" value="Wybierz innego użytkownika" onClick={selectedUser} /></span>
                    </>
                :
                <>
                    <h3>Musisz założyć i wybrać użytkownika, aby móc go zgłosić do I Komunii Świętej.
                    </h3>
                    <span><input type="button" className="button" value="Wybierz użytkownika" onClick={selectedUser} /></span>
                </>
            }
        </>
    );
}