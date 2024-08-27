import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet"
import { FetchInformationPost } from "../features/FetchInformationPost"
import { FetchInformationPut } from "../features/FetchInformationPut"
import { FetchOwnerGet } from "../features/FetchOwnerGet"
import { FetchOwnerPost } from "../features/FetchOwnerPost"
import { User } from "./user"

export interface Role {
    id: string,
    user: string,
    role: string,
    type: string,
}

export async function CreateNewRole({ getParams, type, user }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, type: string, user: User }) {
    let role = null
    await getParams({
        func: async (param: unknown) => {
            const token = param as string
            const informationID = await FetchInformationPost(token, user.id, [user.id + '_role_'+type], "Temp", [1])
            await FetchOwnerPost(token, informationID, user.id)
            const ownerID = await FetchOwnerGet(token, informationID)
            await FetchInformationPut(token, user.id, informationID, ownerID)
            role = { id: informationID, user: user.id, role: ownerID, type: type } as Role
        }, type: 'token', show: false
    })
    return role
}

export async function GetRole({ getParams, type, user }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, type: string, user: User }) {

    let role = null
    await getParams({
        func: async (param: unknown) => {
            const token = param as string
            const output = await FetchInformationGetAll("string" ,token, user.id + '_role_' + type) as unknown as StringOutput[]
            if (output.length > 0)
                role = { id: output[0].id, user: user.id, role: output[0].output, type: type } as Role
        }, type: 'token', show: false
    })
    return role
}

export async function CreateRole({ getParams, type, user }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, type: string, user: User }) {
    const role = await GetRole({ getParams, type, user })
    if (role != null)
        return role
    return await CreateNewRole({ getParams, type, user })
}
