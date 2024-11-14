// EditableDisplayGrid.tsx
import React, { useEffect, useState } from "react";
import { Editable, EditableProps } from "./Editable";
import { useAuth } from "../permission/AuthContext";
import { BaseOutput } from "./Editable";
import EditablePopup from "./EditablePopup";
import { renderAsString } from "./EditableType";

interface EditableDisplayGridProps {
    editableProps: EditableProps & { description: string; multiple: boolean };
}

const EditableDisplayGrid: React.FC<EditableDisplayGridProps> = ({ editableProps }) => {
    const { isAuthenticated, triggerLoginPopup } = useAuth();
    const [editable, setEditable] = useState<Editable | null>(null);
    const [popupEditable, setPopupEditable] = useState<Editable | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ id: string; value: any } | null>(null);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
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

    const handleDoubleClick = (id: string, value: any, renderedEditable: Editable) => {
        if (hasPermission) {
            setSelectedItem({ id, value });
            setPopupEditable(renderedEditable)
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

    const renderGridItem = (item: BaseOutput, depth = 0, renderedEditable: Editable) => {
        let rowSpan = calculateRowSpan(item);

        return (
            <>
            <div
                key={item.id}
                className="grid-item"
                style={{
                    gridColumn: depth + 1,
                    gridRowEnd: `span ${rowSpan}`,
                    }}
                    onDoubleClick={() => handleDoubleClick(item.id, item.output, renderedEditable)}
                >
                    {renderAsString(renderedEditable.type, item.output, renderedEditable.options)}
                </div>
                {item.children && item.children.map((child, index) => (<>{child.data.map(dataentry => renderGridItem(dataentry, depth + index + 1, child))}</>))}
            </>
        );
    };
    function calculateRowSpan(item: BaseOutput): number {
        if (!item.children || item.children.length === 0) return 1;
        return item.children.reduce((max_0, child) => { const newmax_0 = child.data.reduce((sum, data) => sum + calculateRowSpan(data), 0); return newmax_0 > max_0 ? newmax_0 : max_0 }, 0);
    }


    return (
        <div>
            <h3>{editable?.description}</h3>
            {isAuthenticated ? (
                <div className="grid-container">
                    {data.map(entry => renderGridItem(entry, 0, editable))}
                </div>
            ) : (
                <div>
                    <p>Trzeba się zalogować, by otrzymać dostęp.</p>
                    <button onClick={triggerLoginPopup}>Zaloguj się</button>
                </div>
            )}
            {isPopupOpen && selectedItem && hasPermission && (
                <EditablePopup
                    editable={popupEditable!}
                    entry={selectedItem}
                    onSave={(newValue) => handleSave(selectedItem.id, newValue)}
                    onClose={() => setIsPopupOpen(false)}
                />
            )}
        </div>
    );
};

export default EditableDisplayGrid;