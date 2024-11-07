import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableNumberProps extends EditableType<number> { }

const EditableNumber = React.memo(function EditableNumber({ value, setValue }: EditableNumberProps) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(e.target.value));
    }, [setValue]);

    return <input type="number" value={value} onChange={handleChange} />;
})

export default EditableNumber;