export async function FetchCheckOwner(token: string, key: string) {
    try {
        return (await fetch('https://zapp.hostingasp.pl/owner/' + token + '/' + key).then(res => res.json()));
    } catch (err) {
        console.log(err);
    }
}