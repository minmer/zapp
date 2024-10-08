import { useEffect, useState } from "react";
import { DateOutput, FetchInformationGet, FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import { User } from "../structs/user";
import { Message } from "../generals/chat-element";
interface Chat {
    name: string
    viewer?: string
}

export default function UsersWidget({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [chats, setChats] = useState([] as Chat[])
    const [messages, setMessages] = useState([] as Message[])


    useEffect(
        () => {
            getParams({
                func: async (param: string | User) => {
                    const token = param as string
                    setChats(await Promise.all((await FetchInformationGetAll('string', token, 'chat_widget') as StringOutput[]).map(async (item) => (
                        {
                            name: item.output,
                            viewer: (await FetchInformationGetAll('string', token , item.id + 'viewer') as unknown as StringOutput[])[0]?.output
                        }) as Chat
                    )) as Chat[])
                }, type: 'token', show: true
            })
        }, [getParams])

    useEffect(() => {
        (async function () {
        await getParams({
            func: async (token: string | User) => {
                let tempMessages = [] as Message[]
                for (let i = 0; i < chats.length; i++)
                {
                    tempMessages = [...tempMessages, ...(await Promise.all((await FetchInformationGet('datetime', token as string, chats[i].name ?? '', Date.now() - 86400000, Date.now(), chats[i].viewer ?? '') as unknown as DateOutput[]).map(async (item) => {
                    const textData = await FetchInformationGetAll('string', token as string, item.id + 'text') as unknown as StringOutput[]
                    return { preorder: item.preorder, id: item.id, date: item.output, textID: textData[0].id, text: textData[0].output, writer: (await FetchInformationGetAll('string', token as string, item.id + 'writer') as unknown as StringOutput[])[0]?.output, alias: (await FetchInformationGetAll('string', token as string, item.id + 'alias') as unknown as StringOutput[])[0]?.output } as Message
                    })) as Message[])]
                }
                setMessages(tempMessages)
            }, type: 'token', show: true
        });
        })()
    }, [getParams, chats])


    return (
        <div className="chat-widget">
            {messages.map((message) => (
                <div className='message' key={message.id}>
                    {message.text + ' (' + message.date.getHours().toString().padStart(2, '0') + ':' + message.date?.getMinutes().toString().padStart(2, '0') + ') - ' + (message.alias ? message.alias : 'ks. Michał')}
                </div>
            ))}
        </div>
    );
}