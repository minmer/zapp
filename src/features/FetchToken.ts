export interface TokenOutput {
    id: string,
    token: string,
}
export async function FetchToken() {
    return (await fetch('https://zapp.hostingasp.pl/token/',
        {
            method: "POST",
            body: JSON.stringify({
                "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())) as TokenOutput
}