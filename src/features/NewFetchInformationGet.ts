// Generic base interface for Output with a dynamic output type
interface BaseOutput<T> {
    id: string;
    output: T;
    preorder: number;
}

// Specific output types extending BaseOutput with respective types
export type StringOutput = BaseOutput<string>;
export type NumberOutput = BaseOutput<number>;
export type DateOutput = BaseOutput<Date>;
export type BooleanOutput = BaseOutput<boolean>;

// FetchRequest interface that uses generics to specify the expected return type
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

// Process queue in batches with a delay
async function processQueue() {
    if (isProcessingQueue || requestQueue.length === 0) return;
    isProcessingQueue = true;

    while (requestQueue.length > 0) {
        const batch = requestQueue.splice(0, 1); // Adjust batch size here if needed

        for (const request of batch) {
            try {
                const result = await executeFetch(request);
                request.resolve(result);
            } catch (error) {
                request.reject(error);
            }
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay for batching
    }

    isProcessingQueue = false;
}

// Execute a fetch request and return parsed data based on type
async function executeFetch<T>(request: FetchRequest<BaseOutput<T>>): Promise<BaseOutput<T>[]> {
    const { type, context, preorderminimum, preordermaximum, key } = request;
    const url = 'https://zapp.hostingasp.pl/information/get/';
    const payload = {
        type,
        context,
        key,
        preordermaximum: preordermaximum ? preordermaximum - 1000 : undefined,
        preorderminimum: preorderminimum ? preorderminimum - 1000 : undefined,
        databasekey: 'c5jY&V8;kXo!5HFy?)Z8g%qzgC',
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    if (response.status === 204) return [];
    if (response.status === 200) {
        const data = await response.json();
        return parseData(type, data);
    }

    throw new Error(`Failed to fetch data for ${context}`);
}

// Generic parser function to handle data parsing based on type
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

// Batched FetchInformationGetAll function using generics
export function FetchInformationGetAll<T>(type: string, context: string): Promise<BaseOutput<T>[]> {
    return new Promise((resolve, reject) => {
        requestQueue.push({ type, context, resolve, reject });
        processQueue();
    });
}

// Batched FetchInformationGet function with preorderminimum and preordermaximum
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
