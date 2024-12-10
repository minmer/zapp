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
    options?: { label: string; value: object | string }[];
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
    order?: number;
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
    options?: { label: string; value: object | string }[];
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

    // Check permissions for both parent and children
    async checkPermission(): Promise<boolean> {
        const permissionService = PermissionService.getInstance();
        this.hasPermission = await permissionService.checkPermission(this.dbkey);

        if (this.children?.length) {
            await Promise.all(this.children.map(child => child.checkPermission()));
        }

        this.notifyListeners();
        return this.hasPermission;
    }

    // Fetch data for this editable and its children
    async fetchAllData(): Promise<void> {
        await this.fetchSelfData();
        if (this.children?.length) {
            await Promise.all(
                this._data.map(async parentEntry => {
                    parentEntry.children = await this.fetchChildrenData(parentEntry.id);
                })
            );
        }

        // Handle ordering of data if 'isOrdered' is true
        if (this.isOrdered) {
            this._data = this._data.sort((a, b) => {
                const orderA = a.order || 999;
                const orderB = b.order || 999;
                return orderA - orderB; // Sort based on order value
            });
        }

        this.notifyListeners();
    }

    // Fetch only data for this editable
    async fetchData(): Promise<void> {
        await this.fetchSelfData();
        this.notifyListeners();
    }

    // Fetch data for this editable based on type
    private async fetchSelfData(): Promise<void> {
        const fetchDataFn = this.preorderMin !== undefined && this.preorderMax !== undefined && this.preorderKey
            ? FetchInformationGet
            : FetchInformationGetAll;

        const fetchOptions = {
            number: "double",
            string: "string",
            text: "string",
            email: "string",
            tel: "string",
            color: "string",
            checkbox: "bool",
            radio: "string",
            select: "string",
            date: "datetime",
            datetime: "datetime",
            time: "datetime",
            binary: "string"
        };

        try {
            const fetchType = fetchOptions[this.type] || "string"; // Default to "string"
            this._data = await fetchDataFn(fetchType, this.name, this.preorderMin, this.preorderMax, this.preorderKey);

            if (this.type === "binary" && this._data.length) {
                this._data = this._data.map(output => ({
                    ...output,
                    output: (output.output as string).padEnd(this.options?.length ?? 0, "O"),
                }));
            }

            // Ensure default values for number and checkbox types
            this._data = await Promise.all(this._data.map(async item => ({
                ...item,
                output: this.type === 'number' && (item.output === null || item.output === undefined) ? 0 :
                    this.type === 'checkbox' && (item.output === null || item.output === undefined) ? false :
                        this.type === 'select' && (item.output === null || item.output === undefined) ? this.options[0]?.value : item.output,
                order: (this.isOrdered && item.id) && (await FetchInformationGetAll("double", item.id + 'order'))[0]?.output as number,
            })));
        } catch (error) {
            console.error(`Error fetching data for ${this.name}:`, error);
            this._data = [];
        }
    }

    // Fetch children data for a given parent ID
    private async fetchChildrenData(parentId: string): Promise<Editable[]> {
        if (this.children) {
            const childInstances: Editable[] = [];
            for (const child of this.children) {
                const childInstance = new Editable(child);
                childInstance.name = `${parentId}${child.name}`;
                await childInstance.fetchAllData();
                childInstances.push(childInstance);
            }
            return childInstances;
        }
        return [];
    }

    // Update data for a specific item
    async updateData(id: string, newValue: any, order: number): Promise<void> {
        if (!this.hasPermission) {
            throw new Error("Permission denied");
        }

        // Update the data, including order if applicable
        await FetchInformationPut(this.dbkey ?? "", id, newValue);

        // Re-sort the data based on updated order
        if (this.isOrdered && newValue.hasOwnProperty('order')) {
            this._data = this._data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }

        this._data = this._data.map(item => item.id === id ? { ...item, output: newValue, order } : item);
        this.notifyListeners();
    }

    // Delete data for a specific item
    async deleteData(id: string): Promise<void> {
        if (!this.hasPermission) {
            throw new Error("Permission denied");
        }

        await FetchInformationDelete(this.dbkey ?? "", id);
        this._data = this._data.filter(item => item.id !== id);

        // Adjust the order of remaining items
        if (this.isOrdered) {
            this._data = this._data.map((item, index) => ({ ...item, order: index + 1 }));
        }

        this.notifyListeners();
    }

    // Create new data and add it to the list, auto-assigning the "order" value
    async createData(newData: any): Promise<string> {
        if (!this.hasPermission) {
            throw new Error("Permission denied");
        }

        const newId = await FetchInformationPost(this.dbkey ?? "", [this.name], newData, [], this.isOrdered ? this._data.length + 1 : null);
        this._data.push({ id: newId, output: newData, order: this.isOrdered ? this._data.length + 1 : undefined });
        this.notifyListeners();
        return newId;
    }
}
