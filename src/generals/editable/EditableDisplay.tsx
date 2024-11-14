import React from "react";
import { Editable, EditableProps } from "./Editable";
import EditableDisplayGrid from "./EditableDisplayGrid";
import EditableExpander from "./EditableDisplayExpander";
import EditableSingleDisplay from "./EditableDisplaySingle";

interface EditableDisplayProps {
    editableProps: EditableProps;
}

const EditableDisplay: React.FC<EditableDisplayProps> = ({ editableProps }) => {
    switch (editableProps.display) {
        case "grid":
            return <EditableDisplayGrid editableProps={editableProps} />;
        case "expander":
            return <EditableExpander editableProps={editableProps} />;
        case "single":
        default:
            return <EditableSingleDisplay editableProps={editableProps} />;
    }
};

export default EditableDisplay;
