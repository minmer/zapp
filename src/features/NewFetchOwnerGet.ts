export async function FetchOwnerGet(key: string): Promise<string | null> {
    const response = await fetch('https://zapp.hostingasp.pl/owner/get/', {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
    });

    if (response.status === 204) {
        return null; // No content, owner not found
    }

    if (response.status === 200) {
        const data = await response.json();
        return data.id; // Return the owner ID if successful
    }

    throw new Error(`Failed to fetch owner data: ${response.statusText}`);
}
