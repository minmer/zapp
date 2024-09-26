import { DateOutput, FetchInformationGet } from "../features/FetchInformationGet"
import { User } from "./user"

export interface Mass {
    id: string,
    time: Date,
    intentions?: Intention[]
}
export interface Intention {
    id: string,
    title: string,
    mass?: Mass,
    celebrator?: Priest,
    donated?: Priest,
    donation?: number,
}
export interface Priest{
    id: string,
    name: string,
    donations?: Intention[]
    celebrations?: Intention[]
}

export async function LoadMasses(getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown>, start: Date, end: Date) {
    {
        return await getParams({
            func: async (token: string | User) => {
                return (await FetchInformationGet('datetime', token as string, 'new_zielonki_mass', start.getTime(), end.getTime(), 'new_intention_viewer') as unknown as DateOutput[]).map((item) => ({ id: item.id, time: item.output } as Mass))
            }, type: 'token', show: true
        }) as Mass[]
    }
}