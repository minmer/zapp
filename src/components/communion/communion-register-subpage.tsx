import { useEffect, useState } from "react";
import OldEditableElement from "../../temp/old-editable-element";
import { CreateRole, GetRole, Role } from "../../structs/role";
import { ShareUserInformation, User } from "../../structs/user";
import { FetchInformationDelete } from "../../features/FetchInformationDelete";

export default function CommunionRegisterSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {

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
        if (selectedUser== null)
            await getParams({ func: async (param: unknown) => setSelectedUser(param as User), type: 'user', show: true })
        else
            await getParams({ func: async () => { } , type: 'newuser', show: true })
    }

    useEffect(() => {
        (async function () {
            if (selectedUser != null) {
                setRole(await GetRole({ getParams: getParams, type: "communion", user: selectedUser }))
            }
        }());
    }, [getParams, selectedUser])

    const register = () => {
        (async function () {
            if (selectedUser != null) {
                CreateRole({ getParams: getParams, type: 'communion', user: selectedUser, admin: 'ed3d4741-b900-4bee-afa0-a7bc08e8be52' })
                ShareUserInformation({ getParams: getParams, name: 'name', user: selectedUser, sharingID: 'ed3d4741-b900-4bee-afa0-a7bc08e8be52' })
                ShareUserInformation({ getParams: getParams, name: 'surname', user: selectedUser, sharingID: 'ed3d4741-b900-4bee-afa0-a7bc08e8be52' })
            }
        })();
    }

    const removeAttendee = async () => {
        if (role != null) {
            getParams({
                func: async (token: unknown) => {
                    await FetchInformationDelete(token as string, role.roleID, role.user.id )
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
                        <OldEditableElement getParams={getParams} name={selectedUser.user + "name"} dbkey={selectedUser.id + 'name'} type="text" multiple={false} showdescription={false} />
                        <span> </span>
                        <OldEditableElement getParams={getParams} name={selectedUser.user + "surname"} dbkey={selectedUser.id + 'surname'} type="text" multiple={false} showdescription={false} />
                    </>
                    :
                    <>
                        <div>Czy chcesz zgłosić następujące dziecko do I Komunii Świętej?</div>
                        <OldEditableElement getParams={getParams} name={selectedUser.user + "name"} dbkey={selectedUser.id + 'name'} type="text" multiple={false} showdescription={false} />
                        <span> </span>
                        <OldEditableElement getParams={getParams} name={selectedUser.user + "surname"} dbkey={selectedUser.id + 'surname'} type="text" multiple={false} showdescription={false} />
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