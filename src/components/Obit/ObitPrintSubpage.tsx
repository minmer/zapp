import { useEffect, useState } from "react";
import { FetchInformationGetAll, StringOutput } from "../../features/FetchInformationGet";

interface IObit {
    id: string,
    name: string
}

export default function ObitPrintSubpage() {
    const token = "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U";
    const [obits, setObits] = useState<IObit[]>([]);
    const [selectedObit, setSelectedObit] = useState<string>("");

    useEffect(() => {
        (async function () {
            try {
                if (token !== undefined) {
                    setObits((await FetchInformationGetAll('string', token, 'obit') as StringOutput[]).map(p => ({ id: p.id, name: p.output })));
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token]);

    return (
        <>
            <h1>Druki</h1>
            <ul>
                <li><a href="https://recreatio.eu/#/print/obit" target="_blank" rel="noopener noreferrer">Pusta kartka</a></li>
                <li>
                    <select onChange={(e) => setSelectedObit(e.target.value)} value={selectedObit}>
                        <option value="">Select Obit</option>
                        {obits.map((obit) => (
                            <option key={obit.id} value={obit.id}>{obit.name}</option>
                        ))}
                    </select>
                    {selectedObit && (
                        <a href={`/oficial/${selectedObit}`} target="_blank" rel="noopener noreferrer">Ogłoszone intencje</a>
                    )}
                </li>
                <li>
                    <select onChange={(e) => setSelectedObit(e.target.value)} value={selectedObit}>
                        <option value="">Select Obit</option>
                        {obits.map((obit) => (
                            <option key={obit.id} value={obit.id}>{obit.name}</option>
                        ))}
                    </select>
                    {selectedObit && (
                        <a href={`/all/${selectedObit}`} target="_blank" rel="noopener noreferrer">Wszystkie intencje</a>
                    )}
                </li>
            </ul>
        </>
    );
}
