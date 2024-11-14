// Generic base interface for Output with a dynamic output type
export interface BaseOutput<T> {
    id: string;
    output: T;
    preorder: number;
}

export type StringOutput = BaseOutput<string>;
export type NumberOutput = BaseOutput<number>;
export type DateOutput = BaseOutput<Date>;
export type BooleanOutput = BaseOutput<boolean>;

interface FetchRequest<T> {
    type: string;
    context: string;
    preorderminimum?: number;
    preordermaximum?: number;
    key?: string;
    resolve: (value: T[]) => void;
    reject: (reason?: any) => void;
}

const requestQueue: FetchRequest<any>[] = [];
let isProcessingQueue = false;

async function processQueue() {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    try {
        while (requestQueue.length > 0) {
            await executeFetchBatch();
        }
    } finally {
        isProcessingQueue = false;
    }
} async function executeFetchBatch() {
    const url = 'https://zapp.hostingasp.pl/newinformation/batch/';

    const currentBatch = [...requestQueue];

    const payload = currentBatch.map(request =>
        request.key
            ? {
                Type: request.type,
                Context: request.context,
                Key: request.key,
                PreorderMaximum: request.preordermaximum - 1000,
                PreorderMinimum: request.preorderminimum - 1000,
            }
            : {
                Type: request.type,
                Context: request.context,
            }
    );

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
        });

        if (response.status === 200) {
            const data = await response.json();
            data.forEach((result: any, index: number) => {
                const request = currentBatch[index];
                request.resolve(parseData(request.type, result));
            });
        } else {
            const errorText = await response.text();
            console.error("Batch request failed with status:", response.status, "Response:", errorText);
            throw new Error(`Batch request failed with status: ${response.status}`);
        }
    } catch (error) {
        currentBatch.forEach(request => request.reject(error));
    } finally {
        requestQueue.splice(0, currentBatch.length);
    }
}


function parseData(type: string, data: any): BaseOutput<any>[] {
    switch (type) {
        case 'string':
            return data as BaseOutput<string>[];
        case 'long':
        case 'double':
            return data as BaseOutput<number>[];
        case 'bool':
            return data as BaseOutput<boolean>[];
        case 'datetime':
            return (data as BaseOutput<string>[]).map<BaseOutput<Date>>((item) => ({
                id: item.id,
                preorder: item.preorder,
                output: new Date(Number(item.output)),
            }));
        default:
            return [];
    }
}

export function FetchInformationGetAll<T>(type: string, context: string): Promise<BaseOutput<T>[]> {
    return new Promise((resolve, reject) => {
        requestQueue.push({ type, context, resolve, reject });
        processQueue();
    });
}

export function FetchInformationGet<T>(
    type: string,
    context: string,
    preorderminimum: number,
    preordermaximum: number,
    key: string
): Promise<BaseOutput<T>[]> {
    return new Promise((resolve, reject) => {
        requestQueue.push({ type, context, preorderminimum, preordermaximum, key, resolve, reject });
        processQueue();
    });
}
