import React, { useEffect, useState } from "react";
import { Editable, EditableProps } from "./Editable";
import { useAuth } from "../permission/AuthContext";
import { BaseOutput } from "./Editable";
import EditablePopup from "./EditablePopup";
import { renderAsString } from "./EditableType";
import LoadingComponent from "../LoadingComponent"; // Import the LoadingComponent

interface EditableDisplayGridProps {
    editableProps: EditableProps;
}

const EditableDisplayGrid: React.FC<EditableDisplayGridProps> = ({ editableProps }) => {
    const { isAuthenticated, triggerLoginPopup } = useAuth();
    const [editable, setEditable] = useState<Editable | null>(null);
    const [popupEditable, setPopupEditable] = useState<Editable | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ id: string; value: any } | null>(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    useEffect(() => {
        if (!isAuthenticated) return;
        const instance = new Editable(editableProps);

        const handleDataChange = () => {
            setData([...instance.data]);
            setIsLoading(false); // Stop loading once data is set
        };

        instance.addListener(handleDataChange);
        setEditable(instance);

        (async () => {
            setIsLoading(true); // Start loading when fetching data
            const permissionGranted = await instance.checkPermission();
            setHasPermission(permissionGranted);
            await instance.fetchAllData();
            setIsLoading(false); // Stop loading once fetch completes
        })();

        return () => {
            instance.removeListener(handleDataChange);
        };
    }, [editableProps, isAuthenticated]);

    const handleDoubleClick = (id: string, value: any, renderedEditable: Editable) => {
        if (hasPermission) {
            setSelectedItem({ id, value });
            setPopupEditable(renderedEditable);
            setIsPopupOpen(true);
        }
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

    const renderGridItem = (item: BaseOutput, depth = 0, renderedEditable: Editable) => {
        const rowSpan = calculateRowSpan(item);

        return (
            <>
                <div
                    key={item.id} // Using parentId + itemId to make the key unique
                    className="grid-item"
                    style={{
                        gridColumn: depth + 1,
                        gridRowEnd: `span ${rowSpan}`,
                    }}
                    onDoubleClick={() => handleDoubleClick(item.id, item.output, renderedEditable)}
                >
                    {renderAsString(renderedEditable.type, item.output, renderedEditable.options)}
                </div>
                {item.children && item.children.map((child, index) => (
                    <>
                        {child.data.length > 0 ? (
                            child.data.map(dataEntry => renderGridItem(dataEntry, depth + index + 1, child))
                        ) : child?.hasPermission && (
                                <button
                                    key={item.id + 'button'} // Using parentId + itemId to make the key unique
                                className="new-entry-button"
                                onClick={() => openNewEntryPopup(child)}
                                onFocus={() => openNewEntryPopup(child)}
                            >
                                Dodaj wpis
                            </button>
                        )}
                    </>
                ))}
            </>
        );
    };

    function calculateRowSpan(item: BaseOutput): number {
        if (!item.children || item.children.length === 0) return 1;
        return item.children.reduce((total, child) => total + child.data.reduce((sum, data) => sum + calculateRowSpan(data), 0), 0);
    }

    return (
        <div>
            <h3>{editable?.description}</h3>
            {isAuthenticated ? (
                isLoading ? (
                    <LoadingComponent /> // Display LoadingComponent while loading
                ) : (
                    <div className="grid-container">
                        {data.length > 0 ? (
                            data.map(entry => renderGridItem(entry, 0, editable!))
                        ) : editable?.hasPermission && (
                            <button
                                className="new-entry-button"
                                onClick={() => openNewEntryPopup(editable!)}
                                onFocus={() => openNewEntryPopup(editable!)}
                            >
                                Dodaj wpis
                            </button>
                        )}
                    </div>
                )
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

export default EditableDisplayGrid;
