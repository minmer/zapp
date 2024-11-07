import PermissionService from "../permission/PermissionService";
import { FetchInformationDelete } from "../../features/NewFetchInformationDelete";
import { FetchInformationGetAll } from "../../features/NewFetchInformationGet";
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
    children?: Editable[];
    preorderMin?: number;
    preorderMax?: number;
    preorderKey?: string;
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
    children?: Editable[];
    preorderMin?: number;
    preorderMax?: number;
    preorderKey?: string;

    private _data: any[] = [];
    private listeners: Set<() => void> = new Set();
    hasPermission: boolean = false;

    constructor(props: EditableProps) {
        Object.assign(this, props);
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
        if (!this.hasPermission && !(await this.checkPermission())) {
            throw new Error("Permission denied");
        }

        switch (this.type) {
            case "number":
                this._data = await FetchInformationGetAll("double", this.name);
                break;
            case "string":
            case "text":
                this._data = await FetchInformationGetAll("string", this.name);
                break;
            case "checkbox":
                this._data = await FetchInformationGetAll("bool", this.name);
                break;
            case "binary":
                const fetchedData = await FetchInformationGetAll("string", this.name);
                this._data = fetchedData.map((output: any) => ({
                    ...output,
                    output: (output.output as string).padEnd(this.options?.length ?? 0, "O"),
                }));
                break;
            default:
                this._data = [];
        }

        this.notifyListeners();
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
