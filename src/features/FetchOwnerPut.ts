export interface PutOwnerOutput {
    id: string,
    isExisting: boolean,
}

export async function FetchOwnerPut(token: string, key: string, donator: string, donated: string, sharePermission: boolean, shareParent: boolean, sharePreorder: boolean) {
    try {
        const predata = await fetch('https://zapp.hostingasp.pl/owner/',
            {
                method: "PUT",
                body: JSON.stringify({
                    "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                    "token": token,
                    "donator": donator,
                    "donated": donated,
                    "key": key,
                    "sharepermission": sharePermission,
                    "shareparent": shareParent,
                    "sharepreorder": sharePreorder,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        return await predata.json().then((data) => data as PutOwnerOutput)
    } catch (err) {
        console.log(err);
    }
}