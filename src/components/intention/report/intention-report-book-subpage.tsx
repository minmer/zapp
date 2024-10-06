import { useEffect, useState } from "react";
import { LoadMasses, Mass } from "../../../structs/mass";
import MonthDateSelectionElement from "../../../generals/month-date-selection-element";
import EditableElement from "../../../generals/editable-element";
import { DateOutput, FetchInformationGetAll, NumberOutput, StringOutput } from "../../../features/FetchInformationGet";
import { User } from "../../../structs/user";
import { AddDaysToDate, AddTimeToDate, BetweenDates, CompareDayMonthDate, CompareMonthDay } from "../../helpers/DateComparer";
import { DaySpelling } from "../../../structs/consts";
import { FetchInformationPost } from "../../../features/FetchInformationPost";
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
export interface School {
    start: Date,
    end?: Date,
    break_start?: Date,
    break_end?: Date,
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
    const [, setMasses] = useState([] as Mass[])
    const [propEastern, setPropEastern] = useState<Date>()
    const [propStartWeek, setPropStartWeek] = useState(0)
    const [propMasses, setPropMasses] = useState([] as PropMass[])
    const [propIssues, setPropIssues] = useState([] as string[])
    const [propExams, setPropExams] = useState([] as Issue[])
    const [propSchool, setPropSchool] = useState < School | undefined>()
    const [propAppointments, setPropAppointments] = useState([] as PropAppointment[])
    const [propFeastes, setPropFeastes] = useState([] as Feast[])
    const [date, setDate] = useState<Date>()


