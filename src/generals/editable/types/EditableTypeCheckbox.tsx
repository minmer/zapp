import React, { useCallback} from 'react';
import { EditableType } from '../EditableType';

interface EditableTypeCheckboxProps extends EditableType<boolean> { }

const EditableTypeCheckbox = React.memo(function EditableCheckbox({ value = false, setValue }: EditableTypeCheckboxProps) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.checked);
    }, [setValue]);

    return <input type="checkbox" checked={value} onChange={handleChange} />;
});

export default EditableTypeCheckbox;
