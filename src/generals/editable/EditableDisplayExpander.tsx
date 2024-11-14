import React, { useEffect, useState } from "react";
import { Editable, EditableProps } from "./Editable";
import { useAuth } from "../permission/AuthContext";
import { BaseOutput } from "./Editable";
import EditablePopup from "./EditablePopup";
import { renderAsString } from "./EditableType";
import EditableDisplay from "./EditableDisplay";

interface EditableExpanderProps {
    editableProps: EditableProps;
}

const EditableExpander: React.FC<EditableExpanderProps> = ({ editableProps }) => {
    const { isAuthenticated, triggerLoginPopup } = useAuth();
    const [editable, setEditable] = useState<Editable | null>(null);
    const [popupEditable, setPopupEditable] = useState<Editable | null>(null);
    const [data, setData] = useState<BaseOutput[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ id: string; value: any } | null>(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        console.log(editable)
        if (!isAuthenticated) return;

        const instance = new Editable(editableProps);
        const handleDataChange = () => {
            setData([...instance.data]);
        };

        instance.addListener(handleDataChange);
        setEditable(instance);

        (async () => {
            const permissionGranted = await instance.checkPermission();
            setHasPermission(permissionGranted);
            await instance.fetchData();
        })();

        return () => {
            instance.removeListener(handleDataChange);
        };
    }, [editableProps, isAuthenticated]);

    const handleSingleClick = (id: string) => {
        setExpanded(expanded === id ? null : id);
    };

    const handleDoubleClick = (id: string, value: any) => {
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
        }

        if (hasPermission) {
            setSelectedItem({ id, value });
            setPopupEditable(editable);
            setIsPopupOpen(true);
        }
    };

    const handleClick = (id: string) => {
        clickTimeoutRef.current = setTimeout(() => {
            handleSingleClick(id);
        }, 500);
    };

    const handleSave = async (id: string, newValue: any) => {
        if (editable) {
            await editable.updateData(id, newValue);
            setData([...editable.data]);
            setIsPopupOpen(false);
            setSelectedItem(null);
        }
    };

    const openNewEntryPopup = (renderedEditable: Editable) => {
        setPopupEditable(renderedEditable);
        setSelectedItem(null);
        setIsPopupOpen(true);
    };

    return (
        <div>
            <h3>{editable?.description}</h3>
            {isAuthenticated ? (
                <div className="expandable-container">
                    {data.length > 0 ? (
                        data.map(entry => 
                            <div key={entry.id} style={{ marginLeft: "20px" }}>
                                <div
                                    className="expandable-item"
                                    style={{ cursor: "pointer", borderBottom: "1px solid #ddd", padding: "8px" }}
                                    onClick={() => handleClick(entry.id)}
                                    onDoubleClick={() => handleDoubleClick(entry.id, entry.output)}
                                >
                                    <span style={{ fontWeight: expanded === entry.id ? "bold" : "normal" }}>
                                        {expanded === entry.id ? "▼ " : "▶ "}
                                        {renderAsString(editable.type, entry.output, editable.options)}
                                    </span>
                                </div>
                                {expanded === entry.id && editable.children && editable.children.length > 0 && (
                                    <div style={{ marginLeft: "20px", paddingLeft: "10px", borderLeft: "1px solid #ddd" }}>
                                        {editable.children.map(child => (
                                            <>
                                                <EditableDisplay editableProps={{ ...child, name: entry.id + child.name }} />
                                            </>
                                        ))}
                                    </div>
                                )}
                            </div>)
                    ) : (
                        <button
                            className="new-entry-button"
                            onClick={() => openNewEntryPopup(editable!)}
                            onFocus={() => openNewEntryPopup(editable!)}
                        >
                            Dodaj wpis
                        </button>
                    )}
                </div>
            ) : (
                <div>
                    <p>Zaloguj się, aby mieć dostęp do danych</p>
                    <button onClick={triggerLoginPopup}>Zaloguj się</button>
                </div>
            )}
            {isPopupOpen && (
                <EditablePopup
                    editable={popupEditable!}
                    entry={selectedItem}
                    onSave={(newValue) => selectedItem ? handleSave(selectedItem.id, newValue) : handleSave("new", newValue)}
                    onClose={() => setIsPopupOpen(false)}
                />
            )}
        </div>
    );
};

export default EditableExpander;
