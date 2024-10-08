import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet"
import { FetchInformationPost } from "../features/FetchInformationPost"
import { FetchInformationPut } from "../features/FetchInformationPut"
import { FetchOwnerGet } from "../features/FetchOwnerGet"
import { FetchOwnerPost } from "../features/FetchOwnerPost"
import { FetchOwnerPut, PutOwnerOutput } from "../features/FetchOwnerPut"
import { User } from "./user"

export interface Role {
    roleID: string,
    user: User,
    ownerID: string,
    type: string,
    isRegistered?: boolean,
    alias?: string,
}
export interface Alias {
    id: string,
    ownerID: string,
    alias?: string,
}

export async function CreateNewRole({ getParams, type, user, admin }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, type: string, user: User, admin: string }) {
    let role = null
    await getParams({
        func: async (param: string | User) => {
            const token = param as string
            const roleID = await FetchInformationPost(token, user.id, [user.id + '_role_' + type], "Temp", [1])
            await FetchOwnerPost(token, roleID, user.id)
            const ownerID = await FetchOwnerGet(token, roleID)
            await FetchInformationPut(token, user.id, roleID, ownerID)
            await FetchOwnerPut(token, roleID + 'viewer', roleID, admin, false, false, true)
            await FetchInformationPost(token, roleID, [type + 'member'], roleID, [1])
            await FetchInformationPost(token, roleID, [roleID + 'user'], user.id, [1])
            await FetchInformationPost(token, roleID, [roleID + 'userowner'], user.user, [1])
            await FetchInformationPost(token, roleID, [roleID + 'owner'], ownerID, [1])
            role = { roleID: roleID, user: user, ownerID: ownerID, type: type } as Role
        }, type: 'token', show: false
    })
    return role as unknown as Role
}

export async function GetRole({ getParams, type, user }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, type: string, user: User }) {

    return await getParams({
        func: async (param: string | User) => {
            const token = param as string
            const output1 = await FetchInformationGetAll("string", token, user.id + '_role_' + type) as unknown as StringOutput[]
            if (output1.length > 0) {
                const output2 = await FetchInformationGetAll("string", token, output1[0].id + 'alias') as unknown as StringOutput[]
                if (output2.length > 0)
                    return { roleID: output2[0].output, user: user, ownerID: 'alias', type: type, isRegistered: true } as Role
                return { roleID: output1[0].id, user: user, ownerID: output1[0].output, type: type, isRegistered: await FetchOwnerGet(token, output1[0].id + 'common') != null } as Role
            }
        }, type: 'token', show: false
    }) as Role
}

export async function CreateRole({ getParams, type, user, admin }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, type: string, user: User, admin: string }) {
    const role = await GetRole({ getParams, type, user })
    if (role != null)
        return role
    return await CreateNewRole({ getParams, type, user, admin })
}

export async function CreateNewAdminRole({ getParams, type, user }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, type: string, user: User }) {
    let role = null
    await getParams({
        func: async (param: string | User) => {
            const token = param as string
            const roleID = await FetchInformationPost(token, user.id, [user.id + '_adminrole_' + type], "Temp", [1])
            await FetchOwnerPost(token, roleID, user.id)
            const ownerID = await FetchOwnerGet(token, roleID)
            await FetchInformationPut(token, user.id, roleID, ownerID)
            await FetchOwnerPost(token, roleID + 'channel', user.id)
            await FetchOwnerPost(token, roleID + 'group', user.id)
            await FetchOwnerPost(token, roleID + 'groupchannel', user.id)
            const groupID = await FetchOwnerGet(token, roleID + 'group')
            await FetchOwnerPut(token, roleID + 'groupchannel_viewer', roleID + 'groupchannel', groupID, false, false, true)
            role = { roleID: roleID, user: user, ownerID: ownerID, type: type } as Role
        }, type: 'token', show: false
    })
    return role as unknown as Role
}

export async function GetAdminRole({ getParams, type, user }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, type: string, user: User }) {

    let role = null
    await getParams({
        func: async (param: string | User) => {
            const token = param as string
            const output = await FetchInformationGetAll("string", token, user.id + '_adminrole_' + type) as unknown as StringOutput[]
            if (output.length > 0) {
                role = { roleID: output[0].id, user: user, ownerID: output[0].output, type: type } as Role
                if (await FetchOwnerGet(token, role.roleID + 'groupchannel') == null) {
                    await FetchOwnerPost(token, role.roleID + 'groupchannel', user.id)
                    const groupID = await FetchOwnerGet(token, role.roleID + 'group')
                    await FetchOwnerPut(token, role.roleID + 'groupchannel_viewer', role.roleID + 'groupchannel', groupID, false, false, true)
                }
            }
        }, type: 'token', show: false
    })
    return role
}

