import { useParams } from "react-router-dom";
import UserPermissionElement from "./user-permission-component";
import { useEffect, useState } from "react";
import { FetchGetAll, StringOutput } from "../features/FetchGet";

export default function UserPermissionsElement() {
    const { token } = useParams();
    const [tokenID, setTokenID] = useState<string | undefined>(undefined)
    const permissions = ["intention", "intentionpriest"]
    useEffect(() => {
        (async function () {
            try {
                if (token !== undefined) {
                    const adminData = await FetchGetAll('text', token, 'key_main_token') as unknown as StringOutput[]
                    setTokenID(adminData[0]?.output)
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token])
    return (
        <>
            <div>
                <p>Token: {tokenID}</p>
            </div>
            {permissions.map(permission => (

                <UserPermissionElement permission={permission} />
            )
            )}
        </>
    );
}