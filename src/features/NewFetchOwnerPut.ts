export interface PutOwnerOutput {
    id: string;
    isExisting: boolean;
}

export async function FetchOwnerPut(
    key: string,
    donator: string,
    donated: string,
    sharePermission: boolean,
    shareParent: boolean,
    sharePreorder: boolean
): Promise<PutOwnerOutput | undefined> {
    try {
        const response = await fetch('https://zapp.hostingasp.pl/owner/', {
            method: "PUT",
            credentials: 'include', // Use cookies for authentication
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                databasekey: "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                donator,
                donated,
                key,
                sharepermission: sharePermission,
                shareparent: shareParent,
                sharepreorder: sharePreorder,
            }),
        });

        if (!response.ok) {
            console.error(`Failed to update owner: ${response.statusText}`);
            return undefined;
        }

        return response.json() as Promise<PutOwnerOutput>;
    } catch (error) {
        console.error("Error in FetchOwnerPut:", error);
    }
}
