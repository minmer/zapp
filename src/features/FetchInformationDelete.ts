export async function FetchInformationDelete(token: string, key: string, id: string) {

    return await fetch('https://zapp.hostingasp.pl/information/',
        {
            method: 'DELETE',
            body: JSON.stringify({
                "id": id,
                "token": token,
                "key": key,
                "databasekey": 'c5jY&V8;kXo!5HFy?)Z8g%qzgC',

            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
}