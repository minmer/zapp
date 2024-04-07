import { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { FetchGetAll, StringOutput } from "../features/FetchGet";
import UserPermissionsComponent from "./user-detail-component";
interface User {
    group: string,
    id: string,
    key?: string,
    name?: string,
}
export default function UsersPermissionElement() {
    const { token } = useParams();
    const [users, setUsers] = useState([] as User[])

    useEffect(() => {
        (async function () {
            try {
                if (token !== undefined) {
                    const tempUsers = [] as User[];
                    const usersData = await FetchGetAll('text', token, 'user') as unknown as StringOutput[]
                    for (let i = 0; i < usersData.length; i++) {
                        const nameData = await FetchGetAll('text', token, usersData[i].id + 'name') as unknown as StringOutput[]
                        const keyData = await FetchGetAll('text', token, usersData[i].id + 'id') as unknown as StringOutput[]
                        tempUsers.push({
                            group: usersData[i].output,
                            id: usersData[i].id,
                            name: nameData[0]?.output,
                            key: keyData[0]?.output
                        })
                    }
                    setUsers(tempUsers)
                    console.log(tempUsers)
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token])

    return (
        <>
            <div className="content-userdetail">
                {users.map(user => (
                    <>
                        <Link to={user.id} >
                            {user.name ?? "Nieznane imię"}
                        </Link>
                    </>
                ))
                }
                <Routes>
                    <Route path="/:user_id" element={<UserPermissionsComponent />} />
                </Routes>
            </div>
        </>
    );
}