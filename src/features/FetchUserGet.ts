export interface UserOutput {
    token: string,
}

export async function FetchUserGet(user: string, password: string) {

    return (await fetch('https://zapp.hostingasp.pl/user/' + user + '/' + password).then(res => res.json())) as unknown as UserOutput[]
}