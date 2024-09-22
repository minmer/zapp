import { useEffect, useState } from "react";
import { LoadMasses, Mass } from "../../structs/mass";
import MonthDateSelectionElement from "../../generals/month-date-selection-element";
import EditableElement from "../../generals/editable-element";
export default function ItentionReportBookSubpage    ({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [masses, setMasses] = useState([] as Mass[])
    const [propMasses, setPropMasses] = useState([] as Mass[])
    const [date, setDate] = useState<Date>()


    useEffect(
        () => {
            if (date != null)
                (async function () {
                    setMasses(await LoadMasses(getParams, date, new Date(date.getTime() + 86400000)))
                    if (date.getDay() == 0) {
                        setPropMasses([
                            { time: new Date(date.getTime() + 28800000), id: 'prop' },
                            { time: new Date(date.getTime() + 36000000), id: 'prop' },
                            { time: new Date(date.getTime() + 43200000), id: 'prop' },
                            { time: new Date(date.getTime() + 61200000), id: 'prop' },
                        ])
                    }
                    else {
                        setPropMasses([
                            { time: new Date(date.getTime() + 25200000), id: 'prop' },
                            { time: new Date(date.getTime() + 64800000), id: 'prop' },
                        ])
                    }
                })();
        }, [date, getParams])
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
                    showdescription: false,
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
                    name: 'eastern_prop',
                    type: 'date',
                    multiple: true,
                    dbkey: 'website_admin',
                    description: 'Wielkanoc',
                    viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                    isOrdered: true,
                    showdescription: false,
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