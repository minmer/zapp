import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableTypeNumberProps extends EditableType<string> { }

const EditableTypeNumber = React.memo(function EditableNumber({ value, setValue }: EditableTypeNumberProps) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, [setValue]);

    return <input type="text" value={value} onChange={handleChange} />;
})

export default EditableTypeNumber;