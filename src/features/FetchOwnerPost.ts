export async function FetchOwnerPost(token: string, key: string, parent: string) {
    try {
        await fetch('https://zapp.hostingasp.pl/owner/',
            {
                method: "POST",
                body: JSON.stringify({
                    "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                    "parent": parent,
                    "token": token,
                    "key": key,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    } catch (err) {
        console.log(err);
    }
}