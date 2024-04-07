export async function FetchShareOwner(token: string, key: string, donator: string, donated: string, sharePermission: boolean, sharePreorder: boolean) {
    try {
        await fetch('https://zapp.hostingasp.pl/permission/',
            {
                method: "POST",
                body: JSON.stringify({
                    "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                    "donator": donator,
                    "token": token,
                    "key": key,
                    "donated": donated,
                    "sharepermission": sharePermission,
                    "sharepreorder": sharePreorder,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    } catch (err) {
        console.log(err);
    }
}