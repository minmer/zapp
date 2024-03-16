export async function FetchGet(type: string, token: string, id: string, context: string[], value: [string, number], preorder: number[]) {
    try {
        const res = await fetch('https://zapp.hostingasp.pl/information/' + type + '/',
            {
                method: "POST",
                body: JSON.stringify({
                    "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                    type: value,
                    "token": token,
                    "id": id,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        const informationID = (await res.json().then(resJson => resJson.id))[0];
        for (let i = 0; i < context.length; i++)
        {
            await fetch('https://zapp.hostingasp.pl/context/',
                {
                    method: "POST",
                    body: JSON.stringify({
                        "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                        "token": token,
                        "id": id,
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