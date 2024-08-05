export async function FetchOwnerGet(token: string, key: string) {

    const predata = await fetch('https://zapp.hostingasp.pl/owner/get/',
        {
            method: 'POST',
            body: JSON.stringify({
                "token": token,
                "key": key,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    if (predata.status == 200)
        return true;
    return false;
}