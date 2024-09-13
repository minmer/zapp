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
    showdescription?: boolean,
    showchildren?: boolean,
    viewertoken?: string,
    options?: LabeledValue[],
    children?: Editable[],
}