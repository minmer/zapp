export interface UserOutput {
    creationtime: Date,
    token: string,
}

export async function FetchUserGet(user: string, password: string) {

    return (await fetch('https://zapp.hostingasp.pl/user/get/',
        {
            method: 'POST',
            body: JSON.stringify({
                "user": user,
                "password": password,

            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())) as unknown as UserOutput[]
}