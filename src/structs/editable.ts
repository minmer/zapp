export interface Editable {
    name: string,
    type: string,
    multiple: boolean,
    dbkey: string,
    description?: string,
    showdescription?: boolean,
    children?: Editable[],
}