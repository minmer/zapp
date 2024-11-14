export async function FetchInformationPost(
    key: string,
    context: string[],
    data: string | number | Date | boolean,
    preorder: number[]
): Promise<string> {
    const res = await fetch('https://zapp.hostingasp.pl/newinformation/', {
        method: "POST",
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            databasekey: "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
            data: data instanceof Date ? data.getTime() : data,
            key
        }),
    });

    const informationID = await res.json().then((resJson) => resJson.id);

    const contextRequests = context.map((ctx, i) =>
        fetch('https://zapp.hostingasp.pl/newcontext/', {
            method: "POST",
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                databasekey: "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                key,
                information: informationID,
                context: ctx,
                preorder: preorder[i],
            }),
        })
    );

    await Promise.all(contextRequests);
    return informationID;
}
