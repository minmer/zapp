import { useEffect, useState } from "react";
import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import { CreateNewUser, CreateNewUserInformation, DeleteUser, User } from "../structs/user";
import EditableElement from "../generals/editable-element";

export default function UsersWidget({ getParams, onSelected }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, onSelected?: () => void }) {
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User>()

    useEffect(() => {
        setSelectedUser({ user: localStorage.getItem("user") + '', id: localStorage.getItem("userid") + '' })
        },[])
    useEffect(
        () => {
            getParams({
                func: async (param: string | User) => {
                    const token = param as string
                    setUsers((await FetchInformationGetAll('string', token, 'user') as StringOutput[]).map<User>((output) => ({ id: output.id, user: output.output })))

                }, type: 'token', show: true
            })
        }, [getParams])

    const createNewUser = async () => {
        const user = await CreateNewUser({ getParams })
        await CreateNewUserInformation({ getParams: getParams, user: user, name: 'name'})
        await CreateNewUserInformation({ getParams: getParams, user: user, name: 'surname' })
        setUsers([...users, user])
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
                            background: user.id == selectedUser?.id ? "#ff4f004f" : "transparent",
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid',
                        }}>{
                            <div style={{ display: 'inline-block' }}>
                                <EditableElement getParams={getParams} editable={
                                    {
                                        name: user.user + 'name',
                                        type: 'text',
                                        multiple: false,
                                        description: 'Imię',
                                        dbkey: user.id + 'name',
                                        showdescription: false,
                                        showchildren: false,
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
                                        showchildren: false,
                                    }} />

                                <span><input type='button' value='wybierz' onClick={() => selectUser(user)} onDoubleClick={() => deleteUser(user)} /></span>
                        </div>
                    }
                    </div>
                )}
            <span><input type="button" value="Stwórz nową osobę" onClick={createNewUser} /></span>
        </div>
    );
}