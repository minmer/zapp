import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableRangeProps extends EditableType<number> {
    min: number;
    max: number;
}

const EditableRange: React.FC<EditableRangeProps> = React.memo(function EditableRange({ value, setValue, min, max }) {
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

export default EditableRange;