import { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { FetchGetAll, StringOutput } from "../features/FetchGet";
import ObitIntentionsElement from "./obit-intentions-component";

interface IObit {
    id: string,
    name: string
}

export default function ObitsIntentionsElement() {
    const { token } = useParams();
    const [obits, setObits] = useState<IObit[]>([])

    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    setObits((await FetchGetAll('text', token, 'obit') as StringOutput[]).map(p => ({ id: p.id, name: p.output })  ))
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token])

    return (
        <>
            <div className="obits-list-container">
            <div className="obits-list">
                {obits.map((obit) => (
                    <div className="obit-list">
                        <Link to={obit.id}>
                            {obit.name}
                        </Link>
                    </div>
                ))
                }
                </div>
            </div>
            <Routes>
                <Route path="/:obit" element={<ObitIntentionsElement />} />
            </Routes >
        </>
    );
}