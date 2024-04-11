export async function FetchPost(type: string, token: string, key: string, context: string[], value: string | number, preorder: number[]) {
    try {
        const res = await fetch('https://zapp.hostingasp.pl/information/' + type,
            {
                method: "POST",
                body: JSON.stringify({
                    "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                    "text": value,
                    "integer": value,
                    "token": token,
                    "key": key,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        const informationID = (await res.json().then(resJson => resJson.id));
        for (let i = 0; i < context.length; i++)
        {
            await fetch('https://zapp.hostingasp.pl/context/',
                {
                    method: "POST",
                    body: JSON.stringify({
                        "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                        "token": token,
                        "key": key,
                        "information": informationID,
                        "context": context[i],
                        "preorder": preorder[i],

                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        }
    } catch (err) {
        console.log(err);
    }
}