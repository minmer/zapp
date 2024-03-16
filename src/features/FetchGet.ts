export interface StringOutput {
    id: string,
    output: string,
}
export interface NumberOutput {
    id: string,
    output: number,
}
export async function FetchGet(type: string, token: string, context: string) {
    const data = await fetch('https://zapp.hostingasp.pl/information/' + type + '/' + token + '/' + context).then(res => res.json())
    if (type == 'text')
        data.then((data: unknown) => data as StringOutput[])
    else if (type == 'number')
        data.then((data: unknown) => data as StringOutput[])
    return data
}