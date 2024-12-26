export async function FetchInformationPut(token: string, key: string, id: string, data: string | number | boolean | Date) {
    console.log(token, key, id, data)
    return (await fetch('https://zapp.hostingasp.pl/information/',
        {
            method: 'PUT',
            body: JSON.stringify({
                "token": token,
                "key": key,
                "id": id,
                "data": data instanceof Date ? data.getTime() : data,
                "databasekey": 'c5jY&V8;kXo!5HFy?)Z8g%qzgC',

            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }))
}