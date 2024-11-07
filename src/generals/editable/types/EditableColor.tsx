import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableColorProps extends EditableType<string> { }

const EditableColor: React.FC<EditableColorProps> = React.memo(function EditableColor({ value, setValue }) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, [setValue]);

    return <input type="color" value={value} onChange={handleChange} />;
});

export default EditableColor;