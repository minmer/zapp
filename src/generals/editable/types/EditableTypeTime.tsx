import React, { useCallback } from 'react';
import { EditableType } from '../EditableType';

interface EditableTypeTimeProps extends EditableType<Date> { }

const EditableTypeTime = React.memo(function EditableTime({ value, setValue }: EditableTypeTimeProps) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = e.target.value.split(':').map(Number);
        const newDate = new Date(value);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        setValue(newDate);
    }, [setValue, value]);

    const formattedValue = value ? value.toISOString().slice(11, 16) : '';

    return <input type="time" value={formattedValue} onChange={handleChange} />;
});

export default EditableTypeTime;
