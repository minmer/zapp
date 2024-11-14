import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableTypeTextProps extends EditableType<string> { }

const EditableTypeText = React.memo(function EditableText({ value, setValue }: EditableTypeTextProps) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    }, [setValue]);

    return <textarea value={value} onChange={handleChange} />;
});

export default EditableTypeText;