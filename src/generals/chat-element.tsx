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
    alias: string,
    writer: string,
    preorder: number,
}
export default function ChatElement({ getParams, name, viewer, writer, alias }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, name: string, viewer: string, writer?: string, alias?: string}) {
    const [messages, setMessages] = useState([] as Message[])
    const [scroll, setScroll] = useState(0)
    const root = useRef(null);
    const [message, setMessage] = useState('')
    const [endDate, setEndDate] = useState(new Date())
    const [startDate, setStartDate] = useState(new Date())
    const [newEndDate, setNewEndDate] = useState(new Date())
    const [newStartDate, setNewStartDate] = useState(new Date())
    const [automaticNumber, setAutomaticNumber] = useState(0)
    const [intervalLength, setIntervalLength] = useState(1000)

    useEffect(() => {
        const interval = setInterval(() => {
            console.log(new Date(Date.now()))
            setNewEndDate(new Date(Date.now()))
            setIntervalLength(intervalLength*.95 + 3000)
        }, intervalLength);

        return () => clearInterval(interval);
    }, [intervalLength])

    useEffect(
        () => {
            ((root.current) as unknown as HTMLDivElement).scrollTop = scroll
        }, [scroll])


    const LoadData = useCallback(async (start: Date, end: Date) => {
        await getParams({
            func: async (token: unknown) => {
                let newMessages = (await Promise.all((await FetchInformationGet('datetime', token as string, name, start.getTime(), end.getTime(), viewer) as unknown as DateOutput[]).map(async (item) => {
                    const textData = await FetchInformationGetAll('string', token as string, item.id + 'text') as unknown as StringOutput[]
                    return { preorder: item.preorder, id: item.id, date: item.output, textID: textData[0].id, text: textData[0].output, writer: (await FetchInformationGetAll('string', token as string, item.id + 'writer') as unknown as StringOutput[])[0]?.output, alias: (await FetchInformationGetAll('string', token as string, item.id + 'alias') as unknown as StringOutput[])[0]?.output } as Message
                })) as Message[])
                newMessages = newMessages.filter((item, index0) => messages.find((opt) => opt.id == item.id) == null && newMessages.find((opt, index1) => opt.id == item.id && index0 < index1) == null)
                if (newMessages.length > 0) {
                    setMessages([...messages, ...newMessages].sort((a, b) => a.date.getTime() - b.date.getTime()))
                    setIntervalLength(1000)
                }
            }, type: 'token', show: true
        });
    }, [getParams, name, viewer, messages])

    useEffect(
        () => {
            const date = new Date(Date.now())
            setStartDate(date)
            setEndDate(date)
            setNewStartDate(date)
            setNewEndDate(date)
            setAutomaticNumber(25)
        }, [])
    useEffect(
        () => {
            if (newStartDate.getTime() != startDate.getTime()) {
                LoadData(newStartDate, startDate)
                setStartDate(newStartDate)
            }
        }, [LoadData, newStartDate, startDate])

    useEffect(
        () => {
            if (newEndDate.getTime() != endDate.getTime()) {
                LoadData(endDate, newEndDate)
                setStartDate(newEndDate)
            }
        }, [LoadData, endDate, newEndDate])

    useEffect(
        () => {
            if (automaticNumber > messages.length) {
                setNewStartDate(new Date(newStartDate.getTime() - 86400000))
                setAutomaticNumber(automaticNumber - 1)
            }
        }, [messages, automaticNumber, newStartDate])

    const sendMessage = async () => {
        console.log(writer)
        getParams({
            func: async (param: unknown) => {
                if (message != '' && writer != null) {
                    const token = param as string
                    const creationTime = Date.now()
                    const id = await FetchInformationPost(token, writer, [name], new Date(creationTime), [creationTime])
                    if (writer != viewer)
                        await FetchContextPost(token, id, viewer, name, creationTime)
                    if (alias)
                        await FetchContextPost(token, alias, writer, id + 'alias', 1)
                    await FetchInformationPost(token, writer, [id + 'text'], message, [1])
                    await FetchInformationPost(token, writer, [id + 'writer'], writer ?? '', [1])
                    setNewEndDate(new Date(Date.now()))
                    setMessage('')
                    setStartDate(new Date(Date.now()))
                    setScroll(10000)
                }
            }, type: 'token', show: true
        });
    }
    let del = 0;

    const deleteMessage = async (id: string) => {
        del++
        if (del > 3)
            getParams({
                func: async (param: unknown) => {
                    const token = param as string
                    await FetchInformationDelete(token, writer ?? '', id)
                }, type: 'token', show: true
            });
    }

    const loadPreviousMessage = async () => {
        setAutomaticNumber(messages.length + 25)
    }
    
    return (

        <div ref={root} className='chat-element'>
            <input className='loadbutton' type='button' value='Załaduj wcześniejsze wiadomości' onClick={loadPreviousMessage} />
            {messages.map((message) => (
                <div className=
                    {
                        message.writer == writer ? 'own-message' : 'message'
                    } key={message.id} onDoubleClick={() => deleteMessage(message.id)}>
                    {message.text + ' (' + message.date.getHours().toString().padStart(2, '0') + ':' + message.date?.getMinutes().toString().padStart(2, '0') + ') - ' + (message.alias ? message.alias: 'ks. Michał')}
                </div>
            ))}
            {writer? writer != '' ? < div >
                <textarea value={message} onChange={(e) => { setMessage(e.target.value) }} />
                <input type='button' value='Wyślij' onClick={sendMessage} />
            </div> : null : null}
        </div>
    );
}