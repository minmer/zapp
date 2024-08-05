import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "./loading-component";
import { FetchInformationGetAll} from "../features/FetchInformationGet";
import { FetchInformationDelete } from "../features/FetchInformationDelete";
import { FetchInformationPost } from "../features/FetchInformationPost";

export interface IOutput {
    id: string,
    output: number | string | boolean,
}
export default function EditableElement({ name, type, multiple, dbkey, description, showdescription }: { name: string, type: string, multiple: boolean, dbkey: string, description?: string, showdescription?: boolean }) {
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
                            setData(await FetchInformationGetAll('double', token, name) as unknown as IOutput[])
                        }
                        if (type == 'text') {
                            setData(await FetchInformationGetAll('string', token, name) as unknown as IOutput[])
                        }
                        if (type == 'checkbox') {
                            setData(await FetchInformationGetAll('bool', token, name) as unknown as IOutput[])
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
        if (type == 'checkbox')
            setNewData((e.target as HTMLInputElement)?.checked.toString())
    }

    const onClickData = () => {
        setIsEditing(true)
    }

    const DeleteData = (id: string) => {
        FetchInformationDelete(token ?? '', dbkey, id)
        setData(
            data.filter(item => item.id !== id)
        );
    }

    const AddData = async () => {
        if (token !== undefined) {
            setIsLoading(true)
            if (type == 'number') {
                await FetchInformationPost(token ?? '', dbkey, [name], newData, [0])
            }
            if (type == 'text') {
                await FetchInformationPost(token ?? '', dbkey, [name], newData, [0])
            }
            if (type == 'checkbox') {
                await FetchInformationPost(token ?? '', dbkey, [name], newData, [0])
            }
            if (type == 'number') {
                setData(await FetchInformationGetAll('double', token, name) as unknown as IOutput[])
            }
            if (type == 'text') {
                setData(await FetchInformationGetAll('string', token, name) as unknown as IOutput[])
            }
            if (type == 'checkbox') {
                setData(await FetchInformationGetAll('bool', token, name) as unknown as IOutput[])
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
            <div style=
                {{
                    position: 'relative',
                }}>
                <div style=
                    {{
                        display: isEditing ? 'none' : 'block',
                    }}>
                    {data.map(item => (
                        <div onClick={onClickData}>
                            {(showdescription ? description + ': ' : '') + item.output}
                        </div>
                    ))}
                </div>
                <div style=
                    {{
                        display: isEditing ? 'block' : 'none',
                    }}>
                    {data.map(item => (
                        <div>
                            <input type={type} value={typeof item.output == 'boolean' ? '' : item.output} checked={typeof item.output == 'boolean' ? item.output : false} onChange={(e) => { onChangeData(e, item.id) }} />
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
                <div style=
                    {{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0, 
                        display: isLoading ? 'block' : 'none',
                    }}>
                    <LoadingComponent />
                </div>
            </div>
        </>
    );
}