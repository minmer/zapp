import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchGetAll, StringOutput } from "../features/FetchGet";
export default function UserDetailElement() {
    const { token, user_id } = useParams();
    const [ group, setGroup ] = useState("Nieznana grupa")
    const [ name, setName ] = useState("Nieznana nazwa")

    useEffect(() => {
        (async function () {
            try {
                if (token !== undefined) {
                    const nameData = await FetchGetAll('text', token, user_id + 'name') as unknown as StringOutput[]
                    setName(nameData[0]?.output ?? "Nieznana nazwa")
                    const groupData = await FetchGetAll('text', token, 'user') as unknown as StringOutput[]
                    setGroup(groupData.find(group => group.id == user_id)?.output ?? "Nieznana grupa")
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token])

    return (
        <>
            <p>Nazwa</p>
            <h5>{name}</h5>
            <p>Grupa</p>
            <h5>{group}</h5>
        </>
    );
}