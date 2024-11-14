import PermissionService from "../permission/PermissionService";
import { FetchInformationDelete } from "../../features/NewFetchInformationDelete";
import { FetchInformationGet, FetchInformationGetAll } from "../../features/NewFetchInformationGet";
import { FetchInformationPost } from "../../features/NewFetchInformationPost";
import { FetchInformationPut } from "../../features/NewFetchInformationPut";

export interface EditableProps {
    name: string;
    type: string;
    multiple: boolean;
    dbkey?: string;
    description?: string;
    isOrdered?: boolean;
    showdescription?: boolean;
    display: string;
    break?: string;
    options?: {
        label: string;
        value: object | string;
    }[];
    min?: number;
    max?: number;
    children?: EditableProps[];
    preorderMin?: number;
    preorderMax?: number;
    preorderKey?: string;
}

export interface BaseOutput {
    id: string;
    output: any;
    preorder?: number;
    children?: Editable[];
}

export class Editable implements EditableProps {
    name: string;
    type: string;
    multiple: boolean;
    dbkey?: string;
    description?: string;
    isOrdered?: boolean;
    showdescription?: boolean;
    display: string;
    break?: string;
    options?: {
        label: string;
        value: object | string;
    }[];
    min?: number;
    max?: number;
    children?: Editable[];
    preorderMin?: number;
    preorderMax?: number;
    preorderKey?: string;

    private _data: BaseOutput[] = [];
    private listeners: Set<() => void> = new Set();
    hasPermission: boolean = false;

    constructor(props: EditableProps) {
        Object.assign(this, props);
        this.children = props.children?.map(child => new Editable(child)) || [];
    }

    get data() {
        return this._data;
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener());
    }

    addListener(listener: () => void) {
        this.listeners.add(listener);
    }

    removeListener(listener: () => void) {
        this.listeners.delete(listener);
    }

    async checkPermission(): Promise<boolean> {
        const permissionService = PermissionService.getInstance();
        this.hasPermission = await permissionService.checkPermission(this.dbkey);
        this.notifyListeners();
        return this.hasPermission;
    }

    async fetchData(): Promise<void> {
        await this.fetchSelfData(this.name);
        if (this.children && this.children.length > 0) {
            await Promise.all(
                this._data.map(async parentEntry => {
                    parentEntry.children = await this.fetchChildrenData(parentEntry.id);
                })
            );
        }
        this.notifyListeners();
    }

    private async fetchSelfData(name: string): Promise<void> {
        if (this.preorderMin !== undefined && this.preorderMax !== undefined && this.preorderKey) {
            switch (this.type) {
                case "number":
                    this._data = await FetchInformationGet("double", name, this.preorderMin, this.preorderMax, this.preorderKey);
                    break;
                case "radio":
                case "string":
                case "text":
                case "email":
                case "tel":
                case "color":
                    this._data = await FetchInformationGet("string", name, this.preorderMin, this.preorderMax, this.preorderKey);
                    break;
                case "checkbox":
                    this._data = await FetchInformationGet("bool", name, this.preorderMin, this.preorderMax, this.preorderKey);
                    break;
                case "binary":
                    const fetchedData = await FetchInformationGet("string", name, this.preorderMin, this.preorderMax, this.preorderKey);
                    this._data = fetchedData.map(output => ({
                        ...output,
                        output: (output.output as string).padEnd(this.options?.length ?? 0, "O"),
                    }));
                    break;
                case "date":
                case "time":
                case "datetime":
                    this._data = await FetchInformationGet("datetime", name, this.preorderMin, this.preorderMax, this.preorderKey);
                    break;
                default:
                    this._data = [];
            }
        } else {
            switch (this.type) {
                case "number":
                    this._data = await FetchInformationGetAll("double", name);
                    break;
                case "radio":
                case "string":
                case "text":
                case "email":
                case "tel":
                case "color":
                    this._data = await FetchInformationGetAll("string", name);
                    break;
                case "checkbox":
                    this._data = await FetchInformationGetAll("bool", name);
                    break;
                case "binary":
                    const fetchedData = await FetchInformationGetAll("string", name);
                    this._data = fetchedData.map(output => ({
                        ...output,
                        output: (output.output as string).padEnd(this.options?.length ?? 0, "O"),
                    }));
                    break;
                case "date":
                case "time":
                case "datetime":
                    this._data = await FetchInformationGetAll("datetime", name);
                    break;
                default:
                    this._data = [];
            }
        }
    }

    private async fetchChildrenData(parentId: string): Promise<Editable[]> {
        if (this.children) {
            const childInstances: Editable[] = [];
            for (const child of this.children) {
                const childInstance = new Editable(child);
                childInstance.name = `${parentId}${child.name}`;
                await childInstance.fetchData();
                childInstances.push(childInstance);
            }
            return childInstances;
        }
        return [];
    }

    async updateData(id: string, newValue: any): Promise<void> {
        if (!this.hasPermission) {
            throw new Error("Permission denied");
        }
        await FetchInformationPut(this.dbkey ?? "", id, newValue);
        this._data = this._data.map(item => item.id === id ? { ...item, output: newValue } : item);
        this.notifyListeners();
    }

    async deleteData(id: string): Promise<void> {
        if (!this.hasPermission) {
            throw new Error("Permission denied");
        }
        await FetchInformationDelete(this.dbkey ?? "", id);
        this._data = this._data.filter(item => item.id !== id);
        this.notifyListeners();
    }

    async createData(newData: any): Promise<string> {
        if (!this.hasPermission) {
            throw new Error("Permission denied");
        }
        const newId = await FetchInformationPost(this.dbkey ?? "", [this.name], newData, []);
        this._data.push({ id: newId, output: newData });
        this.notifyListeners();
        return newId;
    }
}
