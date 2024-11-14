import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface Option {
    label: string;
    value: string;
}

interface EditableTypeSelectProps extends EditableType<string> {
    options: Option[];
}

const EditableTypeSelect: React.FC<EditableTypeSelectProps> = React.memo(function EditableSelect({ value, setValue, options }) {
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

export default EditableTypeSelect;