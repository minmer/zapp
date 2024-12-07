import React, { useCallback} from 'react';
import { EditableType } from '../EditableType';

interface EditableTypeNumberProps extends EditableType<number> { }

const EditableTypeNumber = React.memo(function EditableNumber({ value = 0, setValue }: EditableTypeNumberProps) {

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(e.target.value));
    }, [setValue]);

    return <input type="number" value={value} onChange={handleChange} />;
});

export default EditableTypeNumber;
