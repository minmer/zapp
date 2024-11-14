import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableDateTimeProps extends EditableType<Date> { }

const EditableDateTime = React.memo(function EditableDateTime({ value, setValue }: EditableDateTimeProps) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(new Date(e.target.value));
    }, [setValue]);

    const formattedValue = value ? value.toISOString().slice(0, 16) : '';

    return <input type="datetime-local" value={formattedValue} onChange={handleChange} />;
});

export default EditableDateTime;
