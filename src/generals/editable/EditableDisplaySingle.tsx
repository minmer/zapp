import React, { useEffect, useState } from "react";
import { Editable, EditableProps } from "./Editable";
import { useAuth } from "../permission/AuthContext";

interface EditableDisplayProps {
    editableProps: EditableProps;
}

const EditableDisplay: React.FC<EditableDisplayProps> = ({ editableProps}) => {
    const { isAuthenticated } = useAuth();
    const [editable, setEditable] = useState<Editable | null>(null);
    const [displayText, setDisplayText] = useState<string>("Loading...");

    useEffect(() => {
        const instance = new Editable(editableProps);

        // Listener function to update the display text when data changes
        const handleDataChange = () => {
            if (instance.data.length > 0) {
                // Convert data array to a formatted string
                const formattedData = instance.data.map(item => item.output).join(", ");
                setDisplayText(formattedData);
            } else {
                setDisplayText("No data available.");
            }
        };

        instance.addListener(handleDataChange);
        setEditable(instance);

        // Check permission and load data if permitted
        (async () => {
            await instance.checkPermission();
            if (instance.hasPermission) {
                await instance.fetchData();
            } else {
                setDisplayText("Permission denied.");
            }
        })();

        // Clean up listener on component unmount
        return () => {
            instance.removeListener(handleDataChange);
        };
    }, [editableProps]);

    return (
        <div>
            <h3>{editable?.description}</h3>
            <p>{displayText}</p>
        </div>
    );
};

export default EditableDisplay;