export interface LabeledValue {
    label: string,
    value: object| string,
}
export interface Editable {
    name: string,
    type: string,
    multiple: boolean,
    dbkey?: string,
    description?: string,
    isOrdered?: boolean,
    showdescription?: boolean,
    showchildren?: boolean,
    viewertoken?: string,
    options?: LabeledValue[],
    children?: Editable[],
}