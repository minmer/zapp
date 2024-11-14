import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableDateProps extends EditableType<Date> { }

const EditableDate = React.memo(function EditableDate({ value, setValue }: EditableDateProps) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(new Date(e.target.value));
    }, [setValue]);

    const formattedValue = value ? value.toISOString().split('T')[0] : '';

    return <input type="date" value={formattedValue} onChange={handleChange} />;
});

export default EditableDate;
