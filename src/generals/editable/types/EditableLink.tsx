import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableLinkProps extends EditableType<string> { }

const EditableLink: React.FC<EditableLinkProps> = React.memo(function EditableLink({ value, setValue }) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, [setValue]);

    return <input type="url" value={value} onChange={handleChange} placeholder="https://example.com" />;
});

export default EditableLink;