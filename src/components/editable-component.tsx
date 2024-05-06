import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "./loading-component";
import { FetchGetAll} from "../features/FetchGet";

export interface IOutput {
    id: string,
    output: number | string,
}
export default function EditableElement({ name, type, multiple }: { name: string, type: string, multiple: boolean }) {
    const { token } = useParams();
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<IOutput[]>([])
    const [newData, setNewData] = useState('')
    console.log(multiple)


    useEffect(
        () => {
            (async function () {
                try {
                    if (token !== undefined) {
                        setIsLoading(true)
                        if (type == 'number') {
                            setData(await FetchGetAll('integer', token, name) as unknown as IOutput[])
                        }
                        if (type == 'text') {
                            setData(await FetchGetAll('text', token, name) as unknown as IOutput[])
                        }
                        setIsLoading(false)
                    }
                } catch (e) {
                    console.error(e);
                }
            })();
        }, [token, type, name])

    const onChangeData = (e: ChangeEvent) => {
        if ((type == 'number') || (type == 'text'))
            setNewData((e.target as HTMLInputElement)?.value)
    }


    return (

        <>
            <div>
                <div style=
                    {{
                        display: data.length > 0 ? 'block' : 'none',
                    }}>
                    {data.map(item => (
                        <div>
                            {item.output}
                        </div>
                    ))}
                </div>
                <input type={type}
                    value={newData}
                    onChange={onChangeData}
                    style=
                    {{
                        display: data.length > 0 ? 'none' : 'block',
                    }} />
                <div className="loadingcontainer" style=
                    {{
                        display: isLoading ? 'block' : 'none',
                    }}>
                    <LoadingComponent />
                </div>
            </div>
        </>
    );
}