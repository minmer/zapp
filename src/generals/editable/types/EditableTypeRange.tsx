import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableTypeRangeProps extends EditableType<number> {
    min: number;
    max: number;
}

const EditableTypeRange: React.FC<EditableTypeRangeProps> = React.memo(function EditableRange({ value, setValue, min, max }) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(e.target.value));
    }, [setValue]);

    return (
        <input
            type="range"
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
        />
    );
});

export default EditableTypeRange;