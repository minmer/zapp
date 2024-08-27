import { useEffect, useState } from "react";
import EditableElement from "../../generals/editable-element";
import { CreateRole, GetRole, Role } from "../../structs/role";
import { User } from "../../structs/user";

export default function ConfirmationDetailSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {

    const [selectedUser, setSelectedUser] = useState<User>()
    const [role, setRole] = useState<Role | null>()
    useEffect(() => {
        (async function () {
            //await getParams({ func: async (user: string, id: string) => setSelectedUser({ user, id }) })
        })();
    }, [getParams])
    const selectUser = async () => {
        //setSelectedUser(await getParams({ func: async (user: string, id: string) => setSelectedUser({ user, id }) }) as User)
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
                setRole(await CreateRole({ getParams: getParams, type: "confirmation", user: selectedUser }))
            }
        })();
    }

    return (
        <>
        <h3>Twoje zgłoszenie zostało wysłane i oczekuje na przyjęcie</h3>
        </>
    );
}