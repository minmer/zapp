export async function FetchContextPost(token: string, id: string, key: string, context: string, preorder: number) {
    
    await fetch('https://zapp.hostingasp.pl/context/',
        {
            method: "POST",
            body: JSON.stringify({
                "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                "token": token,
                "key": key,
                "information": id,
                "context": context,
                "preorder": preorder,

            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
}