import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "./loading-component";
import { FetchGetAll} from "../features/FetchGet";
import { FetchDelete } from "../features/FetchDelete";
import { FetchPost } from "../features/FetchPost";

export interface IOutput {
    id: string,
    output: number | string,
}
export default function EditableElement({ name, type, multiple, dbkey, description }: { name: string, type: string, multiple: boolean, dbkey: string, description?: string }) {
    const { token } = useParams();
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<IOutput[]>([])
    const [newData, setNewData] = useState('')
    const [isEditing, setIsEditing] = useState(false)
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

    useEffect(
        () => {
            if (data.length == 0) {
                setIsEditing(true)
            }else {
                setIsEditing(false)
            }
        }, [data.length])



    const onChangeNewData = (e: ChangeEvent) => {
        if ((type == 'number') || (type == 'text'))
            setNewData((e.target as HTMLInputElement)?.value)
    }

    const onClickData = () => {
        setIsEditing(true)
    }

    const DeleteData = (id: string) => {
        FetchDelete(token ?? '', dbkey, id)
        setData(
            data.filter(item => item.id !== id)
        );
    }

    const AddData = async () => {
        if (token !== undefined) {
            setIsLoading(true)
            if (type == 'number') {
                await FetchPost('integer', token ?? '', dbkey, [name], newData, [0])
            }
            if (type == 'text') {
                await FetchPost('text', token ?? '', dbkey, [name], newData, [0])
            }
            if (type == 'number') {
                setData(await FetchGetAll('integer', token, name) as unknown as IOutput[])
            }
            if (type == 'text') {
                setData(await FetchGetAll('text', token, name) as unknown as IOutput[])
            }
            setIsLoading(false)
        }
    }

    const RefreshData = (id: string) => {
        setIsEditing(false)
        console.log(id)
    }

    const onChangeData = (e: ChangeEvent, id: string) => {
        const refreshedData = data.map(item => {
            if (item.id == id) {
                return {
                    id: id,
                    output: (e.target as HTMLInputElement).value
                }
            } else {
                return item
            }
        })
        setData(refreshedData);
    }


    return (

        <>
            <div>
                <div style=
                    {{
                        display: isEditing ? 'none' : 'block',
                    }}>
                    {data.map(item => (
                        <div onClick={onClickData}>
                            {item.output}
                        </div>
                    ))}
                </div>
                <div style=
                    {{
                        display: isEditing ? 'block' : 'none',
                    }}>
                    {data.map(item => (
                        <div>
                            <input type={type} value={item.output} onChange={(e) => { onChangeData(e, item.id) }} />
                            <input type="button" value='⟳' onClick={() => { RefreshData(item.id) }} />
                            <input type="button" value='X' onClick={() => { DeleteData(item.id) }} />
                        </div>
                    ))}
                    <div style=
                        {{
                            display: multiple || data.length == 0 ? 'block' : 'none',
                        }}>
                        <input type={type}
                            placeholder={description}
                            
                            value={newData}
                            onChange={onChangeNewData} />
                        <input type="button" value='+' onClick={AddData} />
                    </div>
                </div>
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