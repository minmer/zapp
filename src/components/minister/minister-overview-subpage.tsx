import EditableElement from "../../generals/editable-element";
import { User } from "../../structs/user";

export default function MinisterOverviewSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    return (
        <>
            <EditableElement getParams={getParams} editable={
                {
                    name: 'minister_information_section',
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
                                    display: 'single',
                                }],
                        }],
                }
            } />
        </>
    );
}