export async function CreateAdminRole({ getParams, type, user }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, type: string, user: User }) {
    const role = await GetAdminRole({ getParams, type, user })
    if (role != null)
        return role
    return await CreateNewAdminRole({ getParams, type, user })
}

export async function GetMembers({ getParams, type }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, type: string }) {

    return await getParams({
        func: async (param: string | User) => {
            const token = param as string
            return await Promise.all(((await FetchInformationGetAll('string', token, type + 'member')) as unknown as StringOutput[]).map(async (member) => ({
                roleID: member.output,
                ownerID: ((await FetchInformationGetAll('string', token, member.output + 'owner')) as unknown as StringOutput[])[0]?.output,
                user: { id: ((await FetchInformationGetAll('string', token, member.output + 'user')) as unknown as StringOutput[])[0]?.output, user: ((await FetchInformationGetAll('string', token, member.output + 'userowner')) as unknown as StringOutput[])[0]?.output },
                type: type,
                isRegistered: await FetchOwnerGet(token, member.output + 'common') != null,
                alias: ((await FetchInformationGetAll('string', token, member.output + 'alias')) as unknown as StringOutput[])[0]?.output,
            } as Role)))
        }, type: 'token', show: false
    }) as Role[]
}

export async function GetAliases({ getParams, adminID }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, adminID: string }) {

    return await getParams({
        func: async (param: string | User) => {
            const token = param as string
            return await Promise.all(((await FetchInformationGetAll('string', token, adminID + 'alias')) as unknown as StringOutput[]).map(async (alias) => (
                {
                    id: alias.id,
                    ownerID: alias.output,
                    alias: ((await FetchInformationGetAll('string', token, alias.id + 'alias')) as unknown as StringOutput[])[0]?.output
                } as Alias)))
        }, type: 'token', show: false
    }) as Alias[]
}

export async function RegisterRole({ getParams, admin, role }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, admin: Role, role: Role }) {
    await getParams({
        func: async (param: string | User) => {
            const token = param as string
            await FetchOwnerPut(token, role.roleID + 'channel', admin.roleID + 'channel', role.ownerID, false, false, true)
            await FetchOwnerPut(token, role.roleID + 'group', admin.roleID + 'group', role.ownerID, true, true, true)
            await FetchOwnerPost(token, role.roleID, admin.roleID)
            await FetchOwnerPut(token, role.roleID + 'viewer', role.roleID, role.ownerID, false, false, true)
            await FetchOwnerPost(token, role.roleID + 'common', admin.roleID)
            await FetchOwnerPut(token, role.roleID + 'common', role.roleID + 'common', role.ownerID, true, true, true)
        }, type: 'token', show: false
    })
}

export async function RegisterAliasRole({ getParams, admin }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, admin: Role }) {
    return await getParams({
        func: async (param: string | User) => {
            const token = param as string
            const roleID = await FetchInformationPost(token, admin.roleID, [admin.roleID + 'alias'], "Temp", [1])
            await FetchOwnerPost(token, roleID, admin.roleID)
            const ownerID = await FetchOwnerGet(token, roleID)
            await FetchInformationPut(token, admin.roleID, roleID, ownerID)
            await FetchOwnerPut(token, roleID + 'viewer', admin.roleID, ownerID, false, false, true)
            await FetchOwnerPut(token, roleID + 'channel', admin.roleID + 'channel', ownerID, false, false, true)
            const group = (await FetchOwnerPut(token, roleID + 'group', admin.roleID + 'group', ownerID, true, true, true)) as PutOwnerOutput
            await FetchOwnerPost(token, roleID + 'groupchannel', roleID)
            await FetchOwnerPut(token, roleID + 'groupchannel_viewer', roleID + 'groupchannel', group.id, false, false, true)
            await FetchOwnerPost(token, roleID + 'common', admin.roleID)
            await FetchOwnerPut(token, roleID + 'common', roleID + 'common', ownerID, true, true, true)
            return { id: roleID, ownerID: ownerID } as Alias
        }, type: 'token', show: false
    }) as Alias
}

export async function ConnectAliasRole({ getParams, role, alias }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, role: Role, alias: Alias }) {
    return await getParams({
        func: async (param: string | User) => {
            const token = param as string
            await FetchInformationPost(token, alias.id, [role.roleID + 'alias'], alias.id, [1])
            await FetchOwnerPut(token, alias.id, alias.id, role.ownerID, true, true, true)
        }, type: 'token', show: false
    }) as Alias
}
