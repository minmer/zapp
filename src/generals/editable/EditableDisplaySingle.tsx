// EditableDisplay.tsx
import React, { useEffect, useState } from "react";
import { Editable, EditableProps } from "./Editable";
import { useAuth } from "../permission/AuthContext";
import EditablePopup from "./EditablePopup";

interface EditableDisplaySingleProps {
    editableProps: EditableProps;
}

const EditableDisplaySingle: React.FC<EditableDisplaySingleProps> = ({ editableProps }) => {
    const { isAuthenticated, triggerLoginPopup } = useAuth();
    const [editable, setEditable] = useState<Editable | null>(null);
    const [displayText, setDisplayText] = useState<string>("Ładuje...");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setDisplayText("Zaloguj się, aby zobaczyć te dane");
            return;
        }

        const instance = new Editable(editableProps);

        const handleDataChange = () => {
            if (instance.data.length > 0) {
                const formattedData = instance.data.map(item => item.output).join(", ");
                setDisplayText(formattedData);
            } else {
                setDisplayText("Brak danych");
            }
        };

        instance.addListener(handleDataChange);
        setEditable(instance);

        (async () => {
            const permissionGranted = await instance.checkPermission();
            setHasPermission(permissionGranted);
            await instance.fetchAllData();
        })();

        return () => {
            instance.removeListener(handleDataChange);
        };
    }, [editableProps, isAuthenticated]);

    const handleClick = () => {
        if (hasPermission) {
            setIsPopupOpen(true);
        } else {
            setDisplayText(displayText == "Nie masz pozwolenie na edycję danych" ? editable?.data.map(item => item.output).join(", ") || "" : "Nie masz pozwolenie na edycję danych");
        }
    };

    return (
        <div>
            <h3>{editable?.description}</h3>
            {isAuthenticated ? (
                <p onDoubleClick={handleClick}>{displayText}</p>
            ) : (
                <div>
                    <p>Zaloguj się, aby mieć dostęp do tych danych</p>
                    <button onClick={triggerLoginPopup}>Zaloguj się</button>
                </div>
            )}
            {isPopupOpen && hasPermission &&
                <EditablePopup
                editable={editable!}
                onSave={async () => {
                    await editable?.fetchAllData();
                    setDisplayText(editable?.data.map(item => item.output).join(", ") || "");
                }}
                onClose={() => setIsPopupOpen(false)}
            />}
        </div>
    );
};

export default EditableDisplaySingle;
