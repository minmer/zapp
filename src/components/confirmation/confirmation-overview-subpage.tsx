import EditableElement from "../../generals/editable-element";
import EditableDisplay from "../../generals/editable/EditableDisplaySingle";
import { useAuth } from "../../generals/permission/AuthContext";
import { User } from "../../structs/user";

export default function ConfirmationOverviewSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {

    const { isAuthenticated, triggerLoginPopup } = useAuth();
    if (!isAuthenticated) {
        triggerLoginPopup();
    } else {
        // Execute protected action
        console.log("Executing protected action...");
    }
    return (
        <>

            <EditableDisplay editableProps={
                {
                    name: "confirmation_information_section",
                    type: "string",
                    multiple: true,
                    description: "Rozdziały",
                    display: "single",
                }} />
            <EditableElement getParams={getParams} editable={
                {
                    name: 'confirmation_information_section',
                    type: 'text',
                    multiple: true,
                    dbkey: 'website_admin',
                    description: 'Rozdziały',
                    viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                    display: 'single',
                    children: [
                        {
                            name: 'header',
                            type: 'text',
                            multiple: true,
                            description: 'Nagłówek',
                            display: 'single',
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