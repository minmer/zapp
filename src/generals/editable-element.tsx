import { ChangeEvent, useCallback, useEffect, useState } from "react";
import LoadingComponent from "./loading-component";
import { FetchInformationGetAll, NumberOutput} from "../features/FetchInformationGet";
import { FetchInformationDelete } from "../features/FetchInformationDelete";
import { FetchInformationPost } from "../features/FetchInformationPost";
import { FetchInformationPut } from "../features/FetchInformationPut";
import { Editable } from "../structs/editable";
import { FetchOwnerGet } from "../features/FetchOwnerGet";
import { User } from "../structs/user";

export interface IOutput {
    id: string,
    output: number | string | boolean | Date,
    order?: number
}
export default function EditableElement({ getParams, editable, onChange }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, editable: Editable, viewertoken?: string, showchildren?: boolean, onChange?: (data: IOutput | undefined) => void }) {
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
            let tempData;
            switch (editable.type) {
                case 'number': {
                    tempData = await FetchInformationGetAll('double', token, editable.name) as unknown as IOutput[]
                    break;
                }
                case 'string': {
                    tempData = await FetchInformationGetAll('string', token, editable.name) as unknown as IOutput[]
                    break;
                }
                case 'text': {
                    tempData = await FetchInformationGetAll('string', token, editable.name) as unknown as IOutput[]
                    break;
                }
                case 'checkbox': {
                    tempData = await FetchInformationGetAll('bool', token, editable.name) as unknown as IOutput[]
                    break;
                }
                case 'binary': {
                    tempData = (await FetchInformationGetAll('string', token, editable.name) as unknown as IOutput[]).map((output) => ({ id: output.id, output: (output.output as string).padEnd(editable.options?.length ?? 0, 'O'), order: output.order }))
                    break;
                }
                case 'radio': {
                    tempData = await FetchInformationGetAll('string', token, editable.name) as unknown as IOutput[]
                    break;
                }
                case 'select': {
                    tempData = await FetchInformationGetAll('', token, editable.name) as unknown as IOutput[]
                    break;
                }
                case 'color': {
                    tempData = await FetchInformationGetAll('string', token, editable.name) as unknown as IOutput[]
                    break;
                }
                case 'date': {
                    tempData = await FetchInformationGetAll('datetime', token, editable.name) as unknown as IOutput[]
                    break;
                }
                case 'datetime': {
                    tempData = await FetchInformationGetAll('datetime', token, editable.name) as unknown as IOutput[]
                    break;
                }
                case 'time': {
                    tempData = await FetchInformationGetAll('datetime', token, editable.name) as unknown as IOutput[]
                    break;
                }
                case 'tel': {
                    tempData = await FetchInformationGetAll('string', token, editable.name) as unknown as IOutput[]
                    break;
                }
                case 'link': {
                    tempData = await FetchInformationGetAll('string', token, editable.name) as unknown as IOutput[]
                    break;
                }
                case 'email': {
                    tempData = await FetchInformationGetAll('string', token, editable.name) as unknown as IOutput[]
                    break;
                }
                default: {
                    break;
                }
            }
            if (tempData != null) {
                if (editable.isOrdered) {
                    tempData = await Promise.all(tempData.map(async (item) => ({ id: item.id, output: item.output, order: (await FetchInformationGetAll('double', token, item.id + 'order') as NumberOutput[])[0]?.output ?? 0 })))
                }
                setData(tempData.sort((a, b) => ((a.order ?? 0) - (b.order ?? 0))))
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
                    func: async (token: string | User) => {
                        LoadData(token as string)
                    }, type: 'token', show: true
                });
        }, [getParams, LoadData, editable])


    const ReloadData = () => {
        if (editable.viewertoken != undefined)
            LoadData(editable.viewertoken)
            else
                getParams({
                    func: async (token: string | User) => {
                        LoadData(token as string)
                    }, type: 'token', show: true
                });
        }

    useEffect(
        () => {
            getParams({
                func: async (token: string | User) => {
                    if (await FetchOwnerGet(token as string, editable.dbkey ?? ''))
                        setIsEditable(true)
                }, type: 'token', show: false
            });
        }, [getParams, editable])

    const onClickData = async () => {
        if (isEditable)
            setIsEditing(true)
    }

    const orderChanged = async () => {
        getParams({
            func: async (token: string | User) => {
                LoadData(token as string)
            }, type: 'token', show: false
        })
    }

    const DeleteData = (id: string) => {

        getParams({
            func: async (param: string | User) => {
                const token = param as string
                await FetchInformationDelete(token, editable.dbkey ?? '', id)
                LoadData(token)
            }, type: 'token', show: false
        })
    }

    const AddData = async () => {
        if (newData != undefined) {
            getParams({
                func: async (param: string | User) => {
                    const token = param as string
                    setIsLoading(true)
                    const id = await FetchInformationPost(token, editable.dbkey ?? '', [editable.name], newData, [data.length + 1])
                    if (editable.isOrdered)
                        await FetchInformationPost(token, editable.dbkey ?? '', [id + 'order'], data.length + 1, [1])
                    setNewData(editable.type == 'checkbox' ? false : editable.type == 'date' || editable.type == 'datetime' || editable.type == 'time' ? undefined : '')
                    if (onChange != null)
                        onChange(data.find(item => item.id == id))
                    LoadData(token)
                    setIsEditing(editable.multiple);
                }, type: 'token', show: false
            })
        }
    }

    const RefreshData = (id: string) => {
        getParams({
            func: async (param: string | User) => {
                const token = param as string
                await FetchInformationPut(token, editable.dbkey ?? '', id, data.find(item => item.id == id)?.output ?? '')
                if (onChange != null)
                    onChange(data.find(item => item.id == id))
                LoadData(token)
            }, type: 'token', show: false
        })
    }

    const transformToData = (e: ChangeEvent) => {
        switch (editable.type) {
            case 'number':
                return Number((e.target as HTMLInputElement).value)
            case 'string':
                return (e.target as HTMLInputElement).value
            case 'text':
                return (e.target as HTMLTextAreaElement).value
            case 'checkbox':
                return (e.target as HTMLInputElement).checked == true
            case 'binary':
                {
                    const index = Number((e.target as HTMLInputElement).id.substring(36))
                    const prev = data[0].output as string
                    return prev.substring(0, index) + ((e.target as HTMLInputElement).checked == true ? 'X' : 'O') + prev.substring(index+1)
                }
            case 'radio':
                return editable.options ? editable.options[(e.target as HTMLSelectElement).selectedIndex].value as string ?? '' : '';
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
            case 'link':
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
                        output: transformToData(e),
                        order: item.order
                    }
                else
                    return item
            })
            setData(refreshedData);
        }
        else {
            setNewData(transformToData(e))
        }
    }


    const renderInput = (item?: IOutput) => {
        switch (editable.type) {
            case 'number': {
                return <input type='number' value={(item ? item.output : newData) as number} onChange={(e) => { onChangeData(e, item?.id) } } placeholder={editable.description} />
            }
            case 'string': {
                return <input type='text' value={(item ? item.output : newData) as string} onChange={(e) => { onChangeData(e, item?.id) }} placeholder={editable.description} />
            }
            case 'text': {
                return <textarea value={(item ? item.output : newData) as string} onChange={(e) => { onChangeData(e, item?.id) }} placeholder={editable.description} />
            }
            case 'checkbox': {
                return <input type='checkbox' checked={(item ? item.output : newData) as boolean == true} onChange={(e) => { onChangeData(e, item?.id) }} placeholder={editable.description} />
            }
            case 'binary': {
                if (item != null)
                    return <>{editable.options?.map((option, index) => (<div><label htmlFor={item.id + index}>{option.label + ': '}</label><input key={index} id={item.id + index} type='checkbox' checked={(item.output as string)[index] == 'X'} onChange={(e) => { onChangeData(e, item?.id) }} placeholder={editable.description} /></div>))}</>
                return null
            }
            case 'radio': {
                return <select defaultValue={item ? editable.options?.find((opt) => opt.value == item.output)?.label : undefined} onChange={(e) => { onChangeData(e, item?.id) }}>
                    {editable.options?.map((opt) => (<option>
                        {opt.label}            </option>))}
                </select>
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
            case 'link': {
                return <input type='text' value={(item ? item.output : newData) as string} onChange={(e) => { onChangeData(e, item?.id) }} placeholder={editable.description} />
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
            case 'string': {
                return item.output as string
            }
            case 'checkbox': {
                return (item.output as boolean) ? 'Wybrane' : 'Nie wybrane'
            }
            case 'binary': {
                return item.output as string
            }
            case 'radio': {
                return editable.options?.find((opt) => opt.value == (item.output as string))?.label
            }
            case 'select': {
                return
            }
            case 'color': {
                return item.output as string
            }
            case 'date': {
                return (item.output as Date).getDate().toString().padStart(2, '0') + '.' + ((item.output as Date).getMonth() + 1).toString().padStart(2, '0') + '.' + (item.output as Date)?.getFullYear()
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
            case 'link': {
                return item.output as string
            }
            case 'email': {
                return item.output as string
            }
            default: {
                return ''
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
                            <div className='editable-children' key={item.id}>
                                {expanded == index ?
                                    <>
                                        <div className='editable-span' onDoubleClick={onClickData} onClick={() => { setExpanded(-1) }}>
                                            {'△ ' + (editable.showdescription ? editable.description + ': ' : editable.break ?? '') + convertToString(item)}
                                        </div>
                                        {editable.children?.map(child => (
                                            <div className='editable-children' key={child.name}>
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
                                                            children: child.children,
                                                            options: child.options,
                                                            break: child.break ?? editable.break,
                                                            isOrdered: child.isOrdered ?? editable.isOrdered,
                                                        }
                                                    } />
                                            </div>
                                        ))}
                                    </>
                                    :
                                    <>
                                        <div className='editable-span' onDoubleClick={onClickData} onClick={() => { setExpanded(index) }} >
                                            {'▽ ' + (editable.showdescription ? editable.description + ': ' : editable.break ?? '') + convertToString(item)}
                                        </div>
                                    </>
                                }
                            </div>
                        ))}
                    </>
                    :
                    <span className='editable'>
                        {data.map((item, index) => (
                            editable.type == 'link' ?
                                <span className='editable-span' key={item.id} onDoubleClick={onClickData}>
                                    <span>{((index == 0 ? editable.showdescription ? editable.description + ': ' : '' : editable.break ?? ''))}</span> <a href={convertToString(item) ?? ''}>
                                        {convertToString(item)}</a>
                                </span>

                                :
                                <span className='editable-span' key={item.id} onDoubleClick={onClickData}>
                                    <span>{((index == 0 ? editable.showdescription ? editable.description + ': ' : '' : editable.break ?? '')) + convertToString(item)}</span>
                                </span>
                        ))}
                    </span>
            }
            {isEditing ?
                <div className='popup' onClick={(e) => { backgroundClicked(e) }}>
                    <div>
                        {data.map(item => (
                            <div key={item.id} className='editable-input'>
                                {editable.isOrdered ? <EditableElement getParams={getParams} onChange={orderChanged} editable=
                                    {
                                        {
                                            name: item.id + 'order',
                                            type: 'number',
                                            multiple: false,
                                            dbkey: editable.dbkey,
                                            description: 'Order',
                                            showdescription: false,
                                            showchildren: false,
                                        }
                                    } /> : null}
                                {renderInput(item)}
                                <input type="button" value='Zapisz' onClick={() => { RefreshData(item.id) }} />
                                <input type="button" value='Przywróć' onClick={ReloadData} />
                                <input type="button" value='Usuń' onClick={() => { DeleteData(item.id) }} />
                            </div>
                        ))}
                        {editable.multiple || data.length == 0 ?
                            <div className='editable-input'>
                                {renderInput()}
                                <input type="button" value={data.length > 0 ? 'Dodaj' : 'Zapisz'} onClick={AddData} />
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