import EditableElement from "../../generals/editable-element";

export default function MinisterEncyclopaediaSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    return (
        <>
            <EditableElement getParams={getParams} editable={
                {
                    name: 'minister_encyclopeadia_section',
                    type: 'string',
                    multiple: true,
                    dbkey: 'website_admin',
                    description: 'Rozdziały',
                    viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                    isOrdered: true,
                    showdescription: false,
                    showchildren: true,
                    children: [
                        {
                            name: 'question',
                            type: 'string',
                            multiple: true,
                            description: 'Pytanie',
                            children: [
                                {
                                    name: 'answer',
                                    type: 'text',
                                    multiple: false,
                                    description: 'Odpowiedź',
                                    showchildren: false,
                                }],
                        }],
                }
            } />
        </>
    );
}