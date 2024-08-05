import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import { FetchInformationPost } from "../features/FetchInformationPost";
export default function UserDescendantAttributeElement({ role, attribute, isArray }: { role: string, attribute: string, isArray: boolean }) {
    const { token } = useParams();
    const [value, setValue] = useState<string[]>([])
    const [newValue, setNewValue] = useState("")
    useEffect(() => {
        (async function () {
            if (token !== undefined) {
                for (let i = 0; i < 5; i++) {
                    try {
                        setValue((await FetchInformationGetAll('text', token, role + attribute) as unknown as StringOutput[]).map(data => data.output))
                        break;
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        })();
    }, [token, role, attribute])


    const createAttribute = async () => {
        await FetchInformationPost(token ?? '', 'adminrole_' + role, [role + attribute], newValue, [0])
        value.push(newValue)
    }

    return (

        <>
            <div>
                {attribute}: {value.map((item) => (
                    <>
                        {item}, 
                    </>
                ))}
                <div style=
                    {{
                        display: value.length > 0 && !isArray ? 'none' : 'block',
                    }}>
                    <input type="string"
                        onChange={(e) => {
                            setNewValue(e.target.value)
                        }}
                        value={newValue} />
                    <input type="button" onClick={createAttribute} value="+" />
                </div>
            </div>
        </>
    );
}