export async function FetchOwnerPost(key: string, parent: string): Promise<void> {
    try {
        await fetch('https://zapp.hostingasp.pl/owner/', {
            method: "POST",
            credentials: 'include', // Include cookies for authentication
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                databasekey: "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                parent,
                key,
            }),
        });
    } catch (error) {
        console.error("Failed to create owner:", error);
    }
}
