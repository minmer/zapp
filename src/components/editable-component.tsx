import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "./loading-component";
import { FetchGet, FetchGetAll, NumberOutput, StringOutput } from "../features/FetchGet";

export default function EditableElement({ name, type }: { name: string, type: string }) {
    const { token } = useParams();
    const [masses, setMasses] = useState<IMass[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState()

    useEffect(
        () => {
            (async function () {
                try {
                    if (token !== undefined) {
                        setIsLoading(true)
                        setMasses([])
                        const massData = await FetchGetAll('integer', token, name) as unknown as NumberOutput[]
                        setIsLoading(false)
                        setMasses(tempMasses)
                    }
                } catch (e) {
                    console.error(e);
                }
            })();
        }, [token, start, end])

    return (

        <>
            <div>
                <div style=
                    {{
                        display: intention.celebrator ? 'inline' : 'none',
                    }}>
                    {intention.celebrator}
                </div>
                <input type="text"
                    value={ }
                    onChange={(e) => setEnd(new Date(e.target.value))} />
            </div>
        </>
    );
}