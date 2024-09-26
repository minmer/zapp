import { useState } from "react";
import { Editable } from "../structs/editable";
import OldEditableElement from "../temp/old-editable-element";
import { User } from "../structs/user";

export default function EditablePopup({ getParams, elementid, editables, onClosing }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, elementid: string, editables: Editable[], onClosing: () => void }) {
    const [popup, setPopup] = useState<string | undefined>()

    const backgroundClicked = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.currentTarget == e.target)
            onClosing();
    }

    const openPopup = (name: string) => {
        setPopup(name)
    }

    const closePopup = () => {
        setPopup(undefined)
    }

    return (

        <div className="popup" onClick={(e) => {backgroundClicked(e) }} >
            <div>
                {editables.map((editable) => (
                    <div>
                        <OldEditableElement getParams={getParams} name={elementid + editable.name} type={editable.type} multiple={editable.multiple} dbkey={editable.dbkey ?? ''} description={editable.description} showdescription={editable.showdescription} />
                        {
                            editable.children?.map((child) => (
                                <div>
                                    <input type='button' value={child.description} onClick={() => { openPopup(child.name) }} />
                                    {
                                        popup == child.name ?
                                            <EditablePopup getParams={getParams} elementid='asd' editables={editable.children as Editable[]} onClosing={() => { closePopup() }} />
                                            :
                                            null
                                    }
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}