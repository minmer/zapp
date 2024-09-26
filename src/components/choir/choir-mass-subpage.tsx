import EditableElement from "../../generals/editable-element";
import { User } from "../../structs/user";

export default function ChoirMassSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    return (
        <>
            <EditableElement getParams={getParams} editable={
                {
                        dbkey: 'website_admin',
                        viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                        name: 'choir_mass',
                        type: 'datetime',
                        multiple: true,
                        description: 'Msze Śpiewane',
                        showdescription: false,
                    showchildren: true,
                    isOrdered: true,
                    children: [
                        {
                            name: 'score0',
                            type: 'string',
                            multiple: false,
                            description: 'Pieśń na wejście',
                            showchildren: false,
                            showdescription: true
                        },
                        {
                            name: 'score1',
                            type: 'string',
                            multiple: false,
                            description: 'Pieśń na przygotowanie darów',
                            showchildren: false,
                            showdescription: true
                        },
                        {
                            name: 'score2',
                            type: 'string',
                            multiple: false,
                            description: 'Pieśń na Komunię',
                            showchildren: false,
                            showdescription: true
                        },
                        {
                            name: 'score3',
                            type: 'string',
                            multiple: false,
                            description: 'Pieśń na uwielbienie',
                            showchildren: false,
                            showdescription: true
                        },
                        {
                            name: 'score4',
                            type: 'string',
                            multiple: false,
                            description: 'Pieśń na zakończenie',
                            showchildren: false,
                            showdescription: true
                        },],
                }
            } />
        </>
    );
}