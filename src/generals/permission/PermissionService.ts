import { FetchOwnerGet } from "../../features/NewFetchOwnerGet";

class PermissionService {
    private static instance: PermissionService;
    private permissions: Map<string, boolean> = new Map();

    private constructor() { }

    static getInstance(): PermissionService {
        if (!PermissionService.instance) {
            PermissionService.instance = new PermissionService();
        }
        return PermissionService.instance;
    }

    async checkPermission(key?: string): Promise<boolean> {
        if (!key) return false;

        if (!this.permissions.has(key)) {
            const hasPermission = (await FetchOwnerGet(key)) != null;
            this.permissions.set(key, hasPermission);
        }

        return this.permissions.get(key) ?? false;
    }

    resetPermission(key?: string) {
        if (key) {
            this.permissions.delete(key);
        } else {
            this.permissions.clear();
        }
    }
}

export default PermissionService;
