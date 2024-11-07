import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface Option {
    label: string;
    value: string;
}

interface EditableSelectProps extends EditableType<string> {
    options: Option[];  // Array of options for the dropdown
}

const EditableSelect: React.FC<EditableSelectProps> = React.memo(function EditableSelect({ value, setValue, options }) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value);
    }, [setValue]);

    return (
        <select value={value} onChange={handleChange}>
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
});

export default EditableSelect;