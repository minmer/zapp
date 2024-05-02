export async function FetchContext(token: string, information: string, key: string, context: string, preorder: number) {
    try {
        await fetch('https://zapp.hostingasp.pl/context/',
            {
                method: "POST",
                body: JSON.stringify({
                    "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                    "token": token,
                    "key": key,
                    "information": information,
                    "context": context,
                    "preorder": preorder,

                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    } catch (err) {
        console.log(err);
    }
}