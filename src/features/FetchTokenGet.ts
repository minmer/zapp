export async function FetchTokenGet(token: string) {

    await fetch('https://zapp.hostingasp.pl/token/get/',
        {
            method: 'POST',
            body: JSON.stringify({
                "token": token,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
}