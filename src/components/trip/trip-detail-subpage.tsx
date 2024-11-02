import { useEffect, useState } from "react";
import { User } from "../../structs/user";
import EditableElement from "../../generals/editable-element";
import { useParams } from "react-router-dom";
import { FetchInformationGetAll, NumberOutput, StringOutput } from "../../features/FetchInformationGet";
import { FetchOwnerGet } from "../../features/FetchOwnerGet";
import { FetchInformationPost } from "../../features/FetchInformationPost";
interface Selection {
    description: string,
    id: string,
    amount: number,
    submitted: boolean,
}
interface Part {
    header: string,
    description: string[],
    image: string[],
    image_description: string[],
}
export default function TripDetailSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const { trip } = useParams()
    const [user, setUser] = useState<User | null>()
    const [selections, setSelections] = useState<Selection[]>([])
    const [parts, setParts] = useState<Part[]>([])
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        (async function () {
            setParts(((await Promise.all(((await FetchInformationGetAll('string', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', trip + 'part')) as unknown as StringOutput[]).map(async (item) =>
            ({
                order: (await FetchInformationGetAll('double', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', item.id + 'order') as unknown as NumberOutput[]).map(desc => desc.output)[0] as number,
                header: item.output,
                description: (await Promise.all((await FetchInformationGetAll('string', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', item.id + 'description') as unknown as StringOutput[]).map(async (sub) => ({ output: sub.output, order: (await FetchInformationGetAll('double', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', sub.id + 'order') as unknown as NumberOutput[]).map(desc => desc.output)[0] as number })))).sort((a, b) => a.order - b.order).map(desc => desc.output),
                image: (await Promise.all((await FetchInformationGetAll('string', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', item.id + 'image') as unknown as StringOutput[]).map(async (sub) => ({ output: sub.output, order: (await FetchInformationGetAll('double', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', sub.id + 'order') as unknown as NumberOutput[]).map(desc => desc.output)[0] as number })))).sort((a, b) => a.order - b.order).map(desc => desc.output),
                image_description: (await Promise.all((await FetchInformationGetAll('string', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', item.id + 'image_description') as unknown as StringOutput[]).map(async (sub) => ({ output: sub.output, order: (await FetchInformationGetAll('double', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', sub.id + 'order') as unknown as NumberOutput[]).map(desc => desc.output)[0] as number })))).sort((a, b) => a.order - b.order).map(desc => desc.output),
            })))).sort((a, b) => a.order - b.order) as Part[]))
            await getParams({
                func: async (param0: string | User) => {
                    getParams({
                        func: async (param1: string | User) => {
                            setUser(param1 as User)
                            setSelections(await Promise.all(((await FetchInformationGetAll('string', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', trip + 'selection')) as unknown as StringOutput[]).map(async (item) =>
                            ({
                                id: item.id,
                                description: item.output,
                                amount: (await FetchInformationGetAll('string', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', item.id + 'submission') as unknown as StringOutput[]).length ?? 0,
                                submitted: (await Promise.all((await FetchInformationGetAll('string', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', item.id + 'submission') as unknown as StringOutput[]).map(async (sub) => sub.output == ((await FetchInformationGetAll('string', param0 as string, (param1 as User).user + 'name') as unknown as StringOutput[])[0]?.output + ' ' + (await FetchInformationGetAll('string', param0 as string, (param1 as User).user + 'surname') as unknown as StringOutput[])[0]?.output)))).find(submission => submission) != null,
                            } as Selection))) as Selection[])
                            setIsAdmin(await FetchOwnerGet(param0 as string, 'website_admin') != null)
                        }, type: 'user', show: false
                    });

                }, type: 'token', show: false
            });
        }());
    }, [getParams, trip])



    const addUser = async (id: string) => {
        await getParams({
            func: async (token: string | User) => {
                if (user != null) {
                    const name = (await FetchInformationGetAll('string', token as string, user?.user + 'name') as unknown as StringOutput[])[0]?.output + ' ' + (await FetchInformationGetAll('string', token as string, user?.user + 'surname') as unknown as StringOutput[])[0]?.output
                    await FetchInformationPost('zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', 'website_writer', [id + 'submission'], name, [1]);
                    setSelections(selections.map((item) => {
                        if (item.id != id) return item
                        return {
                            id: item.id,
                            description: item.description,
                            amount: item.amount + 1,
                            submitted: true,
                        }
                    }
                    ))
                }
                }, type: 'token', show: true
            });
    }

    return (
        <div className="trip-detail">
            {parts.map((part) => (
                <div className='trip-parts' key={part.header}>
                    <h2>{part.header}</h2>
                    <div>
                        {part.description.map((_, ind) => (<div key={part.description[ind].slice(0, 32)} className='trip-part'>
                            {part.description[ind].slice(0, part.description[ind].length / 3)}
                            {part.image.length > ind && part.image_description.length > ind ?
                                <span className='trip-image'><img src={part.image[ind]} />
                                    <span>{part.image_description[ind]}</span>
                                </span> : null}
                            {part.description[ind].slice(part.description[ind].length / 3, part.description[ind].length)}
                        </div>))}
                    </div>
                </div>
            ))}
            <h2>Zgłoszenie</h2>
            {user? 
            <div className='trip-submission'>
                <div><span>Na co chcesz zgłosić następującą osobę: </span>
                <EditableElement getParams={getParams} editable={
                    {
                        name: user?.user + 'name',
                        type: 'text',
                        multiple: false,
                        description: 'Imię',
                        dbkey: user?.id + 'name',
                        showdescription: false,
                        display: 'single',
                    }} />
                <span> </span>
                <EditableElement getParams={getParams} editable={
                    {
                        name: user?.user + 'surname',
                        type: 'text',
                        multiple: false,
                        dbkey: user?.id + 'surname',
                        description: 'Nazwisko',
                        showdescription: false,
                        display: 'single',
                    }} />
                </div>
            {selections.map((selection) => (
                <div key={selection.id}>
                    {selection.submitted ? <span>{'Jesteś zgłoszony do: ' + selection.description}</span> : <input type='button' onClick={() => addUser(selection.id)} value={selection.description} />}
                    <span>{' (' + selection.amount + ' osób zgłoszonych)'}</span>
                    {isAdmin ?
                        <div>
                        <EditableElement getParams={getParams} editable={
                            {
                                name: selection.id + 'submission',
                                type: 'string',
                                multiple: true,
                                dbkey: 'website_viewer_viewer',
                                description: 'Zapisani',
                                showdescription: false,
                                display: 'single',
                                break: ', ',
                                }} />
                        </div>
                        : null}
                </div>
            ))}
            </div>
                :
                <div>
                    Aby się zapisać, musisz się zgłosić do ks. Michała (np. w zakrystii) lub napisać mail:
                    <a href='mailto:mleczek_zielonki@outlook.com'>mleczek_zielonki@outlook.com</a>
                    </div>
            }
            <EditableElement getParams={getParams} editable={
                {
                    name: trip + 'part',
                    type: 'string',
                    multiple: true,
                    description: 'Rozdział',
                    dbkey: 'website_admin',
                    showdescription: false,
                    display: 'dropdown',
                    isOrdered: true,
                    children: [
                        {
                            name: 'description',
                            type: 'text',
                            multiple: true,
                            description: 'Opis',
                            display: 'single',
                        },
                        {
                            name: 'image',
                            type: 'string',
                            multiple: true,
                            description: 'Zdjęcie',
                            display: 'single',
                        },
                        {
                            name: 'image_description',
                            type: 'string',
                            multiple: true,
                            description: 'Opis zdjęcia',
                            display: 'single',
                        },
                    ],
                }} />
            <EditableElement getParams={getParams} editable={
                {
                    name: trip + 'selection',
                    type: 'string',
                    multiple: true,
                    description: 'Wybór',
                    dbkey: 'website_admin',
                    showdescription: false,
                    display: 'single',
                    isOrdered: true,
                    break: '\n',
                }} />
        </div>
    );
}