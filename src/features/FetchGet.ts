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
    for (let i = 0; i < 5; i++) {
        try {
            const tempData = await fetch(dataString)
            console.log(tempData)
            const data = tempData.json()
            if (type == 'text')
                return data as unknown as StringOutput[]
            else if (type == 'integer')
                return data as unknown as NumberOutput[]
            console.log(data)
        return data
    }
    catch(e)
    {
        console.log('GetAll ' + i)
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