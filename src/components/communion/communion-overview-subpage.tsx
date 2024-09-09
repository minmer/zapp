import EditableElement from "../../generals/editable-element";

export default function CommunionOverviewSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    return (
        <>
            <EditableElement getParams={getParams} editable={
                {
                    name: 'communion_information_section',
                    type: 'text',
                    multiple: true,
                    dbkey: 'website_admin',
                    description: 'Rozdziały',
                    viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                    showdescription: false,
                    showchildren: true,
                    children: [
                        {
                            name: 'header',
                            type: 'text',
                            multiple: true,
                            description: 'Nagłówek',
                            children: [
                                {
                                    name: 'detail',
                                    type: 'text',
                                    multiple: false,
                                    description: 'Informacja',
                                    showchildren: false,
                                }],
                        }],
                }
            } />
        </>
    );
}