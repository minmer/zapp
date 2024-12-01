import { useEffect, useState } from "react";
import { FetchInformationGetAll, StringOutput } from "../../features/NewFetchInformationGet";
import { CreateNewUser, CreateNewUserInformation, DeleteUser, User } from "../../structs/user";
import EditableDisplay from "../../generals/editable/EditableDisplay";
import { useAuth } from "./AuthContext";

export default function UserElement({ onSelected }: { onSelected?: () => void }) {
    const { user, selectUser } = useAuth()
    const [users, setUsers] = useState<User[]>([])

    useEffect(
        () => {
            (async function () {
                setUsers((await FetchInformationGetAll('string', 'user') as StringOutput[]).map<User>((output) => ({ id: output.id, user: output.output, roles: [] })))
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

    let deleteCount = 0;

    const deleteUser = (user: User) => {
        if (deleteCount > 2)
            DeleteUser({ user: user })
        deleteCount++;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
            {
                users.map((singleuser) =>

                    <div key={singleuser.id} style={
                        {
                            background: singleuser.id == user?.id ? "#ff4f004f" : "transparent",
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid',
                        }}>{
                            <div style={{ display: 'inline-block' }}>
                                <EditableDisplay editableProps={
                                    {
                                        name: singleuser.user + 'name',
                                        type: 'string',
                                        multiple: false,
                                        description: 'Imię',
                                        dbkey: singleuser.id + 'name',
                                        showdescription: false,
                                        display: 'single',
                                    }} />
                                <span> </span>
                                <EditableDisplay editableProps={
                                    {
                                        name: singleuser.user + 'surname',
                                        type: 'string',
                                        multiple: false,
                                        dbkey: singleuser.id + 'surname',
                                        description: 'Nazwisko',
                                        showdescription: false,
                                        display: 'single',
                                    }} />
                                <span><input type='button' value='wybierz' onClick={() => { selectUser(singleuser); onSelected(); }} onDoubleClick={() => deleteUser(singleuser)} /></span>
                            </div>
                        }
                    </div>
                )}
                    <span><input type="button" value="Stwórz nową osobę" onClick={createNewUser} /></span>
            </div>
        </div>
    );
}