import { ChangeEvent, useEffect, useState } from "react";
import LoadingComponent from "./loading-component";
import { FetchInformationGetAll} from "../features/FetchInformationGet";
import { FetchInformationDelete } from "../features/FetchInformationDelete";
import { FetchInformationPost } from "../features/FetchInformationPost";
import { FetchInformationPut } from "../features/FetchInformationPut";

export interface IOutput {
    id: string,
    output: number | string | boolean,
}
export default function EditableElement({ getParams, name, type, multiple, dbkey, description, showdescription }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, name: string, type: string, multiple: boolean, dbkey: string, description?: string, showdescription?: boolean }) {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<IOutput[]>([])
    const [newData, setNewData] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    useEffect(
        () => {
            getParams({
                func: async (param: unknown) => {
                    const token = param as string
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
                }, type: 'token', show: false
            });
        }, [getParams, type, name])

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

        getParams({
            func: async (param: unknown) => {
                const token = param as string
                FetchInformationDelete(token ?? '', dbkey, id)
                setData(data.filter(item => item.id !== id))
            }, type: 'token', show: false
        })
    }

    const AddData = async () => {
        if (newData != '') {
            getParams({
                func: async (param: unknown) => {
                    const token = param as string
                    setIsLoading(true)
                    await FetchInformationPost(token ?? '', dbkey, [name], newData, [0])
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
                }, type: 'token', show: false
            })
        }
    }

    const RefreshData = (id: string) => {
        getParams({
            func: async (param: unknown) => {
                const token = param as string
                await FetchInformationPut(token, dbkey, id, data.find(item => item.id == id)?.output ?? '')
            }, type: 'token', show: false
        })
        setIsEditing(false)
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
                        <div onDoubleClick={onClickData}>
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
                            onChange={onChangeNewData}
                            onBlur={AddData} />
                        <input type="button" value='Zapisz' onClick={AddData} />
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