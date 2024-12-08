export async function FetchInformationPost(
    key: string,
    context: string[],
    data: string | number | Date | boolean,
    preorder: number[],
    order?: number,  // Optional order parameter
): Promise<string> {
    // Step 1: Create the main data entry
    const res = await fetch('https://zapp.hostingasp.pl/newinformation/', {
        method: "POST",
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            databasekey: "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
            data: data instanceof Date ? data.getTime() : data,
            key,
        }),
    });

    const informationID = await res.json().then((resJson) => resJson.id);

    // Step 2: Handle context requests (other than 'order' context)
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

    // Step 3: Handle 'order' context if provided
    if (order != null) {
        const orderRes = await fetch('https://zapp.hostingasp.pl/newinformation/', {
            method: "POST",
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                databasekey: "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                data: order,
                key,
            }),
        });
        const orderID = await orderRes.json().then((resJson) => resJson.id);
        // Create 'order' context using informationID + 'order' as context key
        const orderContext = informationID + 'order';
        await fetch('https://zapp.hostingasp.pl/newcontext/', {
            method: "POST",
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                databasekey: "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                key,
                information: orderID,
                context: orderContext,
                preorder: order,  // Set preorder as the order value
            }),
        });
    }

    // Step 4: Wait for all context requests (including the order context if added)
    await Promise.all(contextRequests);
    return informationID;
}
