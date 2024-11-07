import { FetchOwnerGet } from "../../features/FetchOwnerGet";

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

    async checkPermission(token: string, dbkey?: string): Promise<boolean> {
        if (this.hasEditPermission === null) {
            this.hasEditPermission = await FetchOwnerGet(token, dbkey ?? "");
        }
        return this.hasEditPermission;
    }

    resetPermission() {
        this.hasEditPermission = null;
    }
}

export default PermissionService;