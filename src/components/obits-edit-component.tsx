import { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { FetchGetAll, StringOutput } from "../features/FetchGet";
import { FetchDelete } from "../features/FetchDelete";
import ObitEditElement from "./obit-edit-component";
import { FetchPost } from "../features/FetchPost";

interface IObit {
    id: string,
    name: string
}

export default function ObitsEditElement() {
    const { token } = useParams();
    const [obits, setObits] = useState<IObit[]>([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [name, setName] = useState('')

    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    setIsAdmin(((await FetchGetAll('text', token, 'admin') as []).length == 0 ? false : true))
                    setObits((await FetchGetAll('text', token, 'obit') as StringOutput[]).map(p => ({ id: p.id, name: p.output })  ))
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token])

    const removeObit = async (obit: IObit) => {
        FetchDelete(token ?? '', 'intention_admin', obit.id)
    }

    const createObit = async () => {
        await FetchPost("text", token ?? '', 'intention_admin', ['obit'], name, [obits.length])
    }

    return (
        <>
            <input type="string"
                onChange={(e) => {
                    setName(e.target.value)
                }}
                value={name} />
            <input type="button" onClick={createObit} value="Otwórz zapisy" />
            {obits.map((obit) => (
                <div className="inline-communion-list">
                    <Link to={obit.id}>
                        {obit.name}
                    </Link>
                    <input style=
                        {{
                            display: isAdmin ? 'block' : 'none',
                        }}
                        type="button" onClick={() => { removeObit(obit) }} value='X' />
                </div>
            ))
            }
            <div className="clear" />
            <Routes>
                <Route path="/:obit" element={<ObitEditElement />} />
            </Routes >
        </>
    );
}