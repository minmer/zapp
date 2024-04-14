export async function FetchDelete(token: string, key: string, informationID: string) {
    try {
        await fetch('https://zapp.hostingasp.pl/information/',
            {
                method: "DELETE",
                body: JSON.stringify({
                    "token": token,
                    "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                    "key": key,
                    "id": informationID,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    } catch (err) {
        console.log(err);
    }
}