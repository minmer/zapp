import { FetchInformationPost } from "../features/FetchInformationPost"
import { FetchInformationPut } from "../features/FetchInformationPut"
import { FetchOwnerGet } from "../features/FetchOwnerGet"
import { FetchOwnerPost } from "../features/FetchOwnerPost"

export interface User {
    id: string,
    user: string,
}

export async function CreateNewUser({ getParams, }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    let user = null
    getParams({
        func: async (param: unknown) => {
            const token = param as string
            const informationID = await FetchInformationPost(token, "token_key_" + token, ["user"], "Temp", [1])
            await FetchOwnerPost(token, informationID, "token_key_" + token)
            const ownerID = await FetchOwnerGet(token, informationID)
            await FetchInformationPut(token, "token_key_" + token, informationID, ownerID)
            user = { id: informationID, user: ownerID };
        }, type: 'token', show: false
    })
    return user as unknown as User
}

export async function CreateNewUserInformation({ getParams, name }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, name: string }) {
    getParams({
        func: async (param0: unknown) => {
            getParams({
                func: async (param1: unknown) => {
                    const token = param0 as string
                    const user = param1 as User
                    if (await FetchOwnerGet(token, user.id + name) == null)
                        await FetchOwnerPost(token, user.id + name, user.id)
                }, type: 'user', show: false
            })
        }, type: 'token', show: false
    })
}