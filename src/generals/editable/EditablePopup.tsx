import React, { useState, useRef, useEffect } from "react";
import { Editable } from "./Editable";
import { renderInputField } from "./EditableType";

interface EditablePopupProps {
    editable: Editable;
    entry?: { id: string; value: any };
    onClose: () => void;
    onSave: (data: any) => void;
}

const EditablePopup: React.FC<EditablePopupProps> = ({ editable, entry, onClose, onSave }) => {
    const initialData = entry ? [{ id: entry.id, newValue: entry.value, unsaved: false }] : editable.data.map(item => ({
        id: item.id,
        newValue: item.output,
        unsaved: false,
    }));

    const [updatedData, setUpdatedData] = useState<{ id: string; newValue: any; unsaved: boolean }[]>(initialData);
    const [newEntry, setNewEntry] = useState<any>("");
    const [isExpanded, setIsExpanded] = useState(false);
    const popupContentRef = useRef<HTMLDivElement>(null);

    const handleChange = (id: string, newValue: any) => {
        setUpdatedData(prevData =>
            prevData.map(data =>
                data.id === id ? { ...data, newValue, unsaved: true } : data
            )
        );
    };

    const handleAddNewEntry = async () => {
        if (newEntry) {
            const newId = await editable.createData(newEntry);
            setUpdatedData([...updatedData, { id: newId, newValue: newEntry, unsaved: true }]);
            setNewEntry("");
        }
    };

    const handleDelete = async (id: string) => {
        await editable.deleteData(id);
        setIsExpanded(true);
        setUpdatedData(updatedData.filter(data => data.id !== id));
    };

    const handleSave = async () => {
        for (const { id, newValue, unsaved } of updatedData) {
            if (unsaved) {
                await editable.updateData(id, newValue);
            }
        }
        if (entry && !isExpanded) {
            onSave(updatedData[0].newValue);
        } else {
            onSave(updatedData);
        }
        onClose();
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        setUpdatedData(isExpanded ? [{ id: entry!.id, newValue: entry!.value, unsaved: false }] : editable.data.map(item => ({
            id: item.id,
            newValue: item.output,
            unsaved: false,
        })));
    };

    const handleBackgroundClick = (event: React.MouseEvent) => {
        if (popupContentRef.current && !popupContentRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Tab" && newEntry.trim()) {
            event.preventDefault();
            handleAddNewEntry();
        }
    };

    return (
        <div className="editable-popup" onClick={handleBackgroundClick}>
            <div className="editable-popup-container" ref={popupContentRef} tabIndex={-1}>
                <div className="editable-popup-header">
                    {editable.description}
                    {editable.data.find(dataEntry => dataEntry.id === entry?.id) && (
                        <button onClick={toggleExpand} style={{ marginLeft: "10px" }}>
                            {isExpanded ? "Tylko wybrany" : "Wszystkie wpisy"}
                        </button>
                    )}
                </div>

                {updatedData.map((item) => (
                    <div
                        className="editable-popup-entry"
                        key={item.id}
                        style={{
                            border: item.unsaved ? "10px solid #f8d9c3ff" : "",
                            background: item.unsaved ? "#f8d9c3ff" : "transparent",
                            margin: item.unsaved ? "-10px" : "0",
                            borderRadius: item.unsaved ? "10px" : "0",
                        }}
                    >
                        {renderInputField(editable.type, item.newValue, editable.options, (val) => handleChange(item.id, val), editable.min, editable.max)}
                        <button onClick={() => handleDelete(item.id)}>Usuń</button>
                    </div>
                ))}

                {((editable.multiple || updatedData.length === 0) && (isExpanded || !entry)) && (
                    <div className="editable-popup-new-entry">
                        <h4>Nowy wpis:</h4>
                        {renderInputField(editable.type, newEntry, editable.options, setNewEntry, editable.min, editable.max)}
                        <button onClick={handleAddNewEntry} onKeyDown={handleKeyDown}>Dodaj</button>
                    </div>
                )}

                <div className="editable-popup-actions">
                    <button onClick={handleSave}>Zapisz</button>
                    <button className="cancel-button" onClick={onClose}>Zamknij</button>
                </div>
            </div>
        </div>
    );
};

export default EditablePopup;
