import { User } from "./user"
import { FetchInformationGetAll as NewFetchInformationGetAll, StringOutput } from "../features/NewFetchInformationGet"
import { FetchInformationPost as NewFetchInformationPost } from "../features/NewFetchInformationPost"
import { FetchInformationPut as NewFetchInformationPut } from "../features/NewFetchInformationPut"
import { FetchOwnerGet as NewFetchOwnerGet } from "../features/NewFetchOwnerGet"
import { FetchOwnerPost as NewFetchOwnerPost } from "../features/NewFetchOwnerPost"
import { FetchOwnerPut as NewFetchOwnerPut, PutOwnerOutput } from "../features/NewFetchOwnerPut"

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
    type,
    user,
    admin
}: {
    type: string;
    user: User;
    admin: string;
}) {
    const roleID = await NewFetchInformationPost(user.id, [`${user.id}_role_${type}`], "Temp", [1]);

    await NewFetchOwnerPost(roleID, user.id);
    const ownerID = await NewFetchOwnerGet(roleID);

    await NewFetchInformationPut(user.id, roleID, ownerID);
    await NewFetchOwnerPut(`${roleID}viewer`, roleID, admin, false, false, true);

    await NewFetchInformationPost(roleID, [`${type}member`], roleID, [1]);
    await NewFetchInformationPost(roleID, [`${roleID}user`], user.id, [1]);
    await NewFetchInformationPost(roleID, [`${roleID}userowner`], user.user, [1]);
    await NewFetchInformationPost(roleID, [`${roleID}owner`], ownerID, [1]);

    return { roleID: roleID, user: user, ownerID:ownerID, type: type } as Role;
}

// Retrieve an existing role
export async function GetRole({
    type,
    user
}: {
    type: string;
    user: User;
    }) {
    if (!user.roles?.some(p => p.type == type)) {

        const output1 = await NewFetchInformationGetAll("string", `${user.id}_role_${type}`) as StringOutput[];

        if (output1.length > 0) {
            const output2 = await NewFetchInformationGetAll("string", `${output1[0].id}alias`) as StringOutput[];

            if (output2.length > 0) {
                return { roleID: output2[0].output, user, ownerID: "alias", type, isRegistered: true } as Role;
            }

            const isRegistered = await NewFetchOwnerGet(`${output1[0].id}common`) !== null;
            user.roles.push({ roleID: output1[0].id, user, ownerID: output1[0].output, type, isRegistered })
        }
    }
    return user.roles.find(p => p.type == type);
}

// Create or retrieve an existing role
export async function CreateRole({
    type,
    user,
    admin
}: {
    type: string;
    user: User;
    admin: string;
}) {
    const role = await GetRole({ type, user });
    return role || CreateNewRole({ type, user, admin });
}

// Create a new admin role
export async function CreateNewAdminRole({
    type,
    user
}: {
    type: string;
    user: User;
}) {
        const roleID = await NewFetchInformationPost(user.id, [`${user.id}_adminrole_${type}`], "Temp", [1]);

        await NewFetchOwnerPost(roleID, user.id);
        const ownerID = await NewFetchOwnerGet(roleID);

        await NewFetchInformationPut(user.id, roleID, ownerID);
        await NewFetchOwnerPost(`${roleID}channel`, user.id);
        await NewFetchOwnerPost(`${roleID}group`, user.id);
        await NewFetchOwnerPost(`${roleID}groupchannel`, user.id);

        const groupID = await NewFetchOwnerGet(`${roleID}group`);
        await NewFetchOwnerPut(`${roleID}groupchannel_viewer`, `${roleID}groupchannel`, groupID, false, false, true);

        return { roleID, user, ownerID, type } as Role;
}

// Retrieve or create an admin role
export async function CreateAdminRole({
    type,
    user
}: {
    type: string;
    user: User;
}) {
    const role = await GetAdminRole({ type, user });
    return role || CreateNewAdminRole({ type, user });
}

