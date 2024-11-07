import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableTypeCheckboxProps extends EditableType<boolean> { }

const EditableTypeCheckbox: React.FC<EditableTypeCheckboxProps> = React.memo(function EditableCheckbox({ value, setValue }) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.checked);
    }, [setValue]);

    return <input type="checkbox" checked={value} onChange={handleChange} />;
});

export default EditableTypeCheckbox;