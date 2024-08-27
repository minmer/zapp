import { useEffect, useState } from "react";
import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import { User } from "../structs/user";
import { FetchOwnerPost } from "../features/FetchOwnerPost";
import { FetchInformationPost } from "../features/FetchInformationPost";
import { FetchInformationPut } from "../features/FetchInformationPut";
import { FetchOwnerGet } from "../features/FetchOwnerGet";
import EditableElement from "../generals/editable-element";

export default function UsersWidget({ getParams, onSelected }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, onSelected: () => void }) {
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

    const createNewUser = () => {
        getParams({
            func: async (param: unknown) => {
                const token = param as string
                const informationID = await FetchInformationPost(token, "token_key_" + token, ["user"], "Temp", [1])
                await FetchOwnerPost(token, informationID, "token_key_" + token)
                const ownerID = await FetchOwnerGet(token, informationID)
                await FetchInformationPut(token, "token_key_" + token, informationID, ownerID)
                setSelectedUser({ id: informationID, user: ownerID })
                setUsers([
                    ...users,
                    { id: informationID, user: ownerID }
                ]);
            }, type: 'token', show: false
        })
    }

    const selectUser = (user: User) => {
        setSelectedUser(user)
        localStorage.setItem("user", user.user)
        localStorage.setItem("userid", user.id)
        if (onSelected != null)
            onSelected()
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
                                <EditableElement getParams={getParams} name={user.user + "name"} dbkey={user.id} type="text" multiple={false} showdescription={false} description="Imię" />
                                <EditableElement getParams={getParams} name={user.user + "surname"} dbkey={user.id} type="text" multiple={false} showdescription={false} description="Nazwisko" />

                                <input type='button' value='wybierz' onClick={() => selectUser(user)} />
                        </div>
                    }
                    </div>
                ) }
            <input type="button" value="Stwórz nową osobę" onClick={createNewUser} />
        </div>
    );
}