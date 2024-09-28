export interface UserOutput {
    info: string,
    token: string,
}

export async function FetchUserGet(user: string, password: string) {

    const preData = await fetch('https://zapp.hostingasp.pl/user/get/',
        {
            method: 'POST',
            body: JSON.stringify({
                "user": user,
                "password": password,

            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    if (preData.status == 200)
        return preData.json() as unknown as UserOutput[]
    return null
}