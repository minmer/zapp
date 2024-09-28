interface TokenOutput
{
    info: string
}

export async function FetchTokenGet(token: string) {

    const preData = await fetch('https://zapp.hostingasp.pl/token/get/',
        {
            method: 'POST',
            body: JSON.stringify({
                "token": token,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    if (preData.status == 200)
        return preData.json() as unknown as TokenOutput[]
    return null
}