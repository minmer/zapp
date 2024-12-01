import { useEffect, useState } from "react";
import {
    Alias,
    ConnectAliasRole,
    GetAdminRole,
    GetAliases,
    GetMembers,
    RegisterAliasRole,
    Role
} from "../../structs/role";
import { useAuth } from "../../generals/permission/AuthContext";
import { FetchInformationDelete } from "../../features/NewFetchInformationDelete";
import EditableElement from "../../generals/editable-element";
import EditableDisplay from "../../generals/editable/EditableDisplay";

export default function ConfirmationAdminSubpage() {
    const { user, isAuthenticated } = useAuth();
    const [role, setRole] = useState<Role | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [members, setMembers] = useState<Role[]>([]);
    const [aliases, setAliases] = useState<Alias[]>([]);

    useEffect(() => {
        async function loadRoleAndMembers() {
            if (!user || !isAuthenticated) return;

            const roleData = await GetAdminRole({ type: "confirmation", user });
            const membersData = await GetMembers({ type: "confirmation" });
            setRole(roleData);
            setMembers(membersData);
        }
        loadRoleAndMembers();
    }, [user, isAuthenticated]);

    useEffect(() => {
        async function loadAliases() {
            if (role) {
                const aliasData = await GetAliases({ adminID: role.roleID });
                setAliases(aliasData.sort((a, b) => (a.alias?.localeCompare(b.alias ?? "") ?? 0)));
            }
        }
        loadAliases();
    }, [role]);

    const reloadMembers = async () => {
        const membersData = await GetMembers({ type: "confirmation" });
        setMembers(membersData);
    };

    const addAlias = async () => {
        if (role) {
            const newAlias = await RegisterAliasRole({ admin: role });
            if (newAlias) setAliases([...aliases, newAlias]);
        }
    };

    const acceptMember = (member: Role) => setSelectedRole(member);

    const connectAlias = async (alias: Alias) => {
        if (selectedRole) {
            await ConnectAliasRole({ role: selectedRole, alias });
            reloadMembers(); // Refresh members to reflect alias connection
        }
    };

    const deleteAlias = async (alias: Alias) => {
        if (role) {
            await FetchInformationDelete(role.roleID, alias.id);
            setAliases(aliases.filter((existingAlias) => existingAlias.id !== alias.id));
        }
    };

    return (
        <>
            <div>
                {role ? (
                    <>
                        {role.roleID} -|- {role.ownerID} -|- {role.type} -|- {role.user}
                    </>
                ) : (
                    <p>Loading role information...</p>
                )}
            </div>
            <input type="button" value="Reload" onClick={reloadMembers} />
            {members.map((member) => (
                <div
                    key={member.roleID}
                    style={{
                        backgroundColor: member.roleID === selectedRole?.roleID ? "orange" : undefined,
                        opacity: member.alias ? 0.2 : 1
                    }}
                >
                    <EditableDisplay
                        editableProps={{
                            name: `${member.user.user}name`,
                            type: "text",
                            multiple: false,
                            description: "Imię",
                            dbkey: member.user.id,
                            showdescription: false,
                            display: "single"
                        }}
                    />
                    <EditableDisplay
                        editableProps={{
                            name: `${member.user.user}surname`,
                            type: "text",
                            multiple: false,
                            dbkey: member.user.id,
                            description: "Nazwisko",
                            showdescription: false,
                            display: "single"
                        }}
                    />
                    {!member.isRegistered && (
                        <input type="button" value="Wybierz" onClick={() => acceptMember(member)} />
                    )}
                </div>
            ))}
            {aliases.map((alias) => (
                <div key={alias.id}>
                    <EditableDisplay
                        editableProps={{
                            name: `${alias.id}alias`,
                            type: "text",
                            multiple: false,
                            description: "Alias",
                            dbkey: `${alias.id}groupchannel`,
                            showdescription: false,
                            display: "single"
                        }}
                    />
                    {selectedRole && (
                        <input type="button" value="Connect to alias" onClick={() => connectAlias(alias)} />
                    )}
                    <input type="button" value="Delete" onClick={() => deleteAlias(alias)} />
                </div>
            ))}
            <input type="button" value="Add alias" onClick={addAlias} />
        </>
    );
}
