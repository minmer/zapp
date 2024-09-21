import { useCallback, useEffect, useRef, useState } from "react";
import { DateOutput, FetchInformationGet, FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import { FetchInformationPost } from "../features/FetchInformationPost";
import { FetchInformationDelete } from "../features/FetchInformationDelete";
import { FetchContextPost } from "../features/FetchContextPost";

export interface Message {
    id: string,
    textID: string,
    date: Date,
    text: string,
    writer: string,
}
export default function ChatElement({ getParams, name, viewer, writer }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, name: string, viewer: string, writer?: string }) {
    const [messages, setMessages] = useState([] as Message[])
    const [scroll, setScroll] = useState(0)
    const root = useRef(null);
    const [message, setMessage] = useState('')
    const [endDate, setEndDate] = useState(new Date())
    const [loadingCount, setLoadingCount] = useState(25)
    const [startDate, setStartDate] = useState(new Date())

    useEffect(
        () => {
            ((root.current) as unknown as HTMLDivElement).scrollTop = scroll
        }, [scroll])


    const LoadData = useCallback(async (date: Date) => {
        await getParams({
            func: async (token: unknown) => {
                let newMessages = (await Promise.all((await FetchInformationGet('datetime', token as string, name, date.getTime(), date.getTime() + 86400000, viewer) as unknown as DateOutput[]).map(async (item) => {
                    const textData = await FetchInformationGetAll('string', token as string, item.id + 'text') as unknown as StringOutput[]
                    return { id: item.id, date: item.output, textID: textData[0].id, text: textData[0].output, writer: (await FetchInformationGetAll('string', token as string, item.id + 'writer') as unknown as StringOutput[])[0]?.output } as Message
                })) as Message[])
                console.log(newMessages)
                newMessages = newMessages.filter((item) => messages.find((opt) => opt.id == item.id) == null)
                console.log(newMessages)
                if (newMessages.length > 0) {
                    setMessages([...messages, ...newMessages].sort((a, b) => a.date.getTime() - b.date.getTime()))
                }
            }, type: 'token', show: true
        });
    }, [getParams, name, viewer, messages])

    useEffect(
        () => {
            const date = new Date(Date.now())
            date.setHours(0, 0, 0, 0)
            setEndDate(date)
        }, [])

    useEffect(
        () => {
            LoadData(endDate)
        }, [LoadData, endDate])

    useEffect(
        () => {
        }, [])

    const sendMessage = async () => {
        getParams({
            func: async (param: unknown) => {
                if (message != '') {
                    const token = param as string
                    const creationTime = Date.now()
                    const id = await FetchInformationPost(token, writer ?? '', [name], new Date(creationTime), [creationTime])
                    await FetchContextPost(token, id, viewer, name, creationTime)
                    await FetchInformationPost(token, writer ?? '', [id + 'text'], message, [1])
                    await FetchInformationPost(token, writer ?? '', [id + 'writer'], writer ?? '', [1])
                    await LoadData(startDate)
                    setMessage('')
                    setStartDate(new Date(Date.now()))
                    setScroll(10000)
                }
            }, type: 'token', show: true
        });
    }
    let del = 0;

    const deleteMessage = async (id:string) => {
        del++
        if (del > 3)
            getParams({
                func: async (param: unknown) => {
                    const token = param as string
                    await FetchInformationDelete(token, writer??'', id)
                }, type: 'token', show: true
            });
    }
    
    return (

        <div ref={root} className='chat-element'>
            {messages.map((message) => (
                <div className=
                    {
                        message.writer == writer ? 'own-message' : 'message'
                    } key={message.id} onDoubleClick={() => deleteMessage(message.id)}>
                    {message.text + ' (' + message.date.getHours().toString().padStart(2, '0') + ':' + message.date?.getMinutes().toString().padStart(2, '0')+')'}
                </div>
            ))}
            {writer? writer != '' ? < div >
                <textarea value={message} onChange={(e) => { setMessage(e.target.value) }} />
                <input type='button' value='Wyślij' onClick={sendMessage} />
            </div> : null : null}
        </div>
    );
}