export async function FetchInformationDelete(key: string, id: string) {
    console.log("Deleting information:", { key, id });
    return await fetch('https://zapp.hostingasp.pl/information/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            id,
            key,
            databasekey: 'c5jY&V8;kXo!5HFy?)Z8g%qzgC',
        }),
    });
}
