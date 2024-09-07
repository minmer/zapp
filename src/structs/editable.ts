export interface Editable {
    name: string,
    type: string,
    multiple: boolean,
    dbkey?: string,
    description?: string,
    showdescription?: boolean,
    showchildren?: boolean,
    viewertoken?: string,
    children?: Editable[],
}