    useEffect(
        () => {
            (async function () {
                setPropFeastes(await Promise.all(((await FetchInformationGetAll('datetime', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', 'fest_prop')) as unknown as DateOutput[]).map(async (feast) => ({
                    id: feast.id,
                    date: AddTimeToDate(feast.output, -feast.output.getHours(), -feast.output.getMinutes()),
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
                const { output, id } = ((await FetchInformationGetAll('datetime', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', 'eastern_prop')) as unknown as DateOutput[]).filter((eastern) => eastern.output.getFullYear() == date.getFullYear())[0]
                if (output != null) {
                    output.setHours(0, 0, 0, 0)
                    setPropEastern(output)
                    setPropStartWeek(((await FetchInformationGetAll('double', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', id + 'start_week')) as unknown as NumberOutput[])[0]?.output ?? 0)
                }
            })();
        }, [date, getParams, propEastern])

    useEffect(
        () => {
            if (date == null)
                return;
            if (propSchool?.start?.getFullYear() == date.getFullYear())
                return;
            (async function () {
                setPropSchool((await Promise.all(((await FetchInformationGetAll('datetime', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', 'school_prop')) as unknown as DateOutput[]).map(async (start) => ({
                    start: AddTimeToDate(start.output, -start.output.getHours(), -start.output.getMinutes()),
                    end: ((await FetchInformationGetAll('datetime', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', start.id + 'end')) as unknown as DateOutput[])[0]?.output,
                    break_start: ((await FetchInformationGetAll('datetime', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', start.id + 'break_start')) as unknown as DateOutput[])[0]?.output,
                    break_end: ((await FetchInformationGetAll('datetime', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', start.id + 'break_end')) as unknown as DateOutput[])[0]?.output,
                } as School)))).find((item) => item.start.getFullYear() == date.getFullYear()))
            })();
        }, [propSchool, date, getParams])

    useEffect(
        () => {
            (async function () {
                setPropExams((await Promise.all(((await FetchInformationGetAll('datetime', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', 'exam_prop')) as unknown as DateOutput[]).map(async (datetime) => ({
                    date: AddTimeToDate(datetime.output, -datetime.output.getHours(), -datetime.output.getMinutes()),
                    type: ((await FetchInformationGetAll('string', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', datetime.id + 'name')) as unknown as StringOutput[])[0]?.output,
                } as Issue)))))
            })();
        }, [getParams])

    useEffect(
        () => {
            if (date != null)
                (async function () {
                    setMasses(await LoadMasses(getParams, date, new Date(date.getTime() + 86400000)))
                    const dateFeast = propFeastes.find((feast) => CompareMonthDay(feast.date, date))
                    const nextDateFeast = propFeastes.find((feast) => CompareMonthDay(feast.date, AddDaysToDate(date, 1)))
                    let tempMasses = [] as PropMass[]
                    let tempIssues = [] as string[]
                    let tempAppointments = [] as PropAppointment[]
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
                            { date: AddTimeToDate(date, 10, 0), intention: ['Za parafian'], description: ['Procesja Bożego Ciała', 'Msza przy ołtarzu polowym'], },
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
                            { date: AddTimeToDate(date, 12, 0), intention: [], description: ['Msza Chrzcielna', 'Poświęcenie owies'], },
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
                    else if (CompareDayMonthDate(date, 0,-1) && date.getMonth() == 6)
                        tempMasses = [
                            { date: AddTimeToDate(date, 8, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 12, 0), intention: ['Za parafian'], description: ['Odpust parafialny'], },
                            { date: AddTimeToDate(date, 17, 0), intention: [], description: [], },
                        ]
                    else if (CompareMonthDay(date, new Date(2001, 7, 26)) && date.getDay() == 0)
                        tempMasses = [
                            { date: AddTimeToDate(date, 8, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 12, 0), intention: ['Za parafian'], description: ['Odpust parafialny'], },
                            { date: AddTimeToDate(date, 17, 0), intention: [], description: [], },
                        ]
                    else if (CompareMonthDay(date, new Date(2001, 7, 26)))
                        tempMasses = [
                            { date: AddTimeToDate(date, 7, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 9, 30), intention: [], description: [], },
                            { date: AddTimeToDate(date, 18, 0), intention: ['Za parafian'], description: ['Odpust parafialny'], },
                        ]
                    else if (CompareMonthDay(date, new Date(2001, 8, 8)) && date.getDay() == 0)
                        tempMasses = [
                            { date: AddTimeToDate(date, 8, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 12, 0), intention: ['Za parafian'], description: ['Odpust parafialny'], },
                            { date: AddTimeToDate(date, 17, 0), intention: [], description: [], },
                        ]
                    else if (CompareMonthDay(date, new Date(2001, 8, 7)) && date.getDay() == 6)
                        tempMasses = [
                            { date: AddTimeToDate(date, 7, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 18, 0), intention: ['Bierzmowanie'], description: ['Bierzmowanie'], },
                        ]
                    else if (CompareMonthDay(date, new Date(2001, 8, 8)))
                        tempMasses = [
                            { date: AddTimeToDate(date, 7, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 9, 30), intention: [], description: [], },
                            { date: AddTimeToDate(date, 18, 0), intention: ['Bierzmowanie'], description: ['Odpust parafialny'], },
                        ]
                    else if (CompareMonthDay(date, new Date(2001, 10, 1)))
                        tempMasses = [
                            { date: AddTimeToDate(date, 8, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 12, 0), intention: ['Za parafian'], description: [], },
                            { date: AddTimeToDate(date, 14, 0), intention: [], description: ['Msza na cmentarzu'], },
                        ]
                    else if (CompareMonthDay(date, new Date(2001, 10, 2)) && date.getDay() == 0)
                        tempMasses = [
                            { date: AddTimeToDate(date, 8, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 12, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 17, 0), intention: ['Za zmarłych parafian'], description: ['Procesja do cmentarza'], },
                        ]
                    else if (CompareMonthDay(date, new Date(2001, 10, 11)) && date.getDay() != 0)
                        tempMasses = [
                            { date: AddTimeToDate(date, 7, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 10, 0), intention: [], description: ['Za Ojczyznę'], },
                            { date: AddTimeToDate(date, 18, 0), intention: [], description: [], },
                        ]
                    else if (CompareMonthDay(date, new Date(2001, 10, 2)))
                        tempMasses = [
                            { date: AddTimeToDate(date, 7, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 8, 0), intention: [], description: [], },
                            { date: AddTimeToDate(date, 18, 0), intention: ['Za zmarłych parafian'], description: ['Procesja do cmentarza'], },
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
                    if (BetweenDates(date, AddDaysToDate(new Date(date.getFullYear(), 11, 3), - new Date(date.getFullYear(), 11, 3).getDay()), new Date(date.getFullYear(), 11, 24)) && date.getDate() != 8) {
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 7)
                        if (mass)
                            mass.date = AddTimeToDate(date ,6, 30)
                    }



                    if (date.getTime() == propEastern?.getTime())
                        tempIssues = [...tempIssues, 'Niedziela Wielkanocna']
                    else if (date.getTime() == AddDaysToDate(propEastern, -1).getTime())
                        tempIssues = [...tempIssues, 'Wielka Sobota']
                    else if (BetweenDates(date, AddDaysToDate(propEastern, -6), AddDaysToDate(propEastern, -1)))
                        tempIssues = [...tempIssues, ([true, false, false, true, false, false, true][date.getDay()] ? 'Wielka ' : 'Wielki ') + DaySpelling[date.getDay()]]
                    else if (date.getTime() == AddDaysToDate(propEastern, -7).getTime()) {
                        tempIssues = [...tempIssues, 'Niedziela Palmowa']
                        tempAppointments = [...tempAppointments,
                            {
                                date: AddTimeToDate(date, 11,30), type: 'Konkurs Palm'
                            },]
                    }
                    else if (BetweenDates(date, AddDaysToDate(propEastern, -45), AddDaysToDate(propEastern, -8))) {
                        if (BetweenDates(date, AddDaysToDate(propEastern, -45), AddDaysToDate(propEastern, -43)) && dateFeast == null)
                            tempIssues = [...tempIssues, DaySpelling[date.getDay()] + ' po Środzie Popielcowej']
                        if (BetweenDates(date, AddDaysToDate(propEastern, -42), AddDaysToDate(propEastern, -8)) && (dateFeast == null || date.getDay() == 0))
                            tempIssues = [...tempIssues, date.getDay() == 0 ? Math.floor((date.getTime() - AddDaysToDate(propEastern, -50).getTime()) / 604800000) + '. Niedziela Wielkiego Postu' : DaySpelling[date.getDay()] + ' ' + Math.floor((date.getTime() - AddDaysToDate(propEastern, -49).getTime()) / 604800000) + '. Tygodnia Wielkiego Postu']
                        if (date.getTime() == AddDaysToDate(propEastern, -8).getTime())
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia Niedzieli Palmowej']
                        else if (BetweenDates(date, AddDaysToDate(propEastern, -43), AddDaysToDate(propEastern, -8)) && date.getDay() == 6 && tempMasses.length > 0)
                            tempMasses[tempMasses.length - 1].description = [...tempMasses[tempMasses.length - 1].description, 'Wigilia ' + Math.floor((date.getTime() - AddDaysToDate(propEastern, -51).getTime()) / 604800000) + '. ' + ' Niedzieli Wielkiego Postu']
                        
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
                        if (BetweenDates(date, new Date(date.getFullYear(), 11, 17), new Date(date.getFullYear(), 11, 24)) && date.getDay() != 0)
                            tempIssues = [...tempIssues, date.getDate() + '. Grudnia']
                        else if (BetweenDates(date, AddDaysToDate(new Date(date.getFullYear(), 11, 3), - new Date(date.getFullYear(), 11, 3).getDay()), new Date(date.getFullYear(), 11, 24)) && dateFeast == null || date.getDay() == 0 && date.getDate() < 25)
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
                    else if (CompareDayMonthDate(date, 0, -1) && date.getMonth() == 9)
                        tempIssues = [...tempIssues, 'Rocznica poświęcenia Kościoła']
                    else if (date.getTime() == new Date(date.getFullYear(), 10, 2).getTime())
                        tempIssues = [...tempIssues, 'Wspomnienie wszystkich wiernych zmarłych']
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
                    if (BetweenDates(new Date(date.getFullYear(), 2, 25), AddDaysToDate(propEastern, -7), AddDaysToDate(propEastern, 7)) ? date.getTime() == AddDaysToDate(propEastern, +8).getTime() : CompareMonthDay(date, new Date(2001, 2, 25))) {
                        tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Adopcja dziecka poczętego']
                        if (date.getDate() != 25)
                            tempIssues = [...tempIssues, 'Uroczystość Zwiastowania Pańskiego']
                    }
                    if (BetweenDates(date, new Date(date.getFullYear(), 7, 6), new Date(date.getFullYear(), 7, 11)))
                        tempIssues = [...tempIssues, 'Pielgrzymka Krakowska']
                    if (CompareMonthDay(date, new Date(2001, 4, 2)))
                        tempIssues = [...tempIssues, 'I Spowiedź Święta']
                    if (CompareMonthDay(date, new Date(2001, 10, 11)))
                        tempIssues = [...tempIssues, 'Święto Niepodległości']
                    else if (date.getTime() == AddDaysToDate(propEastern, +1).getTime())
                        tempIssues = [...tempIssues, 'Drugie Święto Wielkanocne']
                    if (dateFeast && !BetweenDates(date, AddDaysToDate(propEastern, -7), AddDaysToDate(propEastern, +7)))
                        tempIssues = [...tempIssues, dateFeast.description]
                    if (nextDateFeast && !BetweenDates(date, AddDaysToDate(propEastern, -7), AddDaysToDate(propEastern, +7)) && date.getDay() != 0 && date.getDay() != 0 && ['0', '4', '5', '6'].find((feast) => feast == nextDateFeast.feast))
                        tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), nextDateFeast.description.replace('Uroczystość', 'Wigilia uroczystości')]
                    if (CompareDayMonthDate(date, 4, 1))
                        tempMasses[tempMasses.length - 1].intention = [...(tempMasses[tempMasses.length - 1].intention), 'O powołania kapłańskie, zakonne i misyjne, umocnienie istniejących oraz łaski dla osób konsekrowanych pracujących i wywodzących się z naszej parafii, a dla tych, co już odeszli do domu Pana o życie wieczne']
                    if (CompareDayMonthDate(date, 6, 1))
                        tempMasses[tempMasses.length - 1].intention = [...(tempMasses[tempMasses.length - 1].intention), 'W intencji wynagaradzającej za grzechy przeciwko Niepokalanemu Sercu Najświętszej Maryi Panny']
                    if (CompareDayMonthDate(date, 0, -1)) {
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 12)
                        if (mass)
                            mass.intention = [...(mass.intention), 'Za Ojczyznę']
                    }
                    if (CompareDayMonthDate(date, 0, -1) && date.getMonth() == 6)
                        tempIssues = [...tempIssues, 'Odpust parafialny']
                    if (CompareDayMonthDate(date, 4, -1)) {
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 18)
                        if (mass)
                            mass.description = [...(mass.description), 'Msza przy ołtarzu św. Józefa'
                                , 'Msza wotywna o św. Józefie']
                    }
                    if (CompareDayMonthDate(date, 6, 2)) {
                        tempMasses[tempMasses.length - 1].collective = true
                        tempMasses[tempMasses.length - 1].date = AddTimeToDate(tempMasses[tempMasses.length - 1].date, 0, 15)
                        tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Msza o Matce Bożej Zwycięskiej']
                        tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 17, 30), type: 'Wystawienie Najświętszego Sakramentu' },
                        { date: AddTimeToDate(date, 18, 0), type: 'Nabożeństwo do Matki Bożej Zwycięskiej' },]
                    }
                    if (CompareDayMonthDate(date, 5, 3)) {
                        tempMasses[tempMasses.length - 1].collective = true
                        tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Msza wotywna o Miłosierdziu Bożym']
                    }
                    if (CompareMonthDay(date, new Date(2001, 11, 31)))
                        tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Zakończenie Roku', 'Nieszpory']
                    if (CompareMonthDay(date, propSchool?.start)) {
                        tempIssues = [...tempIssues, 'Rozpoczęcie Roku Szkolnego']
                        tempMasses = [...tempMasses, { date: AddTimeToDate(date, 8, 30), intention: ['W intencji uczniów, nauczycieli oraz pracowników szkoły'], description: ['Rozpoczęcie Roku Szkolnego'], },]
                    }
                    else if (CompareMonthDay(date, propSchool?.end)) {
                        tempIssues = [...tempIssues, 'Zakończenie Roku Szkolnego']
                        tempMasses = [...tempMasses, { date: AddTimeToDate(date, 8, 0), intention: ['W intencji uczniów, nauczycieli oraz pracowników szkoły'], description: ['Zakończenie Roku Szkolnego'], },]
                    }
                    else if (BetweenDates(date, propSchool?.break_start, propSchool?.break_end))
                        tempIssues = [...tempIssues, 'Ferie zimowe']



                    if (date.getDay() == 0) {
                        if (tempMasses.find((mass) => mass.date.getHours() == 8) != null)
                            tempAppointments = [...tempAppointments, { date: AddTimeToDate(date, 7, 45), type: 'Wypominki' }]
                        if (tempMasses.find((mass) => mass.date.getHours() == 10) != null)
                            tempAppointments = [...tempAppointments, { date: AddTimeToDate(date, 9, 45), type: 'Wypominki' }]
                        if (tempMasses.find((mass) => mass.date.getHours() == 12) != null)
                            tempAppointments = [...tempAppointments, { date: AddTimeToDate(date, 11, 45), type: 'Wypominki' }]
                    }
                    if ((CompareDayMonthDate(date, 0, -2) && date.getMonth() != 6) || (CompareDayMonthDate(date, 0, -3) && date.getMonth() == 6))
                        tempAppointments = [...tempAppointments, { date: AddTimeToDate(date, 18, 0), type: 'Przygotowanie do Chrztu' }]
                    if ((CompareDayMonthDate(date, 0, -1) && date.getMonth() != 6) || (CompareDayMonthDate(date, 0, -2) && date.getMonth() == 6)) {
                        tempAppointments = [...tempAppointments, { date: AddTimeToDate(date, 12, 0), type: 'Chrzty (na Mszy):' }]
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 12)
                        if (mass)
                            mass.description = [...(mass.description), 'Msza Chrzcielna']
                    }
                    else if (date.getDay() == 0)
                        tempAppointments = [...tempAppointments, { date: AddTimeToDate(date, 13, 0), type: 'Chrzty (po Mszy):' }]
                    if (date.getTime() == AddDaysToDate(propEastern, -47).getTime() && date.getTime() == AddDaysToDate(propEastern, -48).getTime())
                        tempAppointments = [...tempAppointments,
                        { date: AddTimeToDate(date, 7, 30), type: 'Nabożeństwo 40-godzinne' },
                        { date: AddTimeToDate(date, 9, 0), type: 'Schowanie Najświętszego Sakramentu' },
                            { date: AddTimeToDate(date, 16, 30), type: 'Nabożeństwo 40-godzinne' },]
                    else if (date.getTime() == AddDaysToDate(propEastern, -49).getTime())
                        tempAppointments = [...tempAppointments,
                        { date: AddTimeToDate(date, 14, 0), type: 'Nabożeństwo 40-godzinne' },
                        { date: AddTimeToDate(date, 15, 0), type: 'Nabożeństwo 40-godzinne' },
                            { date: AddTimeToDate(date, 16, 0), type: 'Nabożeństwo 40-godzinne' },]
                    if (date.getDay() == 3 && AddDaysToDate(propEastern, -46).getTime() != date.getTime()) {
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 18)
                        if (mass) {
                            mass.date = AddTimeToDate(mass.date, 0, 15)
                            mass.description = [...(mass.description), 'Nowenna do Matki Bożej Nieustającej Pomocy',
                                'Msza w kaplicy Matki Bożej']
                            tempAppointments = [...tempAppointments,
                                { date: AddTimeToDate(date, 17, 30), type: 'Adoracja Najświętszego Sakramentu' },
                                { date: AddTimeToDate(date, 17, 30), type: 'Różaniec w kaplicy Matki Bożej' },
                                { date: AddTimeToDate(date, 18, 0), type: 'Nowenna do Matki Bożej Nieustającej Pomocy' },]
                        }
                    }
                    if (BetweenDates(date, AddDaysToDate(propEastern, 37), AddDaysToDate(propEastern, 39)))
                        tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 17, 50), type: 'Dni Krzyżowe' },]
                    if (BetweenDates(date, AddDaysToDate(propEastern, -45), AddDaysToDate(propEastern, -7)))
                        if (AddDaysToDate(propEastern, -7).getTime() == date.getTime()) {
                            tempAppointments = [...tempAppointments,
                                { date: AddTimeToDate(date, 16, 0), type: 'Gorzkie Żale' },
                                { date: AddTimeToDate(date, 19, 0), type: 'Droga Krzyżowa ulicami Zielonek' },]
                        }
                        else if (date.getDate() == 0)
                            tempAppointments = [...tempAppointments,
                                { date: AddTimeToDate(date, 13, 0), type: 'Droga Krzyżowa' },
                                { date: AddTimeToDate(date, 16, 0), type: 'Gorzkie Żale' },]
                        else if (AddDaysToDate(propEastern, -9).getTime() == date.getTime()) {
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 17, 15), type: 'Droga Krzyżowa dla dzieci' },
                                { date: AddTimeToDate(date, 18, 30), type: 'Droga Krzyżowa dla dorosłych' },]
                            tempMasses = [...tempMasses, { date: AddTimeToDate(date, 20, 0), intention: [], description: ['Ekstremalna Droga Krzyżowa'], },]
                        }
                        else if (date.getDay() == 5)
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 17, 15), type: 'Droga Krzyżowa dla dzieci' },
                            { date: AddTimeToDate(date, 18, 30), type: 'Droga Krzyżowa dla dorosłych' },
                                { date: AddTimeToDate(date, 20, 0), type: 'Droga Krzyżowa dla młodzieży' },]
                    if (CompareDayMonthDate(date, 2, 1))
                        tempAppointments = [...tempAppointments, { date: AddTimeToDate(date, 19, 30), type: 'Adoracja Najświętszego Sakramentu' }]
                    if (CompareDayMonthDate(date, 5, 1))
                            tempAppointments = [...tempAppointments, { date: AddTimeToDate(date, 17, 0), type: 'Spowiedź I Piątkowa' },
                            { date: AddTimeToDate(date, 18, 30), type: 'Nabożeństwo do Najświętszego Serca Pana Jezusa' },]
                    if (CompareDayMonthDate(date, 6, 1)) {
                        tempAppointments = [...tempAppointments, { date: AddTimeToDate(date, 17, 15), type: 'Nabożeństwo I Sobót' }]
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 18)
                        if (mass)
                            mass.description = [...(mass.description), 'Msza w kaplicy Matki Bożej']
                    }
                    else if (date.getDay() == 6) {
                        tempAppointments = [...tempAppointments, { date: AddTimeToDate(date, 17, 30), type: 'Różaniec w kaplicy Matki Bożej' }]
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 18)
                        if (mass)
                            mass.description = [...(mass.description), 'Msza w kaplicy Matki Bożej']
                    }
                    if (date.getTime() == AddDaysToDate(propEastern, -3).getTime())
                        tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 17, 0), type: 'Spowiedź Święta' },
                            { date: AddTimeToDate(date, 20, 0), type: 'Adoracja w ciemnicy' },
                            { date: AddTimeToDate(date, 21, 0), type: 'Adoracja dla młodzieży' },
                            { date: AddTimeToDate(date, 22, 0), type: 'Zakończenie adoracji' },]
                    else if (date.getTime() == AddDaysToDate(propEastern, -2).getTime())
                        tempAppointments = [...tempAppointments,
                        { date: AddTimeToDate(date, 7, 0), type: 'Rozpoczęcie adoracji' },
                        { date: AddTimeToDate(date, 7, 0), type: 'Wezwanie, Godzina Czytań i Jutrznia' },
                        { date: AddTimeToDate(date, 10, 0), type: 'Droga Krzyżowa dla dzieci do 3. klasy' },
                        { date: AddTimeToDate(date, 12, 0), type: 'Droga Krzyżowa dla klasy 4. i 5.' },
                        { date: AddTimeToDate(date, 14, 0), type: 'Droga Krzyżowa dla klasy 6. i 7.' },
                        { date: AddTimeToDate(date, 15, 0), type: 'Koronka do Miłosierdzia Bożego' },
                        { date: AddTimeToDate(date, 15, 15), type: 'Droga Krzyżowa dla młodzieży' },
                        { date: AddTimeToDate(date, 17, 15), type: 'Droga Krzyżowa' },
                        { date: AddTimeToDate(date, 17, 0), type: 'Spowiedź Święta' },
                        { date: AddTimeToDate(date, 18, 0), type: 'Liturgia Męki Pańskiej' },
                        { date: AddTimeToDate(date, 20, 0), type: 'Gorzkie Żale' },
                        { date: AddTimeToDate(date, 20, 0), type: 'Spowiedź Święta' },
                        { date: AddTimeToDate(date, 21, 0), type: 'Spowiedź Święta' },
                        { date: AddTimeToDate(date, 22, 0), type: 'Spowiedź Święta' },
                        { date: AddTimeToDate(date, 23, 0), type: 'Spowiedź Święta' },
                        { date: AddTimeToDate(date, 12, 30), type: 'Spowiedź Święta po Drodze Krzyżowej' },
                            { date: AddTimeToDate(date, 14, 30), type: 'Spowiedź Święta po Drodze Krzyżowej' },]
                    else if (date.getTime() == AddDaysToDate(propEastern, -1).getTime())
                        tempAppointments = [...tempAppointments,
                        { date: AddTimeToDate(date, 7, 0), type: 'Rozpoczęcie adoracji' },
                        { date: AddTimeToDate(date, 7, 0), type: 'Wezwanie, Godzina Czytań i Jutrznia' },
                        { date: AddTimeToDate(date, 9, 50), type: 'Spowiedź Święta' },
                        { date: AddTimeToDate(date, 10, 0), type: 'Poświęcenie Pokarmów' },
                        { date: AddTimeToDate(date, 10, 20), type: 'Spowiedź Święta' },
                        { date: AddTimeToDate(date, 10, 30), type: 'Poświęcenie Pokarmów' },
                        { date: AddTimeToDate(date, 10, 50), type: 'Spowiedź Święta' },
                        { date: AddTimeToDate(date, 11, 0), type: 'Poświęcenie Pokarmów' },
                        { date: AddTimeToDate(date, 11, 20), type: 'Spowiedź Święta' },
                        { date: AddTimeToDate(date, 11, 30), type: 'Poświęcenie Pokarmów' },
                        { date: AddTimeToDate(date, 11, 50), type: 'Spowiedź Święta' },
                        { date: AddTimeToDate(date, 12, 0), type: 'Poświęcenie Pokarmów' },
                        { date: AddTimeToDate(date, 12, 30), type: 'Poświęcenie Pokarmów - Garlica Murowana' },
                        { date: AddTimeToDate(date, 13, 0), type: 'Poświęcenie Pokarmów - Pękowice' },
                            { date: AddTimeToDate(date, 15, 0), type: 'Poświęcenie Pokarmów' },]
                    else if (date.getTime() == propEastern?.getTime())
                        tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 16, 30), type: 'Nieszpory' },]
                    if (BetweenDates(date, new Date(date.getFullYear(), 3, 29), new Date(date.getFullYear(), 4, 7))) {
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 18 || mass.date.getHours() == 17)
                        if (mass) {
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, mass.date.getHours() - 1, 50), type: 'Nowenna do św. Stanisława' },]
                        }
                    }
                    if (date.getDate() > 12 && date.getDate() < 20 && date.getDay()== 0 && date.getMonth() > 3 && date.getMonth() < 10)
                        tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 16, 0), type: 'Nabożeństwo Fatimskie' },]
                    else if (CompareDayMonthDate(date, 0, 1) && date.getMonth() == 9) {
                        tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 13, 0), type: 'Procesja Różańcowa' },]
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 12)
                        if (mass)
                            mass.description = [...mass.description, 'Procesja Różańcowa']
                    }
                    else if (BetweenDates(date, AddDaysToDate(propEastern, 61), AddDaysToDate(propEastern, 67))) {
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 18 || mass.date.getHours() == 17)
                        if (mass)
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 18, mass.date.getHours() == 17 ? 0 : 30), type: 'Procesja Oktawy Bożego Ciała' },]
                    }
                    else if (BetweenDates(date, new Date(date.getFullYear(), 4, 1), new Date(date.getFullYear(), 4, 31))) {
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 18 || mass.date.getHours() == 17)
                        if (mass)
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 18, mass.date.getHours() == 17 ? 0 : 30), type: 'Nabożeństwo Majowe' },]
                    }
                    else if (BetweenDates(date, new Date(date.getFullYear(), 5, 1), new Date(date.getFullYear(), 5, 30))) {
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 18 || mass.date.getHours() == 17)
                        if (mass)
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 18, mass.date.getHours() == 17 ? 0 : 30), type: 'Nabożeństwo Czerwcowe' },]
                    }
                    else if (BetweenDates(date, new Date(date.getFullYear(), 9, 1), new Date(date.getFullYear(), 9, 31))) {
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 18 || mass.date.getHours() == 17)
                        if (mass) {
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, mass.date.getHours() == 17 ? 16 : 17, 30), type: 'Nabożeństwo Różańcowe' },]
                            mass.date = AddTimeToDate(mass.date, 0, 5)
                        }
                        if (date.getDay() != 0 && date.getDay() != 6)
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 7, 40), type: '10-tka Różańca' },]
                    }
                    if (date.getDay() == 2 || date.getDay() == 4)
                        tempAppointments = [...tempAppointments,
                        { date: AddTimeToDate(date, 16, 30), type: 'Kancelaria parafialna' },]
                    else if (date.getDay() == 6)
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 8, 30), type: 'Kancelaria parafialna' },]
                    if (CompareMonthDay(date, new Date(2001, 7, 15)))
                        tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 11, 30), type: 'Konkurs bukietów' },]
                    if (CompareMonthDay(date, new Date(2001, 7, 6)))
                        tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 11, 30), type: 'Postój Wspólnoty 2 (Pielgrzymka Krakowska)' },]
                    if (CompareMonthDay(date, new Date(2001, 10, 1)))
                        tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 20, 0), type: 'Różaniec na cmentarzu' },]
                    if (BetweenDates(date, new Date(date.getFullYear(), 10, 3), new Date(date.getFullYear(), 10, 8)) && date.getDay() != 0)
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 17, 15), type: 'Różaniec z wypominkami jednorazowymi' },]
                    if (date.getTime() == new Date(date.getFullYear(), 11, 27).getTime()) {
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 7)
                        if (mass)
                            mass.description = [...mass.description, 'Poświęcenie wina']
                    }
                    if (date.getTime() == new Date(date.getFullYear(), 1, 3).getTime()) {
                        const mass = tempMasses.find((mass) => mass.date.getHours() == 7)
                        if (mass)
                            mass.description = [...mass.description, 'Poświęcenie jabłek']
                    }
                    if (CompareDayMonthDate(date, 0, 2) && date.getMonth() == 4)
                        tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 9, 0), type: 'Procesja na Skałce' },]
                    if (propExams?.find((exam) => exam.date.getTime() == date.getTime()) != null)
                        tempIssues = [...tempIssues, propExams?.find((exam) => exam.date.getTime() == date.getTime())?.type ?? '']
                    if (propExams?.find((exam) => exam.date.getTime() - 86400000 == date.getTime()) != null) {
                        tempMasses[tempMasses.length - 1].intention = [...(tempMasses[tempMasses.length - 1].intention), 'W intencji uczniów rozpoczynających egzaminy']
                        tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Z okazji ' + propExams?.find((exam) => exam.date.getTime() - 86400000 == date.getTime())?.type?.replace('Rozpoczęcie','rozpoczęcia')]
                    }
                    if ((CompareDayMonthDate(date, 1, 1) && [8, 9, 11, 1, 2, 3].find((month) => month == date.getMonth())) || CompareDayMonthDate(AddDaysToDate(date, -2), 6, 1) && date.getMonth() == 10)
                        tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(date, 18, 30), type: 'Spotkanie dla przygotowujących do I Komunii Świętej' },]



                    setPropIssues(tempIssues)
                    setPropMasses(tempMasses)
                    setPropAppointments(tempAppointments.sort((a, b) => a.date.getTime() - b.date.getTime()))
                }
                )();
            }, [date, getParams, propFeastes, propEastern, propStartWeek, propExams, propSchool])

    const onCreate = () => {
        getParams({
        func: async (param: string | User) => {
            const token = param as string
                for (let i = 0; i < propMasses.length; i++) {
                    const massID = await FetchInformationPost(token, 'new_intention_admin', ['new_zielonki_mass'], propMasses[i].date, [propMasses[i].date.getTime()])
                    for (let j = 0; j < propMasses[i].intention.length; j++)
                        await FetchInformationPost(token, 'new_intention_admin', [massID + 'intention'], propMasses[i].intention[j], [1])
                    if (propMasses[i].description.length != 0)
                        await FetchInformationPost(token, 'new_intention_admin', [massID + 'description'], propMasses[i].description[0], [1])
                    else if (propIssues.length != 0)
                        await FetchInformationPost(token, 'new_intention_admin', [massID + 'description'], propIssues[0], [1])
                    if (propMasses[i].collective == true)
                        await FetchInformationPost(token, 'new_intention_admin', [massID + 'collective'], true, [1])

            }
            }, type: 'token', show: false
        });
    }
    return (

        <>
            <MonthDateSelectionElement onSelectionChange={(date) => setDate(date)} />
            {propMasses.map((mass) => (<>
                <div key={mass.date.getTime()}>
                    {mass.date.toTimeString()
                        + ' | ' +(mass.intention.map((intention, index) => ((index != 0 ? ' - ' : '') + intention)))
                        + ' | ' + (mass.description.map((description, index) => ((index != 0 ? ' - ' : '') + description)))}
                </div>
            </>))}
            {propIssues.map((issue) => (<>
                <div key={issue}>
                    {issue}
                </div>
            </>))}
            {propAppointments.map((appointment) => (<>
                <div key={appointment.date.getTime() + appointment.type}>
                    {appointment.date.getHours() + ':' + appointment.date.getMinutes().toString().padStart(2, '0') + ' - ' + appointment.type}
                </div>
            </>))}
            <input type='button' value='Przygotuj dzień' onClick={ onCreate} />
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
                    name: 'exam_prop',
                    type: 'date',
                    multiple: true,
                    dbkey: 'website_admin',
                    description: 'Egzaminy',
                    viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                    isOrdered: true,
                    showdescription: true,
                    showchildren: true,
                    children: [
                        {
                            name: 'name',
                            type: 'string',
                            multiple: false,
                            description: 'Rozpoczęcie...',
                            showchildren: false,
                        }
                    ],
                }
            } />
            <EditableElement getParams={getParams} editable={
                {
                    name: 'school_prop',
                    type: 'date',
                    multiple: true,
                    dbkey: 'website_admin',
                    description: 'Szkoła',
                    viewertoken: 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc',
                    isOrdered: true,
                    showdescription: true,
                    showchildren: true,
                    children: [
                        {
                            name: 'break_start',
                            type: 'date',
                            multiple: false,
                            description: 'Początek ferii',
                            showchildren: false,
                        },
                        {
                            name: 'break_end',
                            type: 'date',
                            multiple: false,
                            description: 'Koniec ferii',
                            showchildren: false,
                        },
                        {
                            name: 'end',
                            type: 'date',
                            multiple: false,
                            description: 'Zakończenie',
                            showchildren: false,
                        }
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