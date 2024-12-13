import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableTypeBinaryProps extends EditableType<string> {
    options: { label: string; value: string }[];
}

const EditableTypeBinary = React.memo(function EditableTypeBinary({ value, setValue, options }: EditableTypeBinaryProps) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newValue = value.substring(0, index) + (e.target.checked ? 'X' : 'O') + value.substring(index + 1);
        setValue(newValue);
    }, [value, setValue]);

    return (
        <div>
            {options.map((option, index) => (
                <div key={index}>
                    <label htmlFor={`binary-${index}`}>{option.label}</label>
                    <input
                        id={`binary-${index}`}
                        type="checkbox"
                        checked={value[index] === 'X'}
                        onChange={(e) => handleChange(e, index)}
                    />
                </div>
            ))}
        </div>
    );
});

export default EditableTypeBinary;
