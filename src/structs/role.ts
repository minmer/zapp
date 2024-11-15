import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet"
import { FetchInformationPost } from "../features/FetchInformationPost"
import { FetchInformationPut } from "../features/FetchInformationPut"
import { FetchOwnerGet } from "../features/FetchOwnerGet"
import { FetchOwnerPost } from "../features/FetchOwnerPost"
import { FetchOwnerPut, PutOwnerOutput } from "../features/FetchOwnerPut"
import { User } from "./user"
import { FetchInformationGetAll as NewFetchInformationGetAll } from "../features/NewFetchInformationGet"
import { FetchInformationPost as NewFetchInformationPost } from "../features/NewFetchInformationPost"
import { FetchInformationPut as NewFetchInformationPut } from "../features/NewFetchInformationPut"
import { FetchOwnerGet as NewFetchOwnerGet } from "../features/NewFetchOwnerGet"
import { FetchOwnerPost as NewFetchOwnerPost } from "../features/NewFetchOwnerPost"
import { FetchOwnerPut as NewFetchOwnerPut } from "../features/NewFetchOwnerPut"

export interface Role {
    roleID: string;
    user: User;
    ownerID: string;
    type: string;
    isRegistered?: boolean;
    alias?: string;
}

export interface Alias {
    id: string;
    ownerID: string;
    alias?: string;
}

// Create a new role associated with a user
export async function CreateNewRole({
    getParams,
    type,
    user,
    admin
}: {
    getParams: ({
        func,
        type,
        show
    }: { func: (p: string | User) => Promise<unknown>; type: string; show: boolean }) => Promise<unknown>;
    type: string;
    user: User;
    admin: string;
}) {
    let role = null;
    await getParams({
        func: async (param: string | User) => {
            const token = param as string;
            const roleID = await NewFetchInformationPost(user.id, [`${user.id}_role_${type}`], "Temp", [1]);

            await NewFetchOwnerPost(roleID, user.id);
            const ownerID = await NewFetchOwnerGet(roleID);

            await NewFetchInformationPut(user.id, roleID, ownerID);
            await FetchOwnerPut(token, `${roleID}viewer`, roleID, admin, false, false, true);

            await NewFetchInformationPost(roleID, [`${type}member`], roleID, [1]);
            await NewFetchInformationPost(roleID, [`${roleID}user`], user.id, [1]);
            await NewFetchInformationPost(roleID, [`${roleID}userowner`], user.user, [1]);
            await NewFetchInformationPost(roleID, [`${roleID}owner`], ownerID, [1]);

            role = { roleID: roleID, user: user, ownerID:ownerID, type: type } as Role;
        },
        type: "token",
        show: false
    });
    return role as Role;
}

// Retrieve an existing role
export async function GetRole({
    getParams,
    type,
    user
}: {
    getParams: ({
        func,
        type,
        show
    }: { func: (p: string | User) => Promise<unknown>; type: string; show: boolean }) => Promise<unknown>;
    type: string;
    user: User;
}) {
    return await getParams({
        func: async (param: string | User) => {
            const token = param as string;
            const output1 = await FetchInformationGetAll("string", token, `${user.id}_role_${type}`) as StringOutput[];

            if (output1.length > 0) {
                const output2 = await FetchInformationGetAll("string", token, `${output1[0].id}alias`) as StringOutput[];

                if (output2.length > 0) {
                    return { roleID: output2[0].output, user, ownerID: "alias", type, isRegistered: true } as Role;
                }

                const isRegistered = await FetchOwnerGet(token, `${output1[0].id}common`) !== null;
                return { roleID: output1[0].id, user, ownerID: output1[0].output, type, isRegistered } as Role;
            }
        },
        type: "token",
        show: false
    }) as Role;
}

// Create or retrieve an existing role
export async function CreateRole({
    getParams,
    type,
    user,
    admin
}: {
    getParams: ({
        func,
        type,
        show
    }: { func: (p: string | User) => Promise<unknown>; type: string; show: boolean }) => Promise<unknown>;
    type: string;
    user: User;
    admin: string;
}) {
    const role = await GetRole({ getParams, type, user });
    return role || CreateNewRole({ getParams, type, user, admin });
}

