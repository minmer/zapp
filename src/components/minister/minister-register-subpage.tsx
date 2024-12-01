import { useEffect, useState } from "react";
import { CreateRole, GetRole, Role } from "../../structs/role";
import { ShareUserInformation, User } from "../../structs/user";
import EditableElement from "../../generals/editable-element";
import { FetchInformationDelete } from "../../features/FetchInformationDelete";
import { useAuth } from "../../generals/permission/AuthContext";

export default function MinisterRegisterSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {

    const [role, setRole] = useState<Role | null>()
    const { user, token, selectUser} = useAuth();

    const selectedUser = async () => {
        if (user == null)
            await getParams({ func: async (param: unknown) => selectUser(param as User), type: 'user', show: true })
        else
            await getParams({ func: async () => { }, type: 'newuser', show: true })
    }

    useEffect(() => {
        (async function () {
            if (user != null) {
                setRole(await GetRole({ type: "minister", user: user }))
            }
        }());
    }, [getParams, user])

    const register = () => {
        (async function () {
            if (user != null) {
                setRole(await CreateRole({ type: 'minister', user: user, admin: 'd3632117-be3a-41af-9b14-72865e62628a' }))
                ShareUserInformation({ name: 'name', user: user, sharingID: 'd3632117-be3a-41af-9b14-72865e62628a' })
                ShareUserInformation({ name: 'surname', user: user, sharingID: 'd3632117-be3a-41af-9b14-72865e62628a' })
                ShareUserInformation({ name: 'birthday', user: user, sharingID: '4344984e-0583-4148-82f0-76a29651f47d' })
                ShareUserInformation({ name: 'birthplace', user: user, sharingID: '4344984e-0583-4148-82f0-76a29651f47d' })
                ShareUserInformation({ name: 'telefon', user: user, sharingID: 'dc31033d-ffea-469c-9d2e-9091280ece69' })
                ShareUserInformation({ name: 'address', user: user, sharingID: 'dc31033d-ffea-469c-9d2e-9091280ece69' })
            }
        })();
    }

    const removeAttendee = async () => {
        if (role != null) {
            await FetchInformationDelete(token as string, role.user.id, role.roleID )
        }
    }

    return (
        <>
            {user != null ?
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
                        <div onDoubleClick={removeAttendee}>Czy chcesz zgłosić następującą osobę do służby liturgicznej?</div>
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
                    <h3>Musisz założyć i wybrać użytkownika, aby móc go zgłosić do służby liturgicznej.
                    </h3>
                    <span><input type="button" className="button" value="Wybierz użytkownika" onClick={selectedUser} /></span>
                </>
            }
        </>
    );
}