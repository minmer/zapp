import { useEffect, useState } from "react";
import { GetAdminRole, GetRole, Role } from "../../../structs/role";
import { User } from "../../../structs/user";
import ChatElement from "../../../generals/chat-element";
import { FetchInformationGetAll, StringOutput } from "../../../features/FetchInformationGet";

export default function MinisterChatGroupSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string| User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [role, setRole] = useState<Role | null>()

    const [adminRole, setAdminRole] = useState<Role | null>()
    const [alias, setAlias] = useState('')
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
    useEffect(() => {
        if (role)
            (async function () {
                getParams({
                    func: async (token: string| User) => {
                        setAlias((await FetchInformationGetAll('string', token as string, role ? (role.roleID + 'alias') : '') as StringOutput[])[0]?.id)
                    }, type: 'token', show: false
                });
            }());
    }, [getParams, role])

    return (
        <div className="minister-group-chat">
            <ChatElement getParams={getParams} name={'minister_group'} viewer={adminRole ? (adminRole?.roleID + 'group') : (role?.roleID + 'group')} writer={adminRole ? (adminRole?.roleID + 'groupchannel') : (role?.roleID + 'groupchannel')} alias={alias} />
        </div>
    );
}