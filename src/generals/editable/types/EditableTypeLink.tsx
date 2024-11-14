import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableTypeLinkProps extends EditableType<string> { }

const EditableTypeLink: React.FC<EditableTypeLinkProps> = React.memo(function EditableLink({ value, setValue }) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, [setValue]);

    return <input type="url" value={value} onChange={handleChange} placeholder="https://example.com" />;
});

export default EditableTypeLink;