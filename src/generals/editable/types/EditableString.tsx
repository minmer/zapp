import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableNumberProps extends EditableType<string> { }

const EditableNumber = React.memo(function EditableNumber({ value, setValue }: EditableNumberProps) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, [setValue]);

    return <input type="text" value={value} onChange={handleChange} />;
})

export default EditableNumber;