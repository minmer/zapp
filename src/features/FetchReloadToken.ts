export async function FetchReloadToken(token: string) {
    return (await fetch('https://zapp.hostingasp.pl/token/' + token))
}