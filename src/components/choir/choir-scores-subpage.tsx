import EditableElement from "../../generals/editable-element";
import { User } from "../../structs/user";

export default function ChoirScoresSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    return (
        <>
            <EditableElement getParams={getParams} editable={
                {
                        dbkey: 'website_admin',
                        viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                        name: 'choir_scores',
                        type: 'string',
                        multiple: true,
                        description: 'Nazwa',
                        showdescription: false,
                    showchildren: true,
                    isOrdered: true,
                    children: [
                        {
                            name: 'score',
                            type: 'link',
                            multiple: false,
                            description: 'Nuty',
                            showchildren: false,
                            showdescription: true,
                        },
                        {
                            name: 'music',
                            type: 'link',
                            multiple: false,
                            description: 'Wykonanie',
                            showchildren: false,
                            showdescription: true,
                        }],
                }
            } />
        </>
    );
}