
export interface StringOutput {
    id: string,
    output: string,
    preorder: number,
}
export interface NumberOutput {
    id: string,
    output: number,
    preorder: number,
}
export interface DateOutput {
    id: string,
    output: Date,
    preorder: number,
}
export interface BooleanOutput {
    id: string,
    output: boolean,
    preorder: number,
}
export async function FetchInformationGetAll(type: string, token: string, context: string) {
    for (let i = 0; i < 5; i++) {
        try {
            const predata = await fetch('https://zapp.hostingasp.pl/information/get/',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        "type": type,
                        "token": token,
                        "context": context,

                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            if (predata.status == 204) {
                break;
            }
            if (predata.status == 200) {
                if (type == 'string')
                    return predata.json().then((data) => data as StringOutput[])
                if (type == 'long')
                    return predata.json().then((data) => data as NumberOutput[])
                if (type == 'double')
                    return predata.json().then((data) => data as NumberOutput[])
                if (type == 'bool')
                    return predata.json().then((data) => data as BooleanOutput[])
                if (type == 'datetime') {
                    const postdata = await predata.json().then((data) => data as StringOutput[])
                    return postdata.map<DateOutput>((p) => ({ id: p.id, output: new Date(Number(p.output)), preorder: p.preorder }))
                }
            }
        }
        catch (ex) {
            console.log('Error - ' + i + ' - '+ ex)
        }
    }
    return []
}
export async function FetchInformationGet(type: string, token: string, context: string, preorderminimum: number, preordermaximum: number, key: string) {
    for (let i = 0; i < 5; i++) {
        try {
            const predata = await fetch('https://zapp.hostingasp.pl/information/get/',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        "type": type,
                        "token": token,
                        "context": context,
                        "key": key,
                        "preordermaximum": preordermaximum-1000,
                        "preorderminimum": preorderminimum - 1000,

                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            if (predata.status == 204) {
                break;
            }
            if (predata.status == 200) {
                if (type == 'string')
                    return predata.json().then((data) => data as StringOutput[])
                if (type == 'long')
                    return predata.json().then((data) => data as NumberOutput[])
                if (type == 'double')
                    return predata.json().then((data) => data as NumberOutput[])
                if (type == 'bool')
                    return predata.json().then((data) => data as BooleanOutput[])
                if (type == 'datetime') {
                    const postdata = await predata.json().then((data) => data as StringOutput[])
                    return postdata.map<DateOutput>((p) => ({ id: p.id, output: new Date(Number(p.output)), preorder: p.preorder }))
                }
            }
        }
        catch (ex) {
            console.log('Error - ' + i + ' - ' + ex)
        }
    }
    return []
}