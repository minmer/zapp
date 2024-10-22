import { useState } from "react";
import MonthDateSelectionElement from "../../generals/month-date-selection-element";
import EditableElement from "../../generals/editable-element";
import { User } from "../../structs/user";
import { AddDaysToDate } from "../helpers/DateComparer";
export default function IntentionEditSubpage    ({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [date, setDate] = useState<Date>()

    return (

        <>
            <MonthDateSelectionElement onSelectionChange={(newDate) => { if (newDate)  setDate(newDate) }} />
            {date ? 
                <>
            <h2>Wydarzenia</h2>
            <EditableElement getParams={getParams} editable={
                {
                    name: 'new_zielonki_date',
                    type: 'string',
                    multiple: true,
                    dbkey: 'new_intention_admin',
                    description: 'Wydarzenia',
                    isOrdered: true,
                    display: 'single',
                    showdescription: true,
                    break: '\n',
                    preorderKey: 'new_intention_admin',
                    preorderMin: date?.getTime(),
                    preorderMax: AddDaysToDate(date, 1).getTime(),
                }
            } />
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
                    preorderMin: date?.getTime(),
                    preorderMax: AddDaysToDate(date, 1).getTime(),
                    children: [
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
                        },
                        {
                            name: 'color',
                            type: 'color',
                            multiple: true,
                            dbkey: 'new_intention_admin',
                            description: 'Kolor',
                            isOrdered: true,
                            display: 'single',
                            showdescription: true,
                            break: ', ',
                        },
                        {
                            name: 'description',
                            type: 'string',
                            multiple: true,
                            dbkey: 'new_intention_admin',
                            description: 'Wspomnienie',
                            isOrdered: true,
                            showdescription: true,
                            display: 'single',
                            break: ', ',
                        },
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
                        }
                    ],
                }} />
            <h2>Spotkania</h2>
            <EditableElement getParams={getParams} editable={
                {
                    name: 'new_zielonki_appointment',
                    type: 'datetime',
                    multiple: true,
                    dbkey: 'new_intention_admin',
                    description: 'Wydarzenia',
                    isOrdered: true,
                    display: 'grid',
                    showdescription: true,
                    break: '\n',
                    preorderKey: 'new_intention_admin',
                    preorderMin: date?.getTime(),
                            preorderMax: AddDaysToDate(date, 1).getTime(),
                            children:
                                [
                                    {
                                        name: 'description',
                                        type: 'string',
                                        multiple: false,
                                        dbkey: 'new_intention_admin',
                                        description: 'Opis',
                                        isOrdered: true,
                                        showdescription: true,
                                        display: 'single',
                                    },
                                ]
                }
            } />
                    </>
            : null}
        </>
    );
}