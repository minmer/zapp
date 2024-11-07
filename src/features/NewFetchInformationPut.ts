export async function FetchInformationPut(
    key: string,
    id: string,
    data: string | number | boolean | Date
) {
    const response = await fetch('https://zapp.hostingasp.pl/information/', {
        method: 'PUT',
        credentials: 'include', // Include cookies for authentication
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            key,
            id,
            data: data instanceof Date ? data.getTime() : data,
            databasekey: 'c5jY&V8;kXo!5HFy?)Z8g%qzgC',
        }),
    });

    return response;
}
