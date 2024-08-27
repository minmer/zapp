import { Editable } from "../structs/editable";
import EditableElement from "./editable-element";

export default function EditablePopup({ getParams, elementid, editables, onClosing }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, elementid: string, editables: Editable[], onClosing: () => void }) {

    const backgroundClicked = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.currentTarget == e.target)
            onClosing();
    }
    return (

        <div className="popup" onClick={(e) => {backgroundClicked(e) }} >
            <div>
                {editables.map((editable) => (
                    <EditableElement getParams={getParams} name={elementid + editable.name} type={editable.type} multiple={editable.multiple} dbkey={editable.dbkey} description={editable.description} showdescription={editable.showdescription} />
                ))}
            </div>
        </div>
    );
}