import { FetchOwnerGet } from "../../features/NewFetchOwnerGet";

class PermissionService {
    private static instance: PermissionService;
    private hasEditPermission: boolean | null = null;

    private constructor() { }

    static getInstance(): PermissionService {
        if (!PermissionService.instance) {
            PermissionService.instance = new PermissionService();
        }
        return PermissionService.instance;
    }

    async checkPermission(key?: string): Promise<boolean> {
        if (key == null)
            this.hasEditPermission = false;
        if (this.hasEditPermission === null) {
            this.hasEditPermission = (await FetchOwnerGet(key)) != null;
        }
        return this.hasEditPermission;
    }

    resetPermission() {
        this.hasEditPermission = null;
    }
}

export default PermissionService;