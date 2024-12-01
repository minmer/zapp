import { FetchInformationDelete } from "../features/NewFetchInformationDelete"
import { FetchInformationPost } from "../features/NewFetchInformationPost"
import { FetchInformationPut } from "../features/NewFetchInformationPut"
import { FetchOwnerGet } from "../features/NewFetchOwnerGet"
import { FetchOwnerPost } from "../features/NewFetchOwnerPost"
import { FetchOwnerPut } from "../features/NewFetchOwnerPut"
import { useAuth } from "../generals/permission/AuthContext"
import { Role } from "./role"


export interface User {
    id: string;
    user: string;
    roles: Role[];
}

export async function CreateNewUser() {
    const { token } =  useAuth()
            const informationID = await FetchInformationPost(`token_key_${token}`, ["user"], "Temp", [1]);

            await FetchOwnerPost(informationID, `token_key_${token}`);

            const ownerID = await FetchOwnerGet(informationID);
            await FetchInformationPut(`token_key_${token}`, informationID, ownerID);

            return { id: informationID, user: ownerID, roles: [] };
}

export async function CreateNewUserInformation({ user, name }: { user: User, name: string }) {
    const ownerExists = await FetchOwnerGet(`${user.id}${name}`);
    if (!ownerExists) {
        await FetchOwnerPost(`${user.id}${name}`, user.id);
    }
}

export async function ShareUserInformation({ user, name, sharingID }: { user: User, name: string, sharingID: string }) {
    await FetchOwnerPut(`${sharingID}viewer${user.id}${name}`, `${user.id}${name}`, sharingID, false, false, false);
}

export async function DeleteUser({ user }: { user: User }) {
    const { token } = useAuth()
    await FetchInformationDelete(`token_key_${token}`, user.id);
}
