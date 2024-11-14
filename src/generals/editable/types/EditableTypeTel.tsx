import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableTypeTelProps extends EditableType<string> { }

const EditableTypeTel: React.FC<EditableTypeTelProps> = React.memo(function EditableTel({ value, setValue }) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, [setValue]);

    return <input type="tel" value={value} onChange={handleChange} pattern="[+]{0,1}[0-9]*" placeholder="+1234567890" />;
});

export default EditableTypeTel;