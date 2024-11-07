export async function FetchContextPost(id: string, key: string, context: string, preorder: number) {
    await fetch('https://zapp.hostingasp.pl/context/', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            databasekey: "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
            key,
            information: id,
            context,
            preorder,
        }),
    });
}