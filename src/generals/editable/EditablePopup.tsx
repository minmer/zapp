import React, { useCallback, useState, useRef, useEffect } from "react";
import { Editable } from "./Editable";
import { renderInputField } from "./EditableType";

interface EditablePopupProps {
    editable: Editable;
    entry?: { id: string; value: any; order: number };
    onClose: () => void;
    onSave: (data: any) => void;
}

const EditablePopup: React.FC<EditablePopupProps> = ({ editable, entry, onClose, onSave }) => {
    const initialData = entry ? [{ id: entry.id, newValue: entry.value, unsaved: false, order: entry.order }] : editable.data.map(item => ({
        id: item.id,
        newValue: item.output ?? (editable.type === 'checkbox' ? false : editable.type === 'number' ? 0 : ''), // Default values
        unsaved: false,
        order: item.order
    }));
    const [updatedData, setUpdatedData] = useState<{ id: string; newValue: any; unsaved: boolean; order: number }[]>(initialData);
    const [newEntry, setNewEntry] = useState<any>(editable.type === 'checkbox' ? false : editable.type === 'number' ? 0 : ""); // Default value based on type
    const [isExpanded, setIsExpanded] = useState(false);
    const popupContentRef = useRef<HTMLDivElement>(null);

    const handleChange = useCallback((id: string, newValue: any) => {
        setUpdatedData(prevData =>
            prevData.map(data =>
                data.id === id ? { ...data, newValue, unsaved: true } : data
            )
        );
    }, []);

    const handleOrderChange = useCallback((id: string, newOrder: number) => {
        setUpdatedData(prevData =>
            prevData.map(data =>
                data.id === id ? { ...data, order: newOrder, unsaved: true } : data
            )
        );
    }, []);

    const handleAddNewEntry = async () => {
        if (newEntry !== "" || editable.type === "checkbox" || editable.type === "number") {  // Ensure default values work even if newEntry is empty
            const newId = await editable.createData(newEntry);
            setUpdatedData([...updatedData, { id: newId, newValue: newEntry, unsaved: true, order: 1 }]);
            setNewEntry(editable.type === 'checkbox' ? false : editable.type === 'number' ? 0 : "");  // Reset to default value
        }
    };

    const handleDelete = async (id: string) => {
        await editable.deleteData(id);
        setIsExpanded(true);
        setUpdatedData(updatedData.filter(data => data.id !== id));
    };

    const handleSave = async () => {
        for (const { id, newValue, unsaved, order } of updatedData) {
            if (unsaved) {
                await editable.updateData(id, newValue, order);
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
        setUpdatedData(isExpanded ? [{ id: entry!.id, newValue: entry!.value, unsaved: false, order: entry!.order }] : editable.data.map(item => ({
            id: item.id,
            newValue: item.output ?? (editable.type === 'checkbox' ? false : editable.type === 'number' ? 0 : ''), // Default values
            unsaved: false,
            order: item.order,
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

    // Check if there is any data to enable the "Zapisz" button
    const hasDataToSave = updatedData.some(item => item.unsaved);

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
                        {editable.isOrdered && (
                            <div>
                                <label>Order:</label>
                                <input
                                    type="number"
                                    value={item.order}  // Ensure 'order' is used for ordering
                                    onChange={(e) => handleOrderChange(item.id, parseInt(e.target.value))}
                                />
                            </div>
                        )}
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

                {hasDataToSave && (
                    <div className="editable-popup-actions">
                        <button onClick={handleSave}>Zapisz</button>
                        <button className="cancel-button" onClick={onClose}>Zamknij</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditablePopup;
