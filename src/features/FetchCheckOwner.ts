export async function FetchCheckOwner(token: string, key: string) {
    for (let i = 0; i < 5; i++) {
        try {
            return (await fetch('https://zapp.hostingasp.pl/owner/' + token + '/' + key).then(res => res.json()));
        }
        catch (e) {
            console.log('GetAll ' + i)
            console.log(e)
        }
    }
}