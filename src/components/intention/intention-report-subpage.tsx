import { useState } from "react";
import MonthDateSelectionElement from "../../generals/month-date-selection-element";
import EditableElement from "../../generals/editable-element";
import { User } from "../../structs/user";
export default function IntentionReportSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [start, setStart] = useState<Date | undefined>()
    const [end, setEnd] = useState<Date | undefined>()

    return (

        <>
            <MonthDateSelectionElement onSelectionChange={(_, newStart, newEnd) => { if (newStart?.getTime() != start?.getTime()) setStart(newStart); if (newEnd?.getTime() != end?.getTime()) setEnd(newEnd); console.log(newStart); console.log(newEnd) }} isRange={true} />
            <h2>Msze</h2>
            <EditableElement getParams={getParams} editable={
                {
                    name: 'new_zielonki_mass',
                    type: 'datetime',
                    multiple: true,
                    dbkey: 'new_intention_admin',
                    description: 'Msze',
                    isOrdered: true,
                    display: 'grid',
                    showdescription: true,
                    break: '\n',
                    preorderKey: 'new_intention_viewer',
                    preorderMin: start ?start.getTime(): -1,
                    preorderMax: end ? end.getTime(): -1,
                    children: [
                        {
                            name: 'collective',
                            type: 'checkbox',
                            dbkey: 'new_intention_admin',
                            description: 'Zbiorowa',
                            break: ', ',
                            isOrdered: true,
                            multiple: false,
                            showdescription: true,
                            display: 'single',
                        },
                        {
                            name: 'intention',
                            type: 'string',
                            multiple: true,
                            dbkey: 'new_intention_admin',
                            description: 'Intencje',
                            isOrdered: true,
                            display: 'grid',
                            showdescription: true,
                            break: '\n',
                            children: [
                                {
                                    name: 'donation',
                                    type: 'number',
                                    multiple: false,
                                    description: 'Ofiara',
                                    isOrdered: false,
                                    display: 'single',
                                },
                                {
                                    name: 'donated',
                                    type: 'radio',
                                    multiple: false,
                                    description: 'Przyjmujący',
                                    isOrdered: false,
                                    display: 'single',
                                    options:
                                        [
                                            { value: '2', label: 'ks. Leszek' },
                                            { value: '1', label: 'ks. Proboszcz' },
                                            { value: '0', label: 'ks. Michał' },
                                        ],
                                },
                                {
                                    name: 'celebrator',
                                    type: 'radio',
                                    multiple: false,
                                    description: 'Celebrans',
                                    isOrdered: false,
                                    display: 'single',
                                    options:
                                        [
                                            { value: '5', label: 'ks. Gość 3' },
                                            { value: '4', label: 'ks. Gość 2' },
                                            { value: '3', label: 'ks. Gość 1' },
                                            { value: '0', label: 'ks. Michał' },
                                            { value: '2', label: 'ks. Leszek' },
                                            { value: '1', label: 'ks. Proboszcz' },
                                        ],
                                },],
                        }
                    ],
                }} />
        </>
    );
}