// Retrieve an existing admin role
export async function GetAdminRole({
    type,
    user
}: {
    type: string;
    user: User;
}) {
            const output = await NewFetchInformationGetAll("string", `${user.id}_adminrole_${type}`) as StringOutput[];

            if (output.length > 0) {
                return  { roleID: output[0].id, user, ownerID: output[0].output, type } as Role;

            }
    
}


// Fetch registered members
export async function GetMembers({
    type
}: {
    type: string;
}) {
    const members = await NewFetchInformationGetAll("string", `${type}member`) as StringOutput[];

            return await Promise.all(members.map(async (member) => ({
                roleID: member.output,
                ownerID: (await NewFetchInformationGetAll("string", `${member.output}owner`))[0]?.output as string,
                user: {
                    id: (await NewFetchInformationGetAll("string", `${member.output}user`))[0]?.output,
                    user: (await NewFetchInformationGetAll("string", `${member.output}userowner`))[0]?.output
                } as User,
                type,
                isRegistered: await NewFetchOwnerGet(`${member.output}common`) !== null,
                alias: (await NewFetchInformationGetAll("string", `${member.output}alias`))[0]?.output as string
            }))) as Role[];
        
}

// Fetch aliases for a specific admin ID
export async function GetAliases({
    adminID
}: {
    adminID: string;
}) {
        const aliases = await NewFetchInformationGetAll("string", `${adminID}alias`) as StringOutput[];

        return await Promise.all(aliases.map(async (alias) => ({
            id: alias.id,
            ownerID: alias.output,
            alias: (await NewFetchInformationGetAll("string", `${alias.id}alias`))[0]?.output as string
        })));
}

// Register a role with admin access
export async function RegisterRole({
    admin,
    role
}: {
    admin: Role;
    role: Role;
}) {
    await NewFetchOwnerPut(`${role.roleID}channel`, `${admin.roleID}channel`, role.ownerID, false, false, true);
    await NewFetchOwnerPut(`${role.roleID}group`, `${admin.roleID}group`, role.ownerID, true, true, true);

    await NewFetchOwnerPost(role.roleID, admin.roleID);
    await NewFetchOwnerPut(`${role.roleID}viewer`, role.roleID, role.ownerID, false, false, true);
    await NewFetchOwnerPost(`${role.roleID}common`, admin.roleID);
    await NewFetchOwnerPut(`${role.roleID}common`, `${role.roleID}common`, role.ownerID, true, true, true);
}

// Register an alias role for an admin
export async function RegisterAliasRole({
    admin
}: {
    admin: Role;
}) {
    const roleID = await NewFetchInformationPost(admin.roleID, [`${admin.roleID}alias`], "Temp", [1]);
    await NewFetchOwnerPost(roleID, admin.roleID);

    const ownerID = await NewFetchOwnerGet(roleID);
    await NewFetchInformationPut(admin.roleID, roleID, ownerID);

    await NewFetchOwnerPut(`${roleID}viewer`, admin.roleID, ownerID, false, false, true);
    await NewFetchOwnerPut(`${roleID}channel`, `${admin.roleID}channel`, ownerID, false, false, true);

    const group = await NewFetchOwnerPut(`${roleID}group`, `${admin.roleID}group`, ownerID, true, true, true) as PutOwnerOutput;

    await NewFetchOwnerPost(`${roleID}groupchannel`, roleID);
    await NewFetchOwnerPut(`${roleID}groupchannel_viewer`, `${roleID}groupchannel`, group.id, false, false, true);

    await NewFetchOwnerPost(`${roleID}common`, admin.roleID);
    await NewFetchOwnerPut(`${roleID}common`, `${roleID}common`, ownerID, true, true, true);

    return { id: roleID, ownerID } as Alias;
}

// Connect an alias role to a specific role
export async function ConnectAliasRole({
    role,
    alias
}: {
    role: Role;
    alias: Alias;
}) {
    await NewFetchInformationPost(alias.id, [`${role.roleID}alias`], alias.id, [1]);
    await NewFetchOwnerPut(alias.id, alias.id, role.ownerID, true, true, true);
}
