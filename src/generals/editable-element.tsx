import { ChangeEvent, useCallback, useEffect, useState } from "react";
import LoadingComponent from "./loading-component";
import { FetchInformationGetAll} from "../features/FetchInformationGet";
import { FetchInformationDelete } from "../features/FetchInformationDelete";
import { FetchInformationPost } from "../features/FetchInformationPost";
import { FetchInformationPut } from "../features/FetchInformationPut";
import { Editable } from "../structs/editable";
import { FetchOwnerGet } from "../features/FetchOwnerGet";

export interface IOutput {
    id: string,
    output: number | string | boolean | Date,
}
export default function EditableElement({ getParams, editable }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, editable: Editable, viewertoken?: string, showchildren?: boolean }) {
    const [isLoading, setIsLoading] = useState(true)
    const [expanded, setExpanded] = useState(-1)
    const [data, setData] = useState<IOutput[]>([])
    const [newData, setNewData] = useState<number | string | boolean | Date>()
    const [isEditing, setIsEditing] = useState(false)
    const [isEditable, setIsEditable] = useState(false)


    useEffect(
        () => {
            if (editable.type == 'checkbox') {
                setNewData(false)
            }
            if (editable.type == 'binary') {
                setNewData(''.padEnd(editable.options?.length ?? 0, 'O'))
            }
        },[editable])

    const LoadData = useCallback(async (token: string) => {
        setIsLoading(true)
        switch (editable.type) {
            case 'number': {
                setData(await FetchInformationGetAll('double', token, editable.name) as unknown as IOutput[])
                break;
            }
            case 'text': {
                setData(await FetchInformationGetAll('string', token, editable.name) as unknown as IOutput[])
                break;
            }
            case 'checkbox': {
                setData(await FetchInformationGetAll('bool', token, editable.name) as unknown as IOutput[])
                break;
            }
            case 'binary': {
                setData((await FetchInformationGetAll('string', token, editable.name) as unknown as IOutput[]).map((output) => ({ id: output.id, output: (output.output as string).padEnd(editable.options?.length ?? 0, 'O') })))
                break;
            }
            case 'radio': {
                setData(await FetchInformationGetAll('', token, editable.name) as unknown as IOutput[])
                break;
            }
            case 'select': {
                setData(await FetchInformationGetAll('', token, editable.name) as unknown as IOutput[])
                break;
            }
            case 'color': {
                setData(await FetchInformationGetAll('string', token, editable.name) as unknown as IOutput[])
                break;
            }
            case 'date': {
                setData(await FetchInformationGetAll('datetime', token, editable.name) as unknown as IOutput[])
                break;
            }
            case 'datetime': {
                setData(await FetchInformationGetAll('datetime', token, editable.name) as unknown as IOutput[])
                break;
            }
            case 'time': {
                setData(await FetchInformationGetAll('datetime', token, editable.name) as unknown as IOutput[])
                break;
            }
            case 'tel': {
                setData(await FetchInformationGetAll('string', token, editable.name) as unknown as IOutput[])
                break;
            }
            case 'email': {
                setData(await FetchInformationGetAll('string', token, editable.name) as unknown as IOutput[])
                break;
            }
            default: {
                break;
            }
        }
        setIsLoading(false)
    }, [editable])

    const backgroundClicked = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.currentTarget == e.target)
            setIsEditing(false);
    }


    useEffect(
        () => {
            if (editable.viewertoken != undefined)
                LoadData(editable.viewertoken)
            else
                getParams({
                    func: async (token: unknown) => {
                        LoadData(token as string)
                    }, type: 'token', show: true
                });
        }, [getParams, LoadData, editable])


    const ReloadData = () => {
        if (editable.viewertoken != undefined)
            LoadData(editable.viewertoken)
            else
                getParams({
                    func: async (token: unknown) => {
                        LoadData(token as string)
                    }, type: 'token', show: true
                });
        }


    useEffect(
        () => {
            getParams({
                func: async (token: unknown) => {
                    if (await FetchOwnerGet(token as string, editable.dbkey ?? ''))
                        setIsEditable(true)
                }, type: 'token', show: false
            });
        }, [getParams, editable])

    const onClickData = async () => {
        if (isEditable)
            setIsEditing(true)
    }

    const DeleteData = (id: string) => {

        getParams({
            func: async (param: unknown) => {
                const token = param as string
                await FetchInformationDelete(token, editable.dbkey ?? '', id)
                LoadData(token)
            }, type: 'token', show: false
        })
    }

    const AddData = async () => {
        if (newData != undefined) {
            getParams({
                func: async (param: unknown) => {
                    const token = param as string
                    setIsLoading(true)
                    await FetchInformationPost(token, editable.dbkey ?? '', [editable.name], newData, [1])
                    setNewData(editable.type == 'checkbox' ? false :'')
                    LoadData(token)
                    if (!editable.multiple)
                        setIsEditing(false);
                }, type: 'token', show: false
            })
        }
    }

    const RefreshData = (id: string) => {
        getParams({
            func: async (param: unknown) => {
                const token = param as string
                console.log(editable.dbkey)
                await FetchInformationPut(token, editable.dbkey ?? '', id, data.find(item => item.id == id)?.output ?? '')
                LoadData(token)
            }, type: 'token', show: false
        })
        setIsEditing(false)
    }

    const transformToData = (e: ChangeEvent) => {
        switch (editable.type) {
            case 'number':
                return Number((e.target as HTMLInputElement).value)
            case 'text':
                return (e.target as HTMLInputElement).value
            case 'checkbox':
                return (e.target as HTMLInputElement).checked == true
            case 'binary':
                {
                    const index = Number((e.target as HTMLInputElement).id.substring(36))
                    const prev = data[0].output as string
                    return prev.substring(0, index) + ((e.target as HTMLInputElement).checked == true ? 'X' : 'O') + prev.substring(index+1)
                }
            case 'radio':
                return ''
            case 'select':
                return ''
            case 'color':
                return (e.target as HTMLInputElement).value
            case 'date':
                return new Date((e.target as HTMLInputElement).value)
            case 'datetime':
                return new Date((e.target as HTMLInputElement).value)
            case 'time':
                return new Date('0001-01-01T' + (e.target as HTMLInputElement).value)
            case 'tel':
                return (e.target as HTMLInputElement).value
            case 'email':
                return (e.target as HTMLInputElement).value
            default:
                return ''
        }
    }

    const onChangeData = (e: ChangeEvent, id?: string) => {
        if (id) {

            const refreshedData = data.map(item => {
                if (item.id == id)
                    return {
                        id: item.id,
                        output: transformToData(e)
                    }
                else
                    return item
            })
            setData(refreshedData);
        }
        else
            setNewData(transformToData(e))
    }


    const renderInput = (item?: IOutput) => {
        switch (editable.type) {
            case 'number': {
                return <input type='number' value={(item ? item.output : newData) as number} onChange={(e) => { onChangeData(e, item?.id) } } placeholder={editable.description} />
            }
            case 'text': {
                return <input type='text' value={(item ? item.output : newData) as string} onChange={(e) => { onChangeData(e, item?.id) }} placeholder={editable.description} />
            }
            case 'checkbox': {
                return <input type='checkbox' checked={(item ? item.output : newData) as boolean == true} onChange={(e) => { onChangeData(e, item?.id) }} placeholder={editable.description} />
            }
            case 'binary': {
                if (item != null)
                    return <>{editable.options?.map((option, index) => (<>{option.label + ': '}<input key={index} id={item.id + index} type='checkbox' checked={(item.output as string)[index] == 'X'} onChange={(e) => { onChangeData(e, item?.id) }} placeholder={editable.description} /></>))}</>
                return null
            }
            case 'radio': {
                return
            }
            case 'select': {
                return
            }
            case 'color': {
                return <input type='color' value={(item ? item.output : newData) as string} onChange={(e) => { onChangeData(e, item?.id) }} placeholder={editable.description} />
            }
            case 'date': {
                return <input type="date" value={((item ? item.output : newData) as Date)?.getFullYear().toString().padStart(4, '0') + '-' + (((item ? item.output : newData) as Date)?.getMonth() + 1).toString().padStart(2, '0') + '-' + ((item ? item.output : newData) as Date)?.getDate().toString().padStart(2, '0')} onChange={(e) => { onChangeData(e, item?.id) }} placeholder={editable.description} />
            }
            case 'datetime': {
                return <input type="datetime-local" value={((item ? item.output : newData) as Date)?.toLocaleString('sv')?.replace(' GMT', '')?.substring(0, 16)} onChange={(e) => { onChangeData(e, item?.id) }} placeholder={editable.description} />
            }
            case 'time': {
                return <input type="time" value={((item ? item.output : newData) as Date)?.getHours().toString().padStart(2, '0') + ':' + ((item ? item.output : newData) as Date)?.getMinutes().toString().padStart(2, '0')} onChange={(e) => { onChangeData(e, item?.id) }} placeholder={editable.description} />
            }
            case 'tel': {
                return <input type='tel' value={(item ? item.output : newData) as string} onChange={(e) => { onChangeData(e, item?.id) }} placeholder={editable.description} pattern='[+][0-9]{11}' />
            }
            case 'email': {
                return <input type='email' value={(item ? item.output : newData) as string} onChange={(e) => { onChangeData(e, item?.id) }} placeholder={editable.description} />
            }
            default: {
                break;
            }
        }
    }


    const convertToString = (item: IOutput) => {
        switch (editable.type) {
            case 'number': {
                return (item.output as number).toString()
            }
            case 'text': {
                return item.output as string
            }
            case 'checkbox': {
                return (item.output as boolean) ? 'Wybrane' : 'Nie wybrane'
            }
            case 'binary': {
                return item.output
            }
            case 'radio': {
                return
            }
            case 'select': {
                return
            }
            case 'color': {
                return item.output as string
            }
            case 'date': {
                return (item.output as Date).getDate().toString().padStart(2, '0') + '.' + ((item.output as Date).getMonth() + 1).toString().padStart(2, '0') + '.' + (item.output as Date).getFullYear()
            }
            case 'datetime': {
                return (item.output as Date).getDate().toString().padStart(2, '0') + '.' + ((item.output as Date).getMonth() + 1).toString().padStart(2, '0') + '.' + (item.output as Date).getFullYear() + ' ' + (item.output as Date).getHours().toString().padStart(2, '0') + ':' + (item.output as Date).getMinutes().toString().padStart(2, '0')
            }
            case 'time': {
                return (item.output as Date).getHours().toString().padStart(2, '0') + ':' + (item.output as Date).getMinutes().toString().padStart(2, '0')
            }
            case 'tel': {
                return item.output as string
            }
            case 'email': {
                return item.output as string
            }
            default: {
                break;
            }
        }
    }

    return (

        <>
            {isEditable && data.length == 0 ?
                <input type="button" value={editable.description} onClick={onClickData} />
                :
                editable.showchildren ?
                    <>
                        {data.map((item, index) => (
                            <div className='editable' key={item.id}>
                                {expanded == index ?
                                    <>
                                        <div onDoubleClick={onClickData} onClick={() => { setExpanded(-1) }}>
                                            {'△ ' + (editable.showdescription ? editable.description + ': ' : '') + item.output}
                                        </div>
                                        {editable.children?.map(child => (
                                            <div className='editable-children'>
                                                <EditableElement getParams={getParams} editable=
                                                    {
                                                    {
                                                        name: item.id + child.name,
                                                        type: child.type,
                                                        multiple: child.multiple,
                                                        dbkey: child.dbkey ?? editable.dbkey,
                                                        description: child.description,
                                                        showdescription: child.showdescription ?? editable.showdescription,
                                                        showchildren: child.showchildren ?? editable.showchildren,
                                                        viewertoken: child.viewertoken ?? editable.viewertoken,
                                                        children: child.children
                                                    }
                                                    } />
                                            </div>
                                        ))}
                                    </>
                                    :
                                    <>
                                        <div onDoubleClick={onClickData} onClick={() => { setExpanded(index) }} >
                                            {'▽ ' + (editable.showdescription ? editable.description + ': ' : '') + item.output}
                                        </div>
                                    </>
                                }
                            </div>
                        ))}
                    </>
                    :
                    <>
                        {data.map((item, index) => (
                            <span key={item.id} onDoubleClick={onClickData}>
                                {((index == 0 ? editable.showdescription ? editable.description + ': ' : '' : ' ')) + convertToString(item)}
                            </span>
                        ))}
                    </>
            }
            {isEditing ?
                <div className='popup' onClick={(e) => { backgroundClicked(e) }}>
                    <div>
                        {data.map(item => (
                            <div key={item.id} className='editable-input'>
                                {renderInput(item)}
                                <input type="button" value='Zapisz' onClick={() => { RefreshData(item.id) }} />
                                <input type="button" value='Przywróć' onClick={ReloadData} />
                                <input type="button" value='Usuń' onClick={() => { DeleteData(item.id) }} />
                            </div>
                        ))}
                        {editable.multiple || data.length == 0 ?
                            <div className='editable-input'>
                                {renderInput()}
                                <input type="button" value='Zapisz' onClick={AddData} />
                            </div>
                            : null
                        }
                    </div>
                </div> :
                null
            }
            {isLoading ? <div style=
                {{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0, 
                }}>
                <LoadingComponent />
            </div>
                : null
            }
        </>
    );
}