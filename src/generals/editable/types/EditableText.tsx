import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableTextProps extends EditableType<string> { }

const EditableText = React.memo(function EditableText({ value, setValue }: EditableTextProps) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    }, [setValue]);

    return <textarea value={value} onChange={handleChange} />;
});

export default EditableText;