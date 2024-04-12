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
    const data = await fetch(dataString).then(res => res.json())
    if (type == 'text')
        data.map((data: unknown) => data as StringOutput[])
    else if (type == 'integer')
        data.map((data: unknown) => data as StringOutput[])
    return data
}
export async function FetchGet(type: string, token: string, context: string, start: number, end: number) {
    const data = await fetch('https://zapp.hostingasp.pl/information/' + type + '/' + token + '/' + context + '/' + start + '/' + end).then(res => res.json())
    if (type == 'text')
        data.map((data: unknown) => data as StringOutput[])
    else if (type == 'integer')
        data.map((data: unknown) => data as StringOutput[])
    return data
}