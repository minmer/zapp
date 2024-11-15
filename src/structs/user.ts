import { FetchInformationDelete } from "../features/FetchInformationDelete"
import { FetchInformationPost } from "../features/FetchInformationPost"
import { FetchInformationPut } from "../features/FetchInformationPut"
import { FetchOwnerGet } from "../features/FetchOwnerGet"
import { FetchOwnerPost } from "../features/FetchOwnerPost"
import { FetchOwnerPut } from "../features/FetchOwnerPut"

export interface User {
    id: string;
    user: string;
}

export async function CreateNewUser({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    let user: User | null = null;

    await getParams({
        func: async (param: string | User) => {
            const token = param as string;
            const informationID = await FetchInformationPost(token, `token_key_${token}`, ["user"], "Temp", [1]);

            await FetchOwnerPost(token, informationID, `token_key_${token}`);

            const ownerID = await FetchOwnerGet(token, informationID);
            await FetchInformationPut(token, `token_key_${token}`, informationID, ownerID);

            user = { id: informationID, user: ownerID };
        },
        type: 'token',
        show: false,
    });

    return user as User;
}

export async function CreateNewUserInformation({ getParams, user, name }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, user: User, name: string }) {
    await getParams({
        func: async (param: string | User) => {
            const token = param as string;

            // Create owner if it doesn't already exist
            const ownerExists = await FetchOwnerGet(token, `${user.id}${name}`);
            if (!ownerExists) {
                await FetchOwnerPost(token, `${user.id}${name}`, user.id);
            }
        },
        type: 'token',
        show: false,
    });
}

export async function ShareUserInformation({ getParams, user, name, sharingID }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, user: User, name: string, sharingID: string }) {
    await getParams({
        func: async (param: string | User) => {
            const token = param as string;
            await FetchOwnerPut(token, `${sharingID}viewer${user.id}${name}`, `${user.id}${name}`, sharingID, false, false, false);
        },
        type: 'token',
        show: false,
    });
}

export async function DeleteUser({ getParams, user }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, user: User }) {
    await getParams({
        func: async (param: string | User) => {
            const token = param as string;
            await FetchInformationDelete(token, `token_key_${token}`, user.id);
        },
        type: 'token',
        show: false,
    });
}
