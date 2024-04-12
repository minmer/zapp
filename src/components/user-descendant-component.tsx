import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchGetAll, StringOutput } from "../features/FetchGet";
import UserDescendantAttributeElement from "./user-descendant-attribute-component";


interface IAttribute {
    name: string,
    isArray: boolean
}
export default function UserDescendantElement({ role, attributes }: { role: string, attributes: IAttribute[]}) {
    const { token } = useParams();
    const [roleToken, setRoleToken] = useState("")
    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    setRoleToken((await FetchGetAll('text', token, 'role_token_' + role, 'adminrole_' + role) as unknown as StringOutput[])[0]?.output)
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token, role])

    return (

        <>
            <div>
                ID: {role}
            </div>
            <div>
                Token: {roleToken}
            </div>
            {attributes.map((attribute) => (
                <UserDescendantAttributeElement role={role} attribute={attribute.name} isArray={attribute.isArray} />
            ))}
        </>
    );
}