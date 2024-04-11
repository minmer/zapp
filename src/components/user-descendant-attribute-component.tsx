import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchGetAll, StringOutput } from "../features/FetchGet";
import { FetchPost } from "../features/FetchPost";
export default function UserDescendantAttributeElement({ role, attribute, isArray }: { role: string, attribute: string, isArray: boolean }) {
    const { token } = useParams();
    const [value, setValue] = useState<string[]>([])
    const [newValue, setNewValue] = useState("")
    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    setValue((await FetchGetAll('text', token, role + attribute) as unknown as StringOutput[]).map(data => data.output))
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token, role, attribute])


    const createAttribute = async () => {
        await FetchPost("text", token ?? '', 'adminrole_' + role, [role + attribute], newValue, [0])
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