import { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import { FetchInformationDelete } from "../features/FetchInformationDelete";
import ObitEditElement from "./obit-edit-component";
import { FetchInformationPost } from "../features/FetchInformationPost";

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
                    setIsAdmin(((await FetchInformationGetAll('string', token, 'admin') as []).length == 0 ? false : true))
                    setObits((await FetchInformationGetAll('string', token, 'obit') as StringOutput[]).map(p => ({ id: p.id, name: p.output })  ))
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token])

    const removeObit = async (obit: IObit) => {
        FetchInformationDelete(token ?? '', 'new_intention_admin', obit.id)
    }

    const createObit = async () => {
        await FetchInformationPost(token ?? '', 'new_intention_admin', ['obit'], name, [obits.length])
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