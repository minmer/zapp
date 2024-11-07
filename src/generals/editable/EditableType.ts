export interface EditableType<T> {
    value: T;
    setValue: (value: T) => void;
}