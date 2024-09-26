export async function FetchUserPut(user: string, oldpassword: string, newpassword: string) {

    const preData = await fetch('https://zapp.hostingasp.pl/user/',
        {
            method: 'PUT',
            body: JSON.stringify({
                "user": user,
                "oldpassword": oldpassword,
                "newpassword": newpassword,
                "databasekey": 'c5jY&V8;kXo!5HFy?)Z8g%qzgC',

            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    if (preData.status == 200)
        return true
    return false
}