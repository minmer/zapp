import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
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
            if (token !== undefined) {
            for (let i = 0; i < 5; i++) {
                try {
                    setRoleToken((await FetchInformationGetAll('text', token, 'role_token_' + role) as unknown as StringOutput[])[0]?.output)
                    break;
                } catch (e) {
                    console.error(e);
                }
            }
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