// Create a new admin role
export async function CreateNewAdminRole({
    getParams,
    type,
    user
}: {
    getParams: ({
        func,
        type,
        show
    }: { func: (p: string | User) => Promise<unknown>; type: string; show: boolean }) => Promise<unknown>;
    type: string;
    user: User;
}) {
    let role = null;
    await getParams({
        func: async (param: string | User) => {
            const token = param as string;
            const roleID = await FetchInformationPost(token, user.id, [`${user.id}_adminrole_${type}`], "Temp", [1]);

            await FetchOwnerPost(token, roleID, user.id);
            const ownerID = await FetchOwnerGet(token, roleID);

            await FetchInformationPut(token, user.id, roleID, ownerID);
            await FetchOwnerPost(token, `${roleID}channel`, user.id);
            await FetchOwnerPost(token, `${roleID}group`, user.id);
            await FetchOwnerPost(token, `${roleID}groupchannel`, user.id);

            const groupID = await FetchOwnerGet(token, `${roleID}group`);
            await FetchOwnerPut(token, `${roleID}groupchannel_viewer`, `${roleID}groupchannel`, groupID, false, false, true);

            role = { roleID, user, ownerID, type } as Role;
        },
        type: "token",
        show: false
    });
    return role as Role;
}

// Retrieve or create an admin role
export async function CreateAdminRole({
    getParams,
    type,
    user
}: {
    getParams: ({
        func,
        type,
        show
    }: { func: (p: string | User) => Promise<unknown>; type: string; show: boolean }) => Promise<unknown>;
    type: string;
    user: User;
}) {
    const role = await GetAdminRole({ getParams, type, user });
    return role || CreateNewAdminRole({ getParams, type, user });
}

// Retrieve an existing admin role
export async function GetAdminRole({
    getParams,
    type,
    user
}: {
    getParams: ({
        func,
        type,
        show
    }: { func: (p: string | User) => Promise<unknown>; type: string; show: boolean }) => Promise<unknown>;
    type: string;
    user: User;
}) {
    let role = null;
    await getParams({
        func: async (param: string | User) => {
            const token = param as string;
            const output = await FetchInformationGetAll("string", token, `${user.id}_adminrole_${type}`) as StringOutput[];

            if (output.length > 0) {
                role = { roleID: output[0].id, user, ownerID: output[0].output, type } as Role;

                // Check if the 'groupchannel' exists for the admin role, create if missing
                if (await FetchOwnerGet(token, `${role.roleID}groupchannel`) == null) {
                    await FetchOwnerPost(token, `${role.roleID}groupchannel`, user.id);
                    const groupID = await FetchOwnerGet(token, `${role.roleID}group`);
                    await FetchOwnerPut(token, `${role.roleID}groupchannel_viewer`, `${role.roleID}groupchannel`, groupID, false, false, true);
                }
            }
        },
        type: "token",
        show: false
    });
    return role;
}


// Fetch registered members
export async function GetMembers({
    getParams,
    type
}: {
    getParams: ({
        func,
        type,
        show
    }: { func: (p: string | User) => Promise<unknown>; type: string; show: boolean }) => Promise<unknown>;
    type: string;
}) {
    return await getParams({
        func: async (param: string | User) => {
            const token = param as string;
            const members = await FetchInformationGetAll("string", token, `${type}member`) as StringOutput[];

            return await Promise.all(members.map(async (member) => ({
                roleID: member.output,
                ownerID: (await FetchInformationGetAll("string", token, `${member.output}owner`))[0]?.output,
                user: {
                    id: (await FetchInformationGetAll("string", token, `${member.output}user`))[0]?.output,
                    user: (await FetchInformationGetAll("string", token, `${member.output}userowner`))[0]?.output
                },
                type,
                isRegistered: await FetchOwnerGet(token, `${member.output}common`) !== null,
                alias: (await FetchInformationGetAll("string", token, `${member.output}alias`))[0]?.output
            })));
        },
        type: "token",
        show: false
    }) as Role[];
}

