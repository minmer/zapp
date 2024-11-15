export async function FetchOwnerGet(key: string): Promise<string| undefined> {
    const response = await fetch('https://zapp.hostingasp.pl/newowner/get/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
    });

    if (response.status === 204) {
        return null;
    }

    if (response.status === 200) {
        return await response.text();
    }

    throw new Error(`Failed to fetch owner data: ${response.statusText}, ${key}`);
}
