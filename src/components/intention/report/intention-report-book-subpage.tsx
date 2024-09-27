import { useEffect, useState } from "react";
import { LoadMasses, Mass } from "../../../structs/mass";
import MonthDateSelectionElement from "../../../generals/month-date-selection-element";
import EditableElement from "../../../generals/editable-element";
import { DateOutput, FetchInformationGetAll, NumberOutput, StringOutput } from "../../../features/FetchInformationGet";
import { User } from "../../../structs/user";
import { AddDaysToDate, AddTimeToDate, BetweenDates, CompareDayMonthDate, CompareMonthDay } from "../../helpers/DateComparer";
import { DaySpelling } from "../../../structs/consts";
export interface Feast {
    id: string,
    date: Date,
    description: string,
    feast: string,
    color: string,
}
export interface Issue {
    date: Date,
    type: string,
}
export interface PropMass {
    date: Date,
    intention: string[],
    description: string[],
    collective?: boolean,
}
export interface PropAppointment {
    date: Date,
    type: string,
}
export default function ItentionReportBookSubpage    ({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [masses, setMasses] = useState([] as Mass[])
    const [propEastern, setPropEastern] = useState<Date>()
    const [propStartWeek, setPropStartWeek] = useState(0)
    // const [propIssues, setPropIssues] = useState([] as Issue[])
    const [propMasses, setPropMasses] = useState([] as PropMass[])
    const [propIssues, setPropIssues] = useState([] as string[])
    //const [propAppointments, setPropAppointments] = useState([] as PropAppointment[])
    const [propFeastes, setPropFeastes] = useState([] as Feast[])
    const [date, setDate] = useState<Date>()


    useEffect(
        () => {
            (async function () {
                setPropFeastes(await Promise.all(((await FetchInformationGetAll('datetime', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', 'fest_prop')) as unknown as DateOutput[]).map(async (feast) => ({
                    id: feast.id,
                    date: AddTimeToDate(feast.output, 0, 0),
                    description: ((await FetchInformationGetAll('string', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', feast.id + 'description')) as unknown as StringOutput[])[0]?.output,
                    feast: ((await FetchInformationGetAll('string', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', feast.id + 'feast')) as unknown as StringOutput[])[0]?.output,
                    color: ((await FetchInformationGetAll('string', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', feast.id + 'color')) as unknown as StringOutput[])[0]?.output,
                } as Feast))))
            })();
        }, [getParams])

    useEffect(
        () => {
            if (date == null)
                return;
            if (propEastern?.getFullYear() == date.getFullYear())
                return;
                    (async function () {
                        const start = new Date(date.getTime())
                        start.setHours(0, 0, 0, 0)
                        start.setDate(1)
                        start.setMonth(0)
                        const { output, id } = ((await FetchInformationGetAll('datetime', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', 'eastern_prop')) as unknown as DateOutput[]).filter((eastern) => eastern.output.getFullYear() == date.getFullYear())[0]
                        if (output != null)
                        {
                            output.setHours(0,0,0,0)
                            setPropEastern(output)
                            setPropStartWeek(((await FetchInformationGetAll('double', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', id + 'start_week')) as unknown as NumberOutput[])[0]?.output ?? 0)
                        }
            })();
        }, [propEastern, date, getParams])

    useEffect(
        () => {
            if (date != null)
                (async function () {
                    setMasses(await LoadMasses(getParams, date, new Date(date.getTime() + 86400000)))
                    const dateFeast = propFeastes.find((feast) => CompareMonthDay(feast.date, date))
                    //const nextDateFeast = propFeastes.find((feast) => CompareMonthDay(feast.date, AddDaysToDate(date, 1)))
                    let tempMasses = [] as PropMass[]
                    let tempIssues = [] as string[]
                    if (date.getTime() == propEastern?.getTime()) 
                        tempMasses = [
                            { date: AddTimeToDate(date, 7, 0), intention: ['Za parafian'], description: ['Msza Rezurekcyjna'],},
                            { date: AddTimeToDate(date, 10, 0), intention: [], description:[], },
                            { date: AddTimeToDate(date, 12, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 17, 0), intention: [], description: [], },
                        ]
                    else if (date.getTime() == AddDaysToDate(propEastern, -1).getTime()) 
                        tempMasses = [
                            { date: AddTimeToDate(date, 20, 0), intention: [], description: ['Wigilia Paschalna'], },
                        ]
                    else if (date.getTime() == AddDaysToDate(propEastern, -2).getTime()) 
                        tempMasses = [
                            { date: AddTimeToDate(date, 18, 0), intention: [' - Brak intencji - '], description: ['Liturgia Męki Pańskiej'], },
                        ]
                    else if (date.getTime() == AddDaysToDate(propEastern, -3).getTime()) 
                        tempMasses = [
                            { date: AddTimeToDate(date, 18, 0), intention: [], description: ['Msza Wieczerzy Pańskiej'], },
                        ]
                    else if (date.getTime() == AddDaysToDate(propEastern, -7).getTime()) 
                        tempMasses = [
                            { date: AddTimeToDate(date, 8, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 12, 0), intention: ['Za parafian'], description: ['Procesja Palmowa'], },
                            { date: AddTimeToDate(date, 17, 0), intention: [], description: [], },
                        ]
                    else if (date.getTime() == AddDaysToDate(propEastern, -46).getTime()) 
                        tempMasses = [
                            { date: AddTimeToDate(date, 7, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 9, 30), intention: [], description: [], },
                            { date: AddTimeToDate(date, 16, 30), intention: [], description: [], },
                            { date: AddTimeToDate(date, 18, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 19, 30), intention: [], description: [], },
                        ]
                    else if (date.getTime() == AddDaysToDate(propEastern, +1).getTime()) 
                        tempMasses = [
                            { date: AddTimeToDate(date, 8, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 12, 0), intention: [], description: ['Msza Chrzcielna'], },
                            { date: AddTimeToDate(date, 17, 0), intention: [], description: [], },
                        ]              
                    else if (date.getTime() == AddDaysToDate(propEastern, +49).getTime())
                        tempMasses = [
                            { date: AddTimeToDate(date, 8, 0), intention: ['Za parafian'], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: ['Złoci Jubilaci'], description: ['Złoci Jubilaci'], },
                            { date: AddTimeToDate(date, 12, 0), intention: ['Srebrni Jubilaci'], description: ['Srebrni Jubilaci'], },
                            { date: AddTimeToDate(date, 17, 0), intention: [], description: [], },
                        ]
                    else if (date.getTime() == AddDaysToDate(propEastern, +50).getTime()) 
                        tempMasses = [
                            { date: AddTimeToDate(date, 7, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 9, 30), intention: [], description: [], },
                            { date: AddTimeToDate(date, 16, 30), intention: [], description: [], },
                            { date: AddTimeToDate(date, 18, 0), intention: [], description: [], },
                        ]
                    else if (date.getTime() == AddDaysToDate(propEastern, +60).getTime()) 
                        tempMasses = [
                            { date: AddTimeToDate(date, 8, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: ['Za parafian'], description: ['Procesja Bożego Ciała'], },
                            { date: AddTimeToDate(date, 12, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 17, 0), intention: [], description: [], },
                        ]
                    else if (date.getTime() == AddDaysToDate(propEastern, +68).getTime()) 
                        tempMasses = [
                            { date: AddTimeToDate(date, 7, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 9, 30), intention: [], description: [], },
                            { date: AddTimeToDate(date, 18, 0), intention: [], description: [], },
                        ]
                    else if (CompareMonthDay(date, new Date(2001, 4, 3)))
                        tempMasses = [
                            { date: AddTimeToDate(date, 8, 0), intention: ['Za parafian'], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: ['I Komunia Święta'], description: ['I Komunia Święta'], },
                            { date: AddTimeToDate(date, 12, 0), intention: ['I Komunia Święta'], description: ['I Komunia Święta'], },
                            { date: AddTimeToDate(date, 17, 0), intention: [], description: [], },
                        ]
                    else if (CompareMonthDay(date, new Date(2001, 11, 25)))
                        tempMasses = [
                            { date: AddTimeToDate(date, 0, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 8, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 12, 0), intention: ['Za parafian'], description: [], },
                            { date: AddTimeToDate(date, 17, 0), intention: [], description: [], },
                        ]
                    else if (CompareMonthDay(date, new Date(2001, 11, 26)))
                        tempMasses = [
                            { date: AddTimeToDate(date, 8, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 12, 0), intention: [], description: ['Msza Chrzcielna'], },
                            { date: AddTimeToDate(date, 17, 0), intention: [], description: [], },
                        ]
                    else if (CompareMonthDay(date, new Date(2001, 0, 1)))
                        tempMasses = [
                            { date: AddTimeToDate(date, 8, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 12, 0), intention: ['Za parafian'], description: [], },
                            { date: AddTimeToDate(date, 17, 0), intention: [], description: [], },
                        ]
                    else if (CompareMonthDay(date, new Date(2001, 0, 6)))
                        tempMasses = [
                            { date: AddTimeToDate(date, 8, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 12, 0), intention: ['Za parafian'], description: ['Orszak Trzech Króli'], },
                            { date: AddTimeToDate(date, 17, 0), intention: [], description: [], },
                        ]
                    else if (date.getDay() == 0) 
                        tempMasses = [
                            { date: AddTimeToDate(date, 8, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 12, 0), intention: ['Za parafian'], description: [], },
                            { date: AddTimeToDate(date, 17, 0), intention: [], description: [], },
                        ]
                    else if (dateFeast?.feast == '5' && !BetweenDates(date, AddDaysToDate(propEastern, -7), AddDaysToDate(propEastern, +7)))
                        tempMasses = [
                            { date: AddTimeToDate(date, 7, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 9, 30), intention: [], description: [], },
                            { date: AddTimeToDate(date, 16, 30), intention: [], description: [], },
                            { date: AddTimeToDate(date, 18, 0), intention: [], description: [], },
                        ]
                    else if (dateFeast?.feast == '6' && !BetweenDates(date, AddDaysToDate(propEastern, -7), AddDaysToDate(propEastern, +7)))
                        tempMasses = [
                            { date: AddTimeToDate(date, 7, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 9, 30), intention: [], description: [], },
                            { date: AddTimeToDate(date, 18, 0), intention: [], description: [], },
                        ]
                    else
                        tempMasses = [
                            { date: AddTimeToDate(date, 7, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 18, 0), intention: [], description: [], },
                        ]
                    if (CompareMonthDay(date, new Date(date.getFullYear(), 11, 24)))
                        tempMasses = tempMasses.filter((_item, index) => (index != tempMasses.length - 1))
                    if ([6, 7].find((month) => month == date.getMonth()) == null && CompareDayMonthDate(date, 0, 2))
                        tempMasses = [...tempMasses, { date: AddTimeToDate(date, 19, 0), intention: [], description: ['Msza Młodzi Duchem'], },]
                    if (date.getTime() == propEastern?.getTime())
                        tempIssues = [...tempIssues, 'Niedziela Wielkanocna']
                    else if (date.getTime() == AddDaysToDate(propEastern, -1).getTime())
                        tempIssues = [...tempIssues, 'Wielka Sobota']
                    else if (BetweenDates(date, AddDaysToDate(propEastern, -6), AddDaysToDate(propEastern, -1)))
                        tempIssues = [...tempIssues, ([true, false, false, true, false, false, true][date.getDay()] ? 'Wielka ' : 'Wielki ') + DaySpelling[date.getDay()]]
                    else if (date.getTime() == AddDaysToDate(propEastern, -7).getTime())
                        tempIssues = [...tempIssues, 'Niedziela Palmowa']
                    else if (BetweenDates(date, AddDaysToDate(propEastern, -45), AddDaysToDate(propEastern, -8))) {
                        if (BetweenDates(date, AddDaysToDate(propEastern, -45), AddDaysToDate(propEastern, -43)) && dateFeast == null)
                            tempIssues = [...tempIssues, DaySpelling[date.getDay()] + ' po Środzie Popielcowej']
                        if (BetweenDates(date, AddDaysToDate(propEastern, -42), AddDaysToDate(propEastern, -8)) && (dateFeast == null || date.getDay() == 0))
                            tempIssues = [...tempIssues, date.getDay() == 0 ? Math.floor((date.getTime() - AddDaysToDate(propEastern, -50).getTime()) / 604800000) + '. Niedziela Wielkiego Postu' : DaySpelling[date.getDay()] + ' ' + Math.floor((date.getTime() - AddDaysToDate(propEastern, -49).getTime()) / 604800000) + '. Tygodnia Wielkiego Postu']
                        if (BetweenDates(date, AddDaysToDate(propEastern, -43), AddDaysToDate(propEastern, -8)) && date.getDay() == 6 && tempMasses.length > 0)
                            tempMasses[tempMasses.length - 1].description = [...tempMasses[tempMasses.length - 1].description, 'Wigilia ' + Math.floor((date.getTime() - AddDaysToDate(propEastern, -51).getTime()) / 604800000) + '. ' + ' Niedzieli Wielkiego Postu']
                        else if (date.getTime() == AddDaysToDate(propEastern, -8).getTime() && tempMasses.length > 0)
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia Niedzieli Palmowej']
                    }
                    else if (date.getTime() == AddDaysToDate(propEastern, -46).getTime())
                        tempIssues = [...tempIssues, 'Środa Popielcowa']
                    else if (BetweenDates(date, AddDaysToDate(propEastern, 1), AddDaysToDate(propEastern, 6))) {
                        tempIssues = [...tempIssues, DaySpelling[date.getDay()] + ' Oktawy Wielkanocnej']
                        if (date.getTime() == AddDaysToDate(propEastern, 6).getTime())
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia 2. Niedzieli Wielkanocnej']
                    }
                    else if (date.getTime() == AddDaysToDate(propEastern, 7).getTime())
                        tempIssues = [...tempIssues, '2. Niedziela Wielkanocna', 'Niedziela Miłosierdzia Bożego']
                    else if (BetweenDates(new Date(date.getFullYear(), 2, 25), AddDaysToDate(propEastern, -7), AddDaysToDate(propEastern, 7)) ? date.getTime() == AddDaysToDate(propEastern, +8).getTime() : CompareMonthDay(date, new Date(2001, 2, 25))) {
                        tempIssues = [...tempIssues, 'Uroczystość Zwiastowania Pańskiego']
                        tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Adopcja dziecka poczętego']
                    }
                    else if (BetweenDates(date, AddDaysToDate(propEastern, 8), AddDaysToDate(propEastern, 49))) {
                        if (date.getTime() == AddDaysToDate(propEastern, 42).getTime())
                            tempIssues = [...tempIssues, 'Wniebowstąpienie Pańskie']
                        else if (date.getTime() == AddDaysToDate(propEastern, 49).getTime())
                            tempIssues = [...tempIssues, 'Zesłanie Ducha Świętego']
                        else if (BetweenDates(date, AddDaysToDate(propEastern, 8), AddDaysToDate(propEastern, 48)) && (dateFeast == null || date.getDay() == 0))
                            tempIssues = [...tempIssues, date.getDay() == 0 ? Math.floor((date.getTime() - AddDaysToDate(propEastern, -8).getTime()) / 604800000) + '. Niedziela Wielkanocna' : DaySpelling[date.getDay()] + ' ' + Math.floor((date.getTime() - AddDaysToDate(propEastern, -7).getTime()) / 604800000) + '. Tygodnia Okresu Wielkanocnego']
                        if (date.getTime() == AddDaysToDate(propEastern, 41).getTime())
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia Wniebowstąpienia Pańskiego']
                        else if (date.getTime() == AddDaysToDate(propEastern, 48).getTime())
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia Zesłania Ducha Świętego']
                        else if (BetweenDates(date, AddDaysToDate(propEastern, 8), AddDaysToDate(propEastern, 47)) && date.getDay() == 6)
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia ' + Math.floor((date.getTime() - AddDaysToDate(propEastern, -8).getTime()) / 604800000) + '. ' + ' Niedzieli Wielkanocnej']
                    }
                    else if (date.getTime() == AddDaysToDate(propEastern, +50).getTime())
                        tempIssues = [...tempIssues, 'Wspomnienie Najświętszej Maryi Panny Matki Kościoła', 'Drugie Święto Wielkanocne']
                    else if (date.getTime() == AddDaysToDate(propEastern, +53).getTime())
                        tempIssues = [...tempIssues, 'Święto Jezusa Chrystusa Najwyższego i Wiecznego Kapłana']
                    else if (date.getTime() == AddDaysToDate(propEastern, +60).getTime())
                        tempIssues = [...tempIssues, 'Uroczystość Najświętszego Ciała i Krwi Chrystusa']
                    else if (date.getTime() == AddDaysToDate(propEastern, +68).getTime())
                        tempIssues = [...tempIssues, 'Uroczystość Najświętszego Serca Pana Jezusa']
                    else if (date.getTime() == AddDaysToDate(propEastern, +69).getTime())
                        tempIssues = [...tempIssues, 'Wspomnienie Niepokalanego Serca Najświętszej Maryi Panny']
                    else if (date.getTime() == AddDaysToDate(new Date(date.getFullYear(), 11, 3), - 7 - new Date(date.getFullYear(), 11, 3).getDay()).getTime())
                        tempIssues = [...tempIssues, 'Uroczystość Jezusa Chrystusa, Króla Wszechświata']
                    else if (BetweenDates(date, AddDaysToDate(new Date(date.getFullYear(), 11, 3), - new Date(date.getFullYear(), 11, 3).getDay()), new Date(date.getFullYear(), 11, 31))) {
                        if (BetweenDates(date, AddDaysToDate(new Date(date.getFullYear(), 11, 3), - new Date(date.getFullYear(), 11, 3).getDay()), new Date(date.getFullYear(), 11, 24)) && dateFeast == null || date.getDay() == 0 && date.getDate() < 25)
                            tempIssues = [...tempIssues, date.getDay() == 0 ? (Math.floor((date.getTime() - AddDaysToDate(new Date(date.getFullYear(), 11, 3), - 8 - new Date(date.getFullYear(), 11, 3).getDay()).getTime()) / 604800000)) + '. Niedziela Adwentu' : DaySpelling[date.getDay()] + ' ' + (Math.floor((date.getTime() - AddDaysToDate(new Date(date.getFullYear(), 11, 3), - 7 - new Date(date.getFullYear(), 11, 3).getDay()).getTime()) / 604800000)) + '. Tygodnia Adwentu']
                        if (date.getTime() == new Date(date.getFullYear(), 11, 24).getTime())
                            tempIssues = [...tempIssues, 'Wiglia Bożego Narodzenia']
                        else if (date.getDay() == 6)
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia ' + (Math.floor((date.getTime() - AddDaysToDate(new Date(date.getFullYear(), 11, 3), - 9 - new Date(date.getFullYear(), 11, 3).getDay()).getTime()) / 604800000)) + '. ' + ' Niedzieli Adwentu']
                        if (date.getTime() == new Date(date.getFullYear(), 11, 25).getTime())
                            tempIssues = [...tempIssues, 'Uroczystość Narodzenia Pańskiego']
                        if (BetweenDates(date, new Date(date.getFullYear(), 11, 26), new Date(date.getFullYear(), 11, 31)))
                            tempIssues = [...tempIssues, date.getDay() == 0 || date.getDate() == 31 && date.getDay() == 1 ? 'Uroczystość Świętej Rodziny' : ' Oktawa Bożego Narodzenia']
                    }
                    else if (date.getTime() == new Date(date.getFullYear(), 0, 6).getTime())
                        tempIssues = [...tempIssues, 'Uroczystość Objawienia Paskiego']
                    else if (BetweenDates(date, new Date(date.getFullYear(), 0, 2), AddDaysToDate(new Date(date.getFullYear(), 0, 12), - new Date(date.getFullYear(), 0, 12).getDay()))) {
                        if (dateFeast == null && date.getDay() != 0)
                            tempIssues = [...tempIssues, 'Okres Bożego Narodzenia']
                        if (BetweenDates(date, new Date(date.getFullYear(), 0, 2), new Date(date.getFullYear(), 0, 5)) && date.getDay() == 0)
                            tempIssues = [...tempIssues, '2. Niedziela Okresu Bożego Narodzenia']
                        else if (BetweenDates(date, new Date(date.getFullYear(), 0, 2), new Date(date.getFullYear(), 0, 4)) && date.getDay() == 6)
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia 2. Niedzieli Okresu Bożego Narodzenia']
                        if (BetweenDates(date, new Date(date.getFullYear(), 0, 7), new Date(date.getFullYear(), 0, 12)) && date.getDay() == 0)
                            tempIssues = [...tempIssues, 'Niedziela Chrztu Pańskiego']
                        else if (BetweenDates(date, new Date(date.getFullYear(), 0, 7), new Date(date.getFullYear(), 0, 12)) && date.getDay() == 6)
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia Niedzieli Chrztu Pańskiego']
                    }
                    else if (date.getTime() == new Date(date.getFullYear(), 0, 7).getTime() && date.getDay() == 1)
                        tempIssues = [...tempIssues, 'Święto Chrztu Pańskiego']
                    else if (BetweenDates(date, AddDaysToDate(new Date(date.getFullYear(), 0, 12), - new Date(date.getFullYear(), 0, 12).getDay()), AddDaysToDate(propEastern, -47))) {
                        if (dateFeast == null || date.getDay() == 0)
                            tempIssues = [...tempIssues, date.getDay() == 0 ? Math.floor((date.getTime() - AddDaysToDate(new Date(date.getFullYear(), 0, 5), -new Date(date.getFullYear(), 0, 5).getDay()).getTime()) / 604800000) + '. Niedziela Okresu Zwykłego' : DaySpelling[date.getDay()] + ' ' + Math.floor((date.getTime() - AddDaysToDate(new Date(date.getFullYear(), 0, 6), -new Date(date.getFullYear(), 0, 6).getDay()).getTime()) / 604800000) + '. Tygodnia Okresu Zwykłego']
                        if (date.getDay() == 6)
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia ' + Math.floor((date.getTime() - AddDaysToDate(new Date(date.getFullYear(), 0, 4), -new Date(date.getFullYear(), 0, 4).getDay()).getTime()) / 604800000) + '. Niedzieli Okresu Zwykłego']
                    }
                    else if (BetweenDates(date, AddDaysToDate(propEastern, 51), AddDaysToDate(new Date(date.getFullYear(), 11, 3), - new Date(date.getFullYear(), 11, 3).getDay()))) {
                        if (dateFeast == null || date.getDay() == 0)
                            tempIssues = [...tempIssues, date.getDay() == 0 ? (Math.floor((date.getTime() - AddDaysToDate(propEastern, 49).getTime()) / 604800000) + propStartWeek) + '. Niedziela Okresu Zwykłego' : DaySpelling[date.getDay()] + ' ' + (Math.floor((date.getTime() - AddDaysToDate(propEastern, 50).getTime()) / 604800000) + propStartWeek) + '. Tygodnia Okresu Zwykłego']
                        if (date.getTime() == AddDaysToDate(new Date(date.getFullYear(), 11, 3), - 8 - new Date(date.getFullYear(), 11, 3).getDay()).getTime())
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia Uroczystości Jezusa Chrystusa, Króla Wszechświata']
                        if (date.getTime() == AddDaysToDate(new Date(date.getFullYear(), 11, 3), - 1 - new Date(date.getFullYear(), 11, 3).getDay()).getTime())
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia 1. Niedzieli Adwentu']
                        else if (date.getDay() == 6)
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia ' + (Math.floor((date.getTime() - AddDaysToDate(propEastern, 48).getTime()) / 604800000) + propStartWeek) + '. ' + ' Niedzieli Okresu Zwykłego']
                    }
                    if (CompareMonthDay(date, new Date(2001, 4, 2)))
                        tempIssues = [...tempIssues, 'I Spowiedź Święta']
                    if (date.getTime() == AddDaysToDate(propEastern, +1).getTime())
                        tempIssues = [...tempIssues, 'Drugie Święto Wielkanocne']
                    if (dateFeast && !BetweenDates(date, AddDaysToDate(propEastern, -7), AddDaysToDate(propEastern, +7)))
                        tempIssues = [...tempIssues, dateFeast.description]
                    if (CompareDayMonthDate(date, 4, -1))
                        tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Msza wotywna o św. Józefie']
                    if (CompareDayMonthDate(date, 6, 2)) {
                        tempMasses[tempMasses.length - 1].collective = true
                        tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Msza o Matce Bożej Zwycięskiej']
                    }
                    if (CompareDayMonthDate(date, 5, 3)) {
                        tempMasses[tempMasses.length - 1].collective = true
                        tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Msza wotywna o Miłosierdziu Bożym']
                    }
                    if (CompareMonthDay(date, new Date(2001, 11, 31)))
                        tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Zakończenie Roku']


                    setPropIssues(tempIssues)
                    setPropMasses(tempMasses)
                }
                )();
        }, [date, getParams, propFeastes, propEastern, propStartWeek])
    useEffect(
        () => {
        }, [propEastern, date])

    return (

        <>
            <MonthDateSelectionElement onSelectionChange={(date) => setDate(date)} />
            {masses.map((mass) => (<>
                <div>
                    {mass.time.toTimeString()}
                </div>
            </>))}
            {propMasses.map((mass) => (<>
                <div>
                    {mass.date.toTimeString()
                        + ' | ' +(mass.intention.map((intention, index) => ((index != 0 ? ' - ' : '') + intention)))
                        + ' | ' + (mass.description.map((description, index) => ((index != 0 ? ' - ' : '') + description)))}
                </div>
            </>))}
            {propIssues.map((issue) => (<>
                <div>
                    {issue}
                </div>
            </>))}
            <EditableElement getParams={getParams} editable={
                {
                    name: 'fest_prop',
                    type: 'date',
                    multiple: true,
                    dbkey: 'website_admin',
                    description: 'Wspomnienia',
                    viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                    isOrdered: true,
                    showdescription: true,
                    showchildren: true,
                    children: [
                        {
                            name: 'description',
                            type: 'string',
                            multiple: false,
                            description: 'Opis',
                            showchildren: false,
                        },
                        {
                            name: 'feast',
                            type: 'radio',
                            multiple: false,
                            description: 'Rodzaj',
                            showchildren: false,
                            options: [
                                { label: 'Uroczystość', value: '0' },
                                { label: 'Święto', value: '1' },
                                { label: 'Wspomnienie obowiązkowe', value: '2' },
                                { label: 'Wspomnienie dowolne', value: '3' },
                                { label: 'Układ niedzielny', value: '4' },
                                { label: 'Układ świąteczny z 16:30', value: '5' },
                                { label: 'Układ świąteczny bez 16:30', value: '6' },
                            ],
                        },
                        {
                            name: 'color',
                            type: 'color',
                            multiple: false,
                            description: 'Kolor',
                            showchildren: false,
                        },
                    ],
                }
            } />

            <EditableElement getParams={getParams} editable={
                {
                    name: 'issue_prop',
                    type: 'date',
                    multiple: true,
                    dbkey: 'website_admin',
                    description: 'Wydarzenie',
                    viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                    isOrdered: true,
                    showdescription: true,
                    showchildren: true,
                    children: [
                        {
                            name: 'description',
                            type: 'string',
                            multiple: false,
                            description: 'Opis',
                            showchildren: false,
                        },
                        {
                            name: 'feast',
                            type: 'radio',
                            multiple: false,
                            description: 'Rodzaj',
                            showchildren: false,
                            options: [
                                { label: 'Co tydzień', value: '0' },
                                { label: 'Raz w miesiącu (licząc od początku)', value: '1' },
                                { label: 'Raz w miesiącu (licząc od końca)', value: '2' },
                            ],
                        },
                        {
                            name: 'color',
                            type: 'color',
                            multiple: false,
                            description: 'Kolor',
                            showchildren: false,
                        },
                    ],
                }
            } />
            <EditableElement getParams={getParams} editable={
                {
                    name: 'eastern_prop',
                    type: 'date',
                    multiple: true,
                    dbkey: 'website_admin',
                    description: 'Wielkanoc',
                    viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                    isOrdered: true,
                    showdescription: true,
                    showchildren: true,
                    children: [
                        {
                            name: 'start_week',
                            type: 'number',
                            multiple: false,
                            description: 'Tydzień po Wielkanocy',
                            showchildren: false,
                        }
                    ],
                }
            } />
        </>
    );
}