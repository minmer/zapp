import EditableElement from "../../generals/editable-element";
import { User } from "../../structs/user";

export default function ChoirPreparationSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    return (
        <>
            <EditableElement getParams={getParams} editable={
                {
                    dbkey: 'website_admin',
                    viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                    name: 'choir_preparation',
                    type: 'datetime',
                    multiple: true,
                    description: 'Próba',
                    showdescription: false,
                    display: 'dropdown',
                    isOrdered: true,
                    children: [
                        {
                            name: 'header',
                            type: 'string',
                            multiple: false,
                            description: 'Nagłówek',
                            display: 'single',
                        },
                        {
                            name: 'length-',
                            type: 'time',
                            multiple: false,
                            description: 'Długość próby',
                            display: 'single',
                        },
                        {
                            name: 'topics',
                            type: 'string',
                            multiple: true,
                            description: 'Temat',
                            display: 'single',
                            isOrdered: true,
                            break: '\n',
                        }],
                }
            } />
        </>
    );
}