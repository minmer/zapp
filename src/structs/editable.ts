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
    display: string,
    viewertoken?: string,
    break?: string,
    options?: LabeledValue[],
    children?: Editable[],
    preorderMin?: number,
    preorderMax?: number,
    preorderKey?: string,
}
