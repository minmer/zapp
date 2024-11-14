import React, { useState } from "react";
import { Editable } from "./Editable";
import { renderInputField } from "./EditableType";

interface EditablePopupProps {
    editable: Editable;
    entry?: { id: string; value: any };
    onClose: () => void;
    onSave: (data: any) => void;
}

const EditablePopup: React.FC<EditablePopupProps> = ({ editable, entry, onClose, onSave }) => {
    const initialData = entry ? [{ id: entry.id, newValue: entry.value }] : editable.data.map(item => ({
        id: item.id,
        newValue: item.output,
    }));

    const [updatedData, setUpdatedData] = useState<{ id: string; newValue: any }[]>(initialData);
    const [newEntry, setNewEntry] = useState<any>("");
    const [isExpanded, setIsExpanded] = useState(false);

    const handleChange = (id: string, newValue: any) => {
        setUpdatedData(prevData =>
            prevData.map(data => (data.id === id ? { ...data, newValue } : data))
        );
    };

    const handleAddNewEntry = async () => {
        if (newEntry) {
            const newId = await editable.createData(newEntry);
            setUpdatedData([...updatedData, { id: newId, newValue: newEntry }]);
            setNewEntry("");
        }
    };

    const handleDelete = async (id: string) => {
        await editable.deleteData(id);
        setUpdatedData(updatedData.filter(data => data.id !== id));
    };

    const handleSave = async () => {
        for (const { id, newValue } of updatedData) {
            await editable.updateData(id, newValue);
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
        setUpdatedData(isExpanded ? [{ id: entry!.id, newValue: entry!.value }] : editable.data.map(item => ({
            id: item.id,
            newValue: item.output,
        })));
    };

    return (
        <div className="editable-popup">
            <div className="editable-popup-container">
                <div className="editable-popup-header">
                    {editable.description}
                    {entry && (
                        <button onClick={toggleExpand} style={{ marginLeft: "10px" }}>
                            {isExpanded ? "Schowaj" : "Rozszerz"}
                        </button>
                    )}
                </div>

                {updatedData.map((item) => (
                    <div className="editable-popup-entry" key={item.id}>
                        {renderInputField(editable.type, item.newValue, editable.options, (val) => handleChange(item.id, val), editable.min, editable.max)}
                        {editable.multiple && <button onClick={() => handleDelete(item.id)}>Usuń</button>}
                    </div>
                ))}

                {(editable.multiple && (isExpanded || !entry)) && (
                    <div className="editable-popup-new-entry">
                        <h4>New Entry:</h4>
                        {renderInputField(editable.type, newEntry, editable.options, setNewEntry, editable.min, editable.max)}
                        <button onClick={handleAddNewEntry}>Dodaj</button>
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
