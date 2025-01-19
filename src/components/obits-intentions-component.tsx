import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import ObitIntentionsElement from "./obit-intentions-component";

interface IObit {
    id: string,
    name: string
}

export default function ObitsIntentionsElement() {
    const token = "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U"
    const [obits, setObits] = useState<IObit[]>([])

    useEffect(() => {
        (async function () {
            try {
                if (token !== undefined) {
                    const fetchedObits = await FetchInformationGetAll('string', token, 'obit') as StringOutput[];
                    const sortedObits = fetchedObits.map(p => ({ id: p.id, name: p.output })).sort((a, b) => a.name.localeCompare(b.name));
                    setObits(sortedObits);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token]);


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