import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableTypeEmailProps extends EditableType<string> { }

const EditableTypeEmail: React.FC<EditableTypeEmailProps> = React.memo(function EditableEmail({ value, setValue }) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, [setValue]);

    return <input type="email" value={value} onChange={handleChange} />;
});

export default EditableTypeEmail;