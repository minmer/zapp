import { useEffect, useState } from "react";
import { LoadMasses, Mass } from "../../structs/mass";
import MonthDateSelectionElement from "../../generals/month-date-selection-element";
import EditableElement from "../../generals/editable-element";
import { DateOutput, FetchInformationGetAll, StringOutput } from "../../features/FetchInformationGet";
export interface Feast {
    id: string,
    date: Date,
    description: string,
    feast: string,
    color: string,
}
export interface Eastern {
    eastern: Date,
    eastern1: Date,
    eastern2: Date,
}
export interface Issue {
    date: Date,
    type: string,
}
export default function ItentionReportBookSubpage    ({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [masses, setMasses] = useState([] as Mass[])
    const [propEastern, setPropEastern] = useState<Eastern>()
    const [propIssues, setPropIssues] = useState([] as Issue[])
    const [propMasses, setPropMasses] = useState([] as Mass[])
    const [propFeastes, setPropFeastes] = useState([] as Feast[])
    const [date, setDate] = useState<Date>()


    useEffect(
        () => {
            (async function () {
                getParams({
                    func: async (param: unknown) => {
                        const token = param as string
                        setPropFeastes(await Promise.all(((await FetchInformationGetAll('string', token, 'feast_prop')) as unknown as DateOutput[]).map(async (feast) => ({
                            id: feast.id,
                            date: feast.output,
                            description: ((await FetchInformationGetAll('string', token, feast.output + 'description')) as unknown as StringOutput[])[0]?.output,
                            feast: ((await FetchInformationGetAll('string', token, feast.output + 'feast')) as unknown as StringOutput[])[0]?.output,
                            color: ((await FetchInformationGetAll('string', token, feast.output + 'color')) as unknown as StringOutput[])[0]?.output,
                        } as Feast))))
                    }, type: 'token', show: false
                })
            })();
        }, [getParams])

    useEffect(
        () => {
            if (date == null)
                return
            if (propEastern?.eastern?.getFullYear() != date.getFullYear())
                return
            (async function () {
                getParams({
                    func: async (param: unknown) => {
                        const token = param as string
                        setPropFeastes(await Promise.all(((await FetchInformationGetAll('string', token, 'feast_prop')) as unknown as DateOutput[]).map(async (feast) => ({
                            id: feast.id,
                            date: feast.output,
                            description: ((await FetchInformationGetAll('string', token, feast.output + 'description')) as unknown as StringOutput[])[0]?.output,
                            feast: ((await FetchInformationGetAll('string', token, feast.output + 'feast')) as unknown as StringOutput[])[0]?.output,
                            color: ((await FetchInformationGetAll('string', token, feast.output + 'color')) as unknown as StringOutput[])[0]?.output,
                        } as Feast))))
                    }, type: 'token', show: false
                })
            })();
        }, [propEastern, date, getParams])

    useEffect(
        () => {
            if (date != null)
                (async function () {
                    setMasses(await LoadMasses(getParams, date, new Date(date.getTime() + 86400000)))
                    const dateFeast = propFeastes.find((feast) => (feast.date.getDate() == date.getDate()) && (feast.date.getMonth() == date.getMonth()))
                    if (date.getDay() == 0) {
                        setPropMasses([
                            { time: new Date(date.getTime() + 28800000), id: 'prop' },
                            { time: new Date(date.getTime() + 36000000), id: 'prop' },
                            { time: new Date(date.getTime() + 43200000), id: 'prop' },
                            { time: new Date(date.getTime() + 61200000), id: 'prop' },
                        ])
                    }
                    else {
                        if (dateFeast?.feast == '5')
                            setPropMasses([
                                { time: new Date(date.getTime() + 25200000), id: 'prop' },
                                { time: new Date(date.getTime() + 34200000), id: 'prop' },
                                { time: new Date(date.getTime() + 41400000), id: 'prop' },
                                { time: new Date(date.getTime() + 64800000), id: 'prop' },
                            ])
                        else if (dateFeast?.feast == '6')
                            setPropMasses([
                                { time: new Date(date.getTime() + 25200000), id: 'prop' },
                                { time: new Date(date.getTime() + 34200000), id: 'prop' },
                                { time: new Date(date.getTime() + 64800000), id: 'prop' },
                            ])
                        else
                            setPropMasses([
                                { time: new Date(date.getTime() + 25200000), id: 'prop' },
                                { time: new Date(date.getTime() + 64800000), id: 'prop' },
                            ])
                    }
                })();
        }, [date, getParams, propFeastes])
    useEffect(
        () => {
            console.log(masses)
        }, [masses, date])

    return (

        <>
            <EditableElement getParams={getParams} editable={
                {
                    name: 'fest_prop',
                    type: 'date',
                    multiple: true,
                    dbkey: 'website_admin',
                    description: 'Wspomnienia',
                    viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                    isOrdered: true,
                    showdescription: true,
                    showchildren: true,
                    children: [
                        {
                            name: 'description',
                            type: 'string',
                            multiple: false,
                            description: 'Opis',
                            showchildren: false,
                        },
                        {
                            name: 'feast',
                            type: 'radio',
                            multiple: false,
                            description: 'Rodzaj',
                            showchildren: false,
                            options: [
                                { label: 'Uroczystość', value: '0' },
                                { label: 'Święto', value: '1' },
                                { label: 'Wspomnienie obowiązkowe', value: '2' },
                                { label: 'Wspomnienie dowolne', value: '3' },
                                { label: 'Układ niedzielny', value: '4' },
                                { label: 'Układ świąteczny z 16:30', value: '5' },
                                { label: 'Układ świąteczny bez 16:30', value: '6' },
                            ],
                        },
                        {
                            name: 'color',
                            type: 'color',
                            multiple: false,
                            description: 'Kolor',
                            showchildren: false,
                        },
                    ],
                }
            } />

            <EditableElement getParams={getParams} editable={
                {
                    name: 'issue_prop',
                    type: 'date',
                    multiple: true,
                    dbkey: 'website_admin',
                    description: 'Wydarzenie',
                    viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                    isOrdered: true,
                    showdescription: true,
                    showchildren: true,
                    children: [
                        {
                            name: 'description',
                            type: 'string',
                            multiple: false,
                            description: 'Opis',
                            showchildren: false,
                        },
                        {
                            name: 'feast',
                            type: 'radio',
                            multiple: false,
                            description: 'Rodzaj',
                            showchildren: false,
                            options: [
                                { label: 'Co tydzień', value: '0' },
                                { label: 'Raz w miesiącu (licząc od początku)', value: '1' },
                                { label: 'Raz w miesiącu (licząc od końca)', value: '2' },
                            ],
                        },
                        {
                            name: 'color',
                            type: 'color',
                            multiple: false,
                            description: 'Kolor',
                            showchildren: false,
                        },
                    ],
                }
            } />
            <EditableElement getParams={getParams} editable={
                {
                    name: 'eastern_prop',
                    type: 'date',
                    multiple: true,
                    dbkey: 'website_admin',
                    description: 'Wielkanoc',
                    viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                    isOrdered: true,
                    showdescription: true,
                    showchildren: true,
                    children: [
                        {
                            name: 'start_week',
                            type: 'number',
                            multiple: false,
                            description: 'Tydzień po Wielkanocy',
                            showchildren: false,
                        }
                    ],
                }
            } />
            <MonthDateSelectionElement onSelectionChange={(date) => setDate(date)} />
            {masses.map((mass) => (<>
                <div>
                    {mass.time.toTimeString()}
                </div>
            </>))}
            {propMasses.map((mass) => (<>
                <div>
                    {mass.time.toTimeString()}
                </div>
            </>))}
        </>
    );
}