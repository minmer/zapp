export async function FetchUserPost(user: string, password: string) {

    return(await fetch('https://zapp.hostingasp.pl/user/',
        {
            method: 'POST',
            body: JSON.stringify({
                "user": user,
                "password": password,
                "databasekey": 'c5jY&V8;kXo!5HFy?)Z8g%qzgC',

            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }))
}