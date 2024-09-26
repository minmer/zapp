import { useEffect, useState } from "react";
import { GetAdminRole, GetRole, Role } from "../../../structs/role";
import { User } from "../../../structs/user";
import ChatElement from "../../../generals/chat-element";

export default function MinisterChatChannelSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [role, setRole] = useState<Role | null>()

    const [adminRole, setAdminRole] = useState<Role | null>()
    useEffect(() => {
        (async function () {
            getParams({
                func: async (param: string | User) => {
                    const user = param as User
                    setAdminRole(await GetAdminRole({ getParams: getParams, type: 'minister', user: user }))
                    setRole(await GetRole({ getParams: getParams, type: "minister", user: user as User }))
                }, type: 'user', show: false
            });
        }());
    }, [getParams])

    return (
        <div className="minister-group-chat">
            <ChatElement getParams={getParams} name={'minister_channel'} viewer={adminRole ? (adminRole?.roleID + 'channel') : (role?.roleID + 'channel')} writer={adminRole ? adminRole.roleID + 'channel': ''} />
        </div>
    );
}