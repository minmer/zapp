import { useEffect, useState } from "react";
import { LoadMasses, Mass } from "../../structs/mass";
import MonthDateSelectionElement from "../../generals/month-date-selection-element";
import EditableElement from "../../generals/editable-element";
export default function ItentionReportBookSubpage    ({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [masses, setMasses] = useState([] as Mass[])
    const [date, setDate] = useState<Date>()


    useEffect(
        () => {
            if (date != null)
                (async function () {
                    setMasses(await LoadMasses(getParams, date, new Date(date.getTime() + 86400000)))
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
        </>
    );
}