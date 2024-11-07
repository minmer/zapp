import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface Option {
    label: string;
    value: string;
}

interface EditableRadioProps extends EditableType<string> {
    options: Option[];
}

const EditableRadio: React.FC<EditableRadioProps> = React.memo(function EditableRadio({ value, setValue, options }) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, [setValue]);

    return (
        <div>
            {options.map(option => (
                <label key={option.value}>
                    <input
                        type="radio"
                        value={option.value}
                        checked={value === option.value}
                        onChange={handleChange}
                    />
                    {option.label}
                </label>
            ))}
        </div>
    );
});

export default EditableRadio;