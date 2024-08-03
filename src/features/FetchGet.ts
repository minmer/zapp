export interface StringOutput {
    id: string,
    output: string,
}
export interface NumberOutput {
    id: string,
    output: number,
}
export async function FetchGetAll(type: string, token: string, context: string, key?: string) {
    let dataString = 'https://zapp.hostingasp.pl/information/' + type + '/' + token + '/' + context
    if (key != undefined)
    {
        dataString = 'https://zapp.hostingasp.pl/information/' + type + '/' + token + '/' + context + '/' + key
    }
    let asd = "asd"
    for (let i = 0; i < 5; i++) {
        try {
            const predata = await fetch(dataString)
            if (predata.status == 204) {
                console.log('GetAll 204')
                asd = "qwe"
                break;
            }
            if (predata.status == 200) {
                if (type == 'text')
                    return predata.json() as unknown as  StringOutput[]
            else if (type == 'integer')
                return predata.json() as unknown as NumberOutput[]
            }
    }
    catch(e)
        {
            console.log('GetAll ' + i + ' ' + context)
            console.log(asd)
        console.log(e)
        }
    }
    return []
}
export async function FetchGet(type: string, token: string, context: string, start: number, end: number) {
    const data = await fetch('https://zapp.hostingasp.pl/information/' + type + '/' + token + '/' + context + '/' + start + '/' + end).then(res => res.json())
    if (type == 'text')
        data.map((data: unknown) => data as StringOutput[])
    else if (type == 'integer')
        data.map((data: unknown) => data as StringOutput[])
    return data
}