// Fetch aliases for a specific admin ID
export async function GetAliases({
    getParams,
    adminID
}: {
    getParams: ({
        func,
        type,
        show
    }: { func: (p: string | User) => Promise<unknown>; type: string; show: boolean }) => Promise<unknown>;
    adminID: string;
}) {
    return await getParams({
        func: async (param: string | User) => {
            const token = param as string;
            const aliases = await FetchInformationGetAll("string", token, `${adminID}alias`) as StringOutput[];

            return await Promise.all(aliases.map(async (alias) => ({
                id: alias.id,
                ownerID: alias.output,
                alias: (await FetchInformationGetAll("string", token, `${alias.id}alias`))[0]?.output
            })));
        },
        type: "token",
        show: false
    }) as Alias[];
}

// Register a role with admin access
export async function RegisterRole({
    getParams,
    admin,
    role
}: {
    getParams: ({
        func,
        type,
        show
    }: { func: (p: string | User) => Promise<unknown>; type: string; show: boolean }) => Promise<unknown>;
    admin: Role;
    role: Role;
}) {
    await getParams({
        func: async (param: string | User) => {
            const token = param as string;

            await FetchOwnerPut(token, `${role.roleID}channel`, `${admin.roleID}channel`, role.ownerID, false, false, true);
            await FetchOwnerPut(token, `${role.roleID}group`, `${admin.roleID}group`, role.ownerID, true, true, true);

            await FetchOwnerPost(token, role.roleID, admin.roleID);
            await FetchOwnerPut(token, `${role.roleID}viewer`, role.roleID, role.ownerID, false, false, true);
            await FetchOwnerPost(token, `${role.roleID}common`, admin.roleID);
            await FetchOwnerPut(token, `${role.roleID}common`, `${role.roleID}common`, role.ownerID, true, true, true);
        },
        type: "token",
        show: false
    });
}

// Register an alias role for an admin
export async function RegisterAliasRole({
    getParams,
    admin
}: {
    getParams: ({
        func,
        type,
        show
    }: { func: (p: string | User) => Promise<unknown>; type: string; show: boolean }) => Promise<unknown>;
    admin: Role;
}) {
    return await getParams({
        func: async (param: string | User) => {
            const token = param as string;

            const roleID = await FetchInformationPost(token, admin.roleID, [`${admin.roleID}alias`], "Temp", [1]);
            await FetchOwnerPost(token, roleID, admin.roleID);

            const ownerID = await FetchOwnerGet(token, roleID);
            await FetchInformationPut(token, admin.roleID, roleID, ownerID);

            await FetchOwnerPut(token, `${roleID}viewer`, admin.roleID, ownerID, false, false, true);
            await FetchOwnerPut(token, `${roleID}channel`, `${admin.roleID}channel`, ownerID, false, false, true);

            const group = await FetchOwnerPut(token, `${roleID}group`, `${admin.roleID}group`, ownerID, true, true, true) as PutOwnerOutput;

            await FetchOwnerPost(token, `${roleID}groupchannel`, roleID);
            await FetchOwnerPut(token, `${roleID}groupchannel_viewer`, `${roleID}groupchannel`, group.id, false, false, true);

            await FetchOwnerPost(token, `${roleID}common`, admin.roleID);
            await FetchOwnerPut(token, `${roleID}common`, `${roleID}common`, ownerID, true, true, true);

            return { id: roleID, ownerID } as Alias;
        },
        type: "token",
        show: false
    }) as Alias;
}

// Connect an alias role to a specific role
export async function ConnectAliasRole({
    getParams,
    role,
    alias
}: {
    getParams: ({
        func,
        type,
        show
    }: { func: (p: string | User) => Promise<unknown>; type: string; show: boolean }) => Promise<unknown>;
    role: Role;
    alias: Alias;
}) {
    return await getParams({
        func: async (param: string | User) => {
            const token = param as string;

            await FetchInformationPost(token, alias.id, [`${role.roleID}alias`], alias.id, [1]);
            await FetchOwnerPut(token, alias.id, alias.id, role.ownerID, true, true, true);
        },
        type: "token",
        show: false
    }) as Alias;
}
