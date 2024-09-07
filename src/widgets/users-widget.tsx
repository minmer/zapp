import { useEffect, useState } from "react";
import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import { CreateNewUser, CreateNewUserInformation, DeleteUser, User } from "../structs/user";
import OldEditableElement from "../temp/old-editable-element";

export default function UsersWidget({ getParams, onSelected }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, onSelected?: () => void }) {
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User>()

    useEffect(() => {
            setSelectedUser({ user: localStorage.getItem("user") + '', id: localStorage.getItem("userid") + '' })
        },[])
    useEffect(
        () => {
            getParams({
                func: async (param: unknown) => {
                    const token = param as string
                    setUsers((await FetchInformationGetAll('string', token, 'user') as StringOutput[]).map<User>((output) => ({ id: output.id, user: output.output })))

                }, type: 'token', show: false
            })
        }, [getParams])

    const createNewUser = async () => {
        const user = await CreateNewUser({ getParams })
        CreateNewUserInformation({ getParams: getParams, user: user, name: 'name'})
        CreateNewUserInformation({ getParams: getParams, user: user, name: 'surname'})
    }

    const selectUser = (user: User) => {
        setSelectedUser(user)
        localStorage.setItem("user", user.user)
        localStorage.setItem("userid", user.id)
        if (onSelected != null)
            onSelected()
    }

    let deleteCount = 0;

    const deleteUser = (user: User) => {
        if (deleteCount > 2)
            DeleteUser({ getParams: getParams, user: user })
        deleteCount++;
    }

    return (
        <div className="user-widget">
            {
                users.map((user) =>

                    <div style={
                        {
                            background: user == selectedUser ? "#ff4f004f" : "transparent",
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid',
                        }}>{
                            <div style={{ display: 'inline-block' }}>
                                <OldEditableElement getParams={getParams} name={user.user + "name"} dbkey={user.id + 'name'} type="text" multiple={false} showdescription={false} description="Imię" />
                                <OldEditableElement getParams={getParams} name={user.user + "surname"} dbkey={user.id + 'surname'} type="text" multiple={false} showdescription={false} description="Nazwisko" />

                                <input type='button' value='wybierz' onClick={() => selectUser(user)} onDoubleClick={() => deleteUser(user) } />
                        </div>
                    }
                    </div>
                )}
            <input type="button" value="Stwórz nową osobę" onClick={createNewUser}  />
        </div>
    );
}