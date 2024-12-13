import EditableTypeNumber from "./types/EditableTypeNumber";
import EditableString from "./types/EditableTypeString";
import EditableTypeColor from "./types/EditableTypeColor";
import EditableTypeEmail from "./types/EditableTypeEmail";
import EditableTypeTel from "./types/EditableTypeTel";
import EditableTypeRadio from "./types/EditableTypeRadio";
import EditableTypeCheckbox from "./types/EditableTypeCheckbox";
import EditableTypeDate from "./types/EditableTypeDate";
import EditableTypeDateTime from "./types/EditableTypeDateTime";
import EditableTypeLink from "./types/EditableTypeLink";
import EditableTypeRange from "./types/EditableTypeRange";
import EditableTypeSelect from "./types/EditableTypeSelect";
import EditableTypeText from "./types/EditableTypeText";
import EditableTypeTime from "./types/EditableTypeTime";
import EditableTypeBinary from "./types/EditableTypeBinary";

export interface EditableType<T> {
    value: T;
    setValue: (value: T) => void;
}

export const renderInputField = (
    itemType: string,
    value: any,
    options: any[],
    setValue: (val: any) => void,
    min: number,
    max: number
) => {
    switch (itemType) {
        case "number":
            return <EditableTypeNumber value={value} setValue={setValue} />;
        case "binary":
            return <EditableTypeBinary value={value} setValue={setValue} options={options} />;
        case "color":
            return <EditableTypeColor value={value} setValue={setValue} />;
        case "email":
            return <EditableTypeEmail value={value} setValue={setValue} />;
        case "tel":
            return <EditableTypeTel value={value} setValue={setValue} />;
        case "radio":
            return <EditableTypeRadio value={value} setValue={setValue} options={options} />;
        case "checkbox":
            return <EditableTypeCheckbox value={value} setValue={setValue} />;
        case "date":
            return <EditableTypeDate value={value} setValue={setValue} />;
        case "datetime":
            return <EditableTypeDateTime value={value} setValue={setValue} />;
        case "link":
            return <EditableTypeLink value={value} setValue={setValue} />;
        case "range":
            return <EditableTypeRange value={value} setValue={setValue} min={min} max={max} />;
        case "select":
            return <EditableTypeSelect value={value} setValue={setValue} options={options} />;
        case "text":
            return <EditableTypeText value={value} setValue={setValue} />;
        case "time":
            return <EditableTypeTime value={value} setValue={setValue} />;
        default:
            return <EditableString value={value} setValue={setValue} />;
    }
};

export const renderAsString = (itemType: string, value: any, options: any[]) => {
    switch (itemType) {
        case "number":
            return value.toString();
        case "binary":
        case "color":
        case "email":
        case "tel":
        case "text":
        case "string":
            return value as string;
        case "date":
            return (value as Date).toISOString().split('T')[0];
        case "datetime":
            return (value as Date).toISOString().replace('T', ' ').substring(0, 16);
        case "time":
            return (value as Date).toISOString().substring(11, 16);
        case "radio":
            return options.find(v => v.value === value)?.label ?? "Not specified";
        case "select":
            return options.find(v => v.value === value)?.label ?? "Not specified";
        case "checkbox":
            return value ? "Checked" : "Unchecked";
        case "link":
            return value as string;
        case "range":
            return value.toString();
        default:
            return value.toString();
    }
};
