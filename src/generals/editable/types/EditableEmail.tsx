import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableEmailProps extends EditableType<string> { }

const EditableEmail: React.FC<EditableEmailProps> = React.memo(function EditableEmail({ value, setValue }) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, [setValue]);

    return <input type="email" value={value} onChange={handleChange} />;
});

export default EditableEmail;