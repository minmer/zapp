import { useEffect, useState } from "react";
import { FetchInformationGetAll, StringOutput } from "../features/NewFetchInformationGet";
import { CreateNewUser, CreateNewUserInformation, DeleteUser, User } from "../structs/user";
import EditableDisplay from "../generals/editable/EditableDisplay";

export default function UsersWidget({ onSelected }: { onSelected?: () => void }) {
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User>()

    useEffect(() => {
    }, [])
    useEffect(
        () => {
            (async function () {
            })();
        }, [])

    const createNewUser = async () => {
        const user = await CreateNewUser()
        await CreateNewUserInformation({ user: user, name: 'name' })
        await CreateNewUserInformation({ user: user, name: 'surname' })
        await CreateNewUserInformation({ user: user, name: 'telefon' })
        await CreateNewUserInformation({ user: user, name: 'address' })
        await CreateNewUserInformation({ user: user, name: 'birthday' })
        await CreateNewUserInformation({ user: user, name: 'birthplace' })
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
            DeleteUser({ user: user })
        deleteCount++;
    }

    return (
        <div className="user-widget">
            {
                users.map((user) =>

                    <div key={user.id} style={
                        {
                            background: user.id == selectedUser?.id ? "#ff4f004f" : "transparent",
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid',
                        }}>{
                            <div style={{ display: 'inline-block' }}>
                                <EditableDisplay editableProps={
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
                                <EditableDisplay editableProps={
                                    {
                                        name: user.user + 'surname',
                                        type: 'text',
                                        multiple: false,
                                        dbkey: user.id + 'surname',
                                        description: 'Nazwisko',
                                        showdescription: false,
                                        display: 'single',
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