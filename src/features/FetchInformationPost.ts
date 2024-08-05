export async function FetchInformationPost(token: string, key: string, context: string[], value: string | number | Date | boolean, preorder: number[]) {
    const res = await fetch('https://zapp.hostingasp.pl/information/',
        {
            method: "POST",
            body: JSON.stringify({
                "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                "data": value instanceof Date ? value.getTime() : value,
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
    return informationID
}