import { useEffect, useState } from "react";
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
    color?: string,
}
export interface PropAppointment {
    date: Date,
    type: string,
}
export default function IntentionReportBookSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [prepare, setPrepare] = useState(false)
    const [propEastern, setPropEastern] = useState<Date>()
    const [propStartWeek, setPropStartWeek] = useState(0)
    const [propMasses, setPropMasses] = useState([] as PropMass[])
    const [propIssues, setPropIssues] = useState([] as string[])
    const [propExams, setPropExams] = useState([] as Issue[])
    const [propSchool, setPropSchool] = useState<School | undefined>()
    const [propAppointments, setPropAppointments] = useState([] as PropAppointment[])
    const [propFeastes, setPropFeastes] = useState([] as Feast[])
    const [date, setDate] = useState<Date>()
    const [autoIncrement, setAutoincrement] = useState(false)
    const [showEdit, setShowEdit] = useState(false)


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
            setPrepare(false)
            if (date != null)
                (async function () {
                    let innerDate = new Date(date?.getTime())
                    while ((autoIncrement && innerDate.getMonth() == date.getMonth()) || innerDate.getTime() == date.getTime()) {
                        const dateFeast = propFeastes.find((feast) => CompareMonthDay(feast.date, innerDate))
                        const nextDateFeast = propFeastes.find((feast) => CompareMonthDay(feast.date, AddDaysToDate(innerDate, 1)))
                        let tempMasses = [] as PropMass[]
                        let tempIssues = [] as string[]
                        let tempAppointments = [] as PropAppointment[]
                        if (date.getTime() == propEastern?.getTime())
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 7, 0), intention: ['Za parafian'], description: ['Msza Rezurekcyjna'], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], color: '#ffffff', },
                            ]
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, -1).getTime())
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 20, 0), intention: [], description: ['Wigilia Paschalna'], color: '#ffffff', },
                            ]
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, -2).getTime())
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 18, 0), intention: [' - Brak intencji - '], description: ['Liturgia Męki Pańskiej'], color: '#ff0000', },
                            ]
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, -3).getTime())
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 18, 0), intention: [], description: ['Msza Wieczerzy Pańskiej'], color: '#ffffff', },
                            ]
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, -7).getTime())
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], color: '#ff0000', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: [], color: '#ff0000', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: ['Za parafian'], description: ['Procesja Palmowa'], color: '#ff0000', },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], color: '#ff0000', },
                            ]
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, -46).getTime())
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 7, 0), intention: [], description: [], color: '#800080', },
                                { date: AddTimeToDate(innerDate, 9, 30), intention: [], description: [], color: '#800080', },
                                { date: AddTimeToDate(innerDate, 16, 30), intention: [], description: [], color: '#800080', },
                                { date: AddTimeToDate(innerDate, 18, 0), intention: [], description: [], color: '#800080', },
                                { date: AddTimeToDate(innerDate, 19, 30), intention: [], description: [], color: '#800080', },
                            ]
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, +1).getTime())
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: [], description: ['Msza Chrzcielna'], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], color: '#ffffff', },
                            ]
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, +49).getTime())
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: ['Za parafian'], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: ['Złoci Jubilaci'], description: ['Złoci Jubilaci'], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: ['Srebrni Jubilaci'], description: ['Srebrni Jubilaci'], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], color: '#ffffff', },
                            ]
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, +50).getTime())
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 7, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 9, 30), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 16, 30), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 18, 0), intention: [], description: [], color: '#ffffff', },
                            ]
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, +60).getTime())
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: ['Za parafian'], description: ['Procesja Bożego Ciała', 'Msza przy ołtarzu polowym'], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], color: '#ffffff', },
                            ]
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, +68).getTime())
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 7, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 9, 30), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 18, 0), intention: [], description: [], color: '#ffffff', },
                            ]
                        else if (CompareMonthDay(innerDate, new Date(2001, 4, 3)))
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: ['Za parafian'], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: ['I Komunia Święta'], description: ['I Komunia Święta'], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: ['I Komunia Święta'], description: ['I Komunia Święta'], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], color: '#ffffff', },
                            ]
                        else if (CompareMonthDay(innerDate, new Date(2001, 11, 25)))
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 0, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: ['Za parafian'], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], color: '#ffffff', },
                            ]
                        else if (CompareMonthDay(innerDate, new Date(2001, 11, 26)))
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], color: '#ff0000', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: [], color: '#ff0000', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: [], description: ['Msza Chrzcielna', 'Poświęcenie owies'], color: '#ff0000', },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], color: '#ff0000', },
                            ]
                        else if (CompareMonthDay(innerDate, new Date(2001, 0, 1)))
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: ['Za parafian'], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], color: '#ffffff', },
                            ]
                        else if (CompareMonthDay(innerDate, new Date(2001, 0, 6)))
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: ['Za parafian'], description: ['Orszak Trzech Króli'], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], color: '#ffffff', },
                            ]
                        else if (CompareDayMonthDate(innerDate, 0, -1) && innerDate.getMonth() == 6)
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: ['Za parafian'], description: ['Odpust parafialny'], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], color: '#ffffff', },
                            ]
                        else if (CompareMonthDay(innerDate, new Date(2001, 7, 26)) && innerDate.getDay() == 0)
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: ['Za parafian'], description: ['Odpust parafialny'], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], color: '#ffffff', },
                            ]
                        else if (CompareMonthDay(innerDate, new Date(2001, 7, 26)))
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 7, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 9, 30), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 18, 0), intention: ['Za parafian'], description: ['Odpust parafialny'], color: '#ffffff', },
                            ]
                        else if (CompareMonthDay(innerDate, new Date(2001, 8, 8)) && innerDate.getDay() == 0)
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: ['Za parafian'], description: ['Odpust parafialny'], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], color: '#ffffff', },
                            ]
                        else if (CompareMonthDay(innerDate, new Date(2001, 8, 7)) && innerDate.getDay() == 6)
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 7, 0), intention: [], description: [], },
                                { date: AddTimeToDate(innerDate, 18, 0), intention: ['Bierzmowanie'], description: ['Bierzmowanie'], color: '#ff0000', },
                            ]
                        else if (CompareMonthDay(innerDate, new Date(2001, 8, 8)))
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 7, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 9, 30), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 18, 0), intention: ['Bierzmowanie'], description: ['Odpust parafialny'], color: '#ff0000', },
                            ]
                        else if (CompareMonthDay(innerDate, new Date(2001, 10, 1)))
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: ['Za parafian'], description: [], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 14, 0), intention: [], description: ['Msza na cmentarzu'], color: '#ffffff', },
                            ]
                        else if (CompareMonthDay(innerDate, new Date(2001, 10, 2)) && innerDate.getDay() == 0)
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], color: '#800080', },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: [], color: '#800080', },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: [], description: [], color: '#800080', },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: ['Za zmarłych parafian'], description: ['Procesja do cmentarza'], color: '#800080', },
                            ]
                        else if (CompareMonthDay(innerDate, new Date(2001, 10, 2)))
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 7, 0), intention: [], description: [], color: '#800080', },
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], color: '#800080', },
                                { date: AddTimeToDate(innerDate, 18, 0), intention: ['Za zmarłych parafian'], description: ['Procesja do cmentarza'], color: '#800080', },
                            ]
                        else if (CompareMonthDay(innerDate, new Date(2001, 10, 11)) && innerDate.getDay() != 0)
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 7, 0), intention: [], description: [], },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: ['Za Ojczyznę'], color: '#ffffff', },
                                { date: AddTimeToDate(innerDate, 18, 0), intention: [], description: [], },
                            ]
                        else if (innerDate.getDay() == 0)
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: [], },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: ['Za parafian'], description: [], },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], },
                            ]
                        else if (dateFeast?.feast == '4' && !BetweenDates(innerDate, AddDaysToDate(propEastern, -7), AddDaysToDate(propEastern, +7)))
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 8, 0), intention: [], description: [], },
                                { date: AddTimeToDate(innerDate, 10, 0), intention: [], description: [], },
                                { date: AddTimeToDate(innerDate, 12, 0), intention: ['Za parafian'], description: [], },
                                { date: AddTimeToDate(innerDate, 17, 0), intention: [], description: [], },
                            ]
                        else if (dateFeast?.feast == '5' && !BetweenDates(innerDate, AddDaysToDate(propEastern, -7), AddDaysToDate(propEastern, +7)))
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 7, 0), intention: [], description: [], color: dateFeast?.color, },
                                { date: AddTimeToDate(innerDate, 9, 30), intention: [], description: [], color: dateFeast?.color, },
                                { date: AddTimeToDate(innerDate, 16, 30), intention: [], description: [], color: dateFeast?.color, },
                                { date: AddTimeToDate(innerDate, 18, 0), intention: [], description: [], color: dateFeast?.color, },
                            ]
                        else if (dateFeast?.feast == '6' && !BetweenDates(innerDate, AddDaysToDate(propEastern, -7), AddDaysToDate(propEastern, +7)))
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 7, 0), intention: [], description: [], color: dateFeast?.color, },
                                { date: AddTimeToDate(innerDate, 9, 30), intention: [], description: [], color: dateFeast?.color, },
                                { date: AddTimeToDate(innerDate, 18, 0), intention: [], description: [], color: dateFeast?.color, },
                            ]
                        else
                            tempMasses = [
                                { date: AddTimeToDate(innerDate, 7, 0), intention: [], description: [], },
                                { date: AddTimeToDate(innerDate, 18, 0), intention: [], description: [], },
                            ]
                        if (CompareMonthDay(innerDate, new Date(innerDate.getFullYear(), 11, 24)))
                            tempMasses = tempMasses.filter((_item, index) => (index != tempMasses.length - 1))
                        if ([6, 7].find((month) => month == innerDate.getMonth()) == null && CompareDayMonthDate(innerDate, 0, 2))
                            tempMasses = [...tempMasses, { date: AddTimeToDate(innerDate, 19, 0), intention: [], description: ['Msza Młodzi Duchem'], color: tempMasses[0]?.color },]
                        if (BetweenDates(innerDate, AddDaysToDate(new Date(innerDate.getFullYear(), 11, 3), - new Date(innerDate.getFullYear(), 11, 3).getDay()), new Date(innerDate.getFullYear(), 11, 24)) && innerDate.getDate() != 8) {
                            const mass = tempMasses.find((mass) => mass.date.getHours() == 7)
                            if (mass)
                                mass.date = AddTimeToDate(innerDate, 6, 30)
                        }


                        if (dateFeast && !BetweenDates(innerDate, AddDaysToDate(propEastern, -7), AddDaysToDate(propEastern, +7)) && innerDate.getDay() != 0) {
                            tempMasses = tempMasses.map(mass => ({ color: mass.color ?? dateFeast.color, date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                            tempIssues = [...tempIssues, dateFeast.description]
                        }

                        if (innerDate.getTime() == propEastern?.getTime())
                            tempIssues = [...tempIssues, 'Niedziela Wielkanocna']
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, -1).getTime())
                            tempIssues = [...tempIssues, 'Wielka Sobota']
                        else if (BetweenDates(innerDate, AddDaysToDate(propEastern, -6), AddDaysToDate(propEastern, -1)))
                            tempIssues = [...tempIssues, ([true, false, false, true, false, false, true][innerDate.getDay()] ? 'Wielka ' : 'Wielki ') + DaySpelling[innerDate.getDay()]]
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, -7).getTime()) {
                            tempIssues = [...tempIssues, 'Niedziela Palmowa']
                            tempAppointments = [...tempAppointments,
                            {
                                date: AddTimeToDate(innerDate, 11, 30), type: 'Konkurs Palm'
                            },]
                        }
                        else if (BetweenDates(innerDate, AddDaysToDate(propEastern, -45), AddDaysToDate(propEastern, -8))) {
                            if (BetweenDates(innerDate, AddDaysToDate(propEastern, -45), AddDaysToDate(propEastern, -43)) && dateFeast == null) {
                                tempIssues = [...tempIssues, DaySpelling[innerDate.getDay()] + ' po Środzie Popielcowej']
                            }
                            if (BetweenDates(innerDate, AddDaysToDate(propEastern, -42), AddDaysToDate(propEastern, -8)) && (dateFeast == null || innerDate.getDay() == 0)) {
                                tempIssues = [...tempIssues, innerDate.getDay() == 0 ? Math.floor((innerDate.getTime() - AddDaysToDate(propEastern, -50).getTime()) / 604800000) + '. Niedziela Wielkiego Postu' : DaySpelling[innerDate.getDay()] + ' ' + Math.floor((innerDate.getTime() - AddDaysToDate(propEastern, -49).getTime()) / 604800000) + '. Tygodnia Wielkiego Postu']
                                tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#800080', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                            }
                            if (innerDate.getTime() == AddDaysToDate(propEastern, -8).getTime()) {
                                tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia Niedzieli Palmowej']
                                tempMasses[tempMasses.length - 1].color = '#800080'
                            }
                            else if (BetweenDates(innerDate, AddDaysToDate(propEastern, -43), AddDaysToDate(propEastern, -8)) && innerDate.getDay() == 6 && tempMasses.length > 0)
                                tempMasses[tempMasses.length - 1].description = [...tempMasses[tempMasses.length - 1].description, 'Wigilia ' + Math.floor((innerDate.getTime() - AddDaysToDate(propEastern, -51).getTime()) / 604800000) + '. ' + ' Niedzieli Wielkiego Postu']

                        }
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, -46).getTime())
                            tempIssues = [...tempIssues, 'Środa Popielcowa']
                        else if (BetweenDates(innerDate, AddDaysToDate(propEastern, 1), AddDaysToDate(propEastern, 6))) {
                            tempIssues = [...tempIssues, DaySpelling[innerDate.getDay()] + ' Oktawy Wielkanocnej']
                            tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#ffffff', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                            if (innerDate.getTime() == AddDaysToDate(propEastern, 6).getTime())
                                tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia 2. Niedzieli Wielkanocnej']
                        }
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, 7).getTime()) {
                            tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#ffffff', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                            tempIssues = [...tempIssues, '2. Niedziela Wielkanocna', 'Niedziela Miłosierdzia Bożego']
                        }
                        else if (BetweenDates(innerDate, AddDaysToDate(propEastern, 8), AddDaysToDate(propEastern, 49))) {
                            tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#ffffff', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                            if (innerDate.getTime() == AddDaysToDate(propEastern, 42).getTime())
                                tempIssues = [...tempIssues, 'Wniebowstąpienie Pańskie']
                            else if (innerDate.getTime() == AddDaysToDate(propEastern, 49).getTime()) {
                                tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#ff0000', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                                tempIssues = [...tempIssues, 'Zesłanie Ducha Świętego']
                            }
                            else if (BetweenDates(innerDate, AddDaysToDate(propEastern, 8), AddDaysToDate(propEastern, 48)) && (dateFeast == null || innerDate.getDay() == 0))
                                tempIssues = [...tempIssues, innerDate.getDay() == 0 ? Math.floor((innerDate.getTime() - AddDaysToDate(propEastern, -8).getTime()) / 604800000) + '. Niedziela Wielkanocna' : DaySpelling[innerDate.getDay()] + ' ' + Math.floor((innerDate.getTime() - AddDaysToDate(propEastern, -7).getTime()) / 604800000) + '. Tygodnia Okresu Wielkanocnego']
                            if (innerDate.getTime() == AddDaysToDate(propEastern, 41).getTime())
                                tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia Wniebowstąpienia Pańskiego']
                            else if (innerDate.getTime() == AddDaysToDate(propEastern, 48).getTime()) {
                                tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia Zesłania Ducha Świętego']
                                tempMasses[tempMasses.length - 1].color = '#ff0000'
                            }
                            else if (BetweenDates(innerDate, AddDaysToDate(propEastern, 8), AddDaysToDate(propEastern, 47)) && innerDate.getDay() == 6)
                                tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia ' + Math.floor((innerDate.getTime() - AddDaysToDate(propEastern, -8).getTime()) / 604800000) + '. ' + ' Niedzieli Wielkanocnej']
                        }
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, +50).getTime()) {
                            tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#ffffff', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                            tempIssues = [...tempIssues, 'Wspomnienie Najświętszej Maryi Panny Matki Kościoła', 'Drugie Święto Wielkanocne']
                        }
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, +53).getTime()) {
                            tempIssues = [...tempIssues, 'Święto Jezusa Chrystusa Najwyższego i Wiecznego Kapłana']
                            tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#ffffff', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                        }
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, +60).getTime())
                            tempIssues = [...tempIssues, 'Uroczystość Najświętszego Ciała i Krwi Chrystusa']
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, +68).getTime())
                            tempIssues = [...tempIssues, 'Uroczystość Najświętszego Serca Pana Jezusa']
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, +69).getTime()) {
                            tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#ffffff', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                            tempIssues = [...tempIssues, 'Wspomnienie Niepokalanego Serca Najświętszej Maryi Panny']
                        }
                        else if (innerDate.getTime() == AddDaysToDate(new Date(innerDate.getFullYear(), 11, 3), - 7 - new Date(innerDate.getFullYear(), 11, 3).getDay()).getTime()) {
                            tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#ffffff', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                            tempIssues = [...tempIssues, 'Uroczystość Jezusa Chrystusa, Króla Wszechświata']
                        }
                        else if (BetweenDates(innerDate, AddDaysToDate(new Date(innerDate.getFullYear(), 11, 3), - new Date(innerDate.getFullYear(), 11, 3).getDay()), new Date(innerDate.getFullYear(), 11, 31))) {
                            if (BetweenDates(innerDate, new Date(innerDate.getFullYear(), 11, 17), new Date(innerDate.getFullYear(), 11, 24)) && innerDate.getDay() != 0) {
                                tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#800080', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                                tempIssues = [...tempIssues, innerDate.getDate() + '. Grudnia']
                            }
                            else if (BetweenDates(innerDate, AddDaysToDate(new Date(innerDate.getFullYear(), 11, 3), - new Date(innerDate.getFullYear(), 11, 3).getDay()), new Date(innerDate.getFullYear(), 11, 24)) && dateFeast == null || innerDate.getDay() == 0 && innerDate.getDate() < 25) {
                                tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#800080', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                                tempIssues = [...tempIssues, innerDate.getDay() == 0 ? (Math.floor((innerDate.getTime() - AddDaysToDate(new Date(innerDate.getFullYear(), 11, 3), - 8 - new Date(innerDate.getFullYear(), 11, 3).getDay()).getTime()) / 604800000)) + '. Niedziela Adwentu' : DaySpelling[innerDate.getDay()] + ' ' + (Math.floor((innerDate.getTime() - AddDaysToDate(new Date(innerDate.getFullYear(), 11, 3), - 7 - new Date(innerDate.getFullYear(), 11, 3).getDay()).getTime()) / 604800000)) + '. Tygodnia Adwentu']
                            }
                            if (innerDate.getTime() == new Date(innerDate.getFullYear(), 11, 24).getTime())
                                tempIssues = [...tempIssues, 'Wiglia Bożego Narodzenia']
                            else if (innerDate.getDay() == 6) {
                                tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia ' + (Math.floor((innerDate.getTime() - AddDaysToDate(new Date(innerDate.getFullYear(), 11, 3), - 9 - new Date(innerDate.getFullYear(), 11, 3).getDay()).getTime()) / 604800000)) + '. ' + ' Niedzieli Adwentu']
                                tempMasses[tempMasses.length - 1].color = '#800080'
                            }
                            if (innerDate.getTime() == new Date(innerDate.getFullYear(), 11, 25).getTime()) {
                                tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#ffffff', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                                tempIssues = [...tempIssues, 'Uroczystość Narodzenia Pańskiego']
                            }
                            if (BetweenDates(innerDate, new Date(innerDate.getFullYear(), 11, 26), new Date(innerDate.getFullYear(), 11, 31))) {
                                tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#ffffff', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                                tempIssues = [...tempIssues, innerDate.getDay() == 0 || innerDate.getDate() == 31 && innerDate.getDay() == 1 ? 'Uroczystość Świętej Rodziny' : ' Oktawa Bożego Narodzenia']
                            }
                        }
                        else if (innerDate.getTime() == new Date(innerDate.getFullYear(), 0, 6).getTime()) {
                            tempIssues = [...tempIssues, 'Uroczystość Objawienia Paskiego']
                            tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#ffffff', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                        }
                        else if (BetweenDates(innerDate, new Date(innerDate.getFullYear(), 0, 2), AddDaysToDate(new Date(innerDate.getFullYear(), 0, 12), - new Date(innerDate.getFullYear(), 0, 12).getDay()))) {
                            tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#ffffff', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                            if (dateFeast == null && innerDate.getDay() != 0)
                                tempIssues = [...tempIssues, 'Okres Bożego Narodzenia']
                            if (BetweenDates(innerDate, new Date(innerDate.getFullYear(), 0, 2), new Date(innerDate.getFullYear(), 0, 5)) && innerDate.getDay() == 0)
                                tempIssues = [...tempIssues, '2. Niedziela Okresu Bożego Narodzenia']
                            else if (BetweenDates(innerDate, new Date(innerDate.getFullYear(), 0, 2), new Date(innerDate.getFullYear(), 0, 4)) && innerDate.getDay() == 6)
                                tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia 2. Niedzieli Okresu Bożego Narodzenia']
                            if (BetweenDates(innerDate, new Date(innerDate.getFullYear(), 0, 7), new Date(innerDate.getFullYear(), 0, 12)) && innerDate.getDay() == 0)
                                tempIssues = [...tempIssues, 'Niedziela Chrztu Pańskiego']
                            else if (BetweenDates(innerDate, new Date(innerDate.getFullYear(), 0, 7), new Date(innerDate.getFullYear(), 0, 12)) && innerDate.getDay() == 6)
                                tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia Niedzieli Chrztu Pańskiego']
                        }
                        else if (innerDate.getTime() == new Date(innerDate.getFullYear(), 0, 7).getTime() && innerDate.getDay() == 1) {
                            tempIssues = [...tempIssues, 'Święto Chrztu Pańskiego']
                            tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#ffffff', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                        }
                        else if (CompareDayMonthDate(innerDate, 0, -1) && innerDate.getMonth() == 9) {
                            tempIssues = [...tempIssues, 'Rocznica poświęcenia Kościoła']
                            tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#ffffff', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                        }
                        else if (innerDate.getTime() == new Date(innerDate.getFullYear(), 10, 2).getTime())
                            tempIssues = [...tempIssues, 'Wspomnienie wszystkich wiernych zmarłych']
                        else if (BetweenDates(innerDate, AddDaysToDate(new Date(innerDate.getFullYear(), 0, 12), - new Date(innerDate.getFullYear(), 0, 12).getDay()), AddDaysToDate(propEastern, -47))) {
                            tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#00ff00', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                            if (dateFeast == null || innerDate.getDay() == 0)
                                tempIssues = [...tempIssues, innerDate.getDay() == 0 ? Math.floor((innerDate.getTime() - AddDaysToDate(new Date(innerDate.getFullYear(), 0, 5), -new Date(innerDate.getFullYear(), 0, 5).getDay()).getTime()) / 604800000) + '. Niedziela Okresu Zwykłego' : DaySpelling[innerDate.getDay()] + ' ' + Math.floor((innerDate.getTime() - AddDaysToDate(new Date(innerDate.getFullYear(), 0, 6), -new Date(innerDate.getFullYear(), 0, 6).getDay()).getTime()) / 604800000) + '. Tygodnia Okresu Zwykłego']
                            if (innerDate.getDay() == 6) {
                                tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia ' + Math.floor((innerDate.getTime() - AddDaysToDate(new Date(innerDate.getFullYear(), 0, 4), -new Date(innerDate.getFullYear(), 0, 4).getDay()).getTime()) / 604800000) + '. Niedzieli Okresu Zwykłego']
                                tempMasses[tempMasses.length - 1].color = '#00ff00'
                            }
                        }
                        else if (BetweenDates(innerDate, AddDaysToDate(propEastern, 51), AddDaysToDate(new Date(innerDate.getFullYear(), 11, 3), - new Date(innerDate.getFullYear(), 11, 3).getDay()))) {
                            if (dateFeast == null || innerDate.getDay() == 0) {
                                tempIssues = [...tempIssues, innerDate.getDay() == 0 ? (Math.floor((innerDate.getTime() - AddDaysToDate(propEastern, 49).getTime()) / 604800000) + propStartWeek) + '. Niedziela Okresu Zwykłego' : DaySpelling[innerDate.getDay()] + ' ' + (Math.floor((innerDate.getTime() - AddDaysToDate(propEastern, 50).getTime()) / 604800000) + propStartWeek) + '. Tygodnia Okresu Zwykłego']
                                tempMasses = tempMasses.map(mass => ({ color: mass.color ?? '#00ff00', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                            }
                            if (innerDate.getTime() == AddDaysToDate(new Date(innerDate.getFullYear(), 11, 3), - 8 - new Date(innerDate.getFullYear(), 11, 3).getDay()).getTime()) {
                                tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia Uroczystości Jezusa Chrystusa, Króla Wszechświata']
                                tempMasses[tempMasses.length - 1].color = '#ffffff'
                            }
                            if (innerDate.getTime() == AddDaysToDate(new Date(innerDate.getFullYear(), 11, 3), - 1 - new Date(innerDate.getFullYear(), 11, 3).getDay()).getTime()) {
                                tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia 1. Niedzieli Adwentu']
                                tempMasses[tempMasses.length - 1].color = '#800080'
                            }
                            else if (innerDate.getDay() == 6) {
                                tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Wigilia ' + (Math.floor((innerDate.getTime() - AddDaysToDate(propEastern, 48).getTime()) / 604800000) + propStartWeek) + '. ' + ' Niedzieli Okresu Zwykłego']
                                tempMasses[tempMasses.length - 1].color = '#00ff00'
                            }
                        }
                        if (BetweenDates(new Date(innerDate.getFullYear(), 2, 25), AddDaysToDate(propEastern, -7), AddDaysToDate(propEastern, 7)) ? innerDate.getTime() == AddDaysToDate(propEastern, +8).getTime() : CompareMonthDay(innerDate, new Date(2001, 2, 25))) {
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Adopcja dziecka poczętego']
                            tempMasses = tempMasses.map(mass => ({ color: '#ffffff', date: mass.date, intention: mass.intention, description: mass.description, collective: mass.collective }))
                            if (innerDate.getDate() != 25)
                                tempIssues = [...tempIssues, 'Uroczystość Zwiastowania Pańskiego']
                        }
                        if (BetweenDates(innerDate, new Date(innerDate.getFullYear(), 7, 6), new Date(innerDate.getFullYear(), 7, 11)))
                            tempIssues = [...tempIssues, 'Pielgrzymka Krakowska']
                        if (CompareMonthDay(innerDate, new Date(2001, 4, 2)))
                            tempIssues = [...tempIssues, 'I Spowiedź Święta']
                        if (CompareMonthDay(innerDate, new Date(2001, 10, 11)))
                            tempIssues = [...tempIssues, 'Święto Niepodległości']
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, +1).getTime())
                            tempIssues = [...tempIssues, 'Drugie Święto Wielkanocne']
                        if (nextDateFeast && !BetweenDates(innerDate, AddDaysToDate(propEastern, -7), AddDaysToDate(propEastern, +7)) && innerDate.getDay() != 0 && innerDate.getDay() != 0 && ['0', '4', '5', '6'].find((feast) => feast == nextDateFeast.feast)) {
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), nextDateFeast.description.replace('Uroczystość', 'Wigilia uroczystości')]
                            tempMasses[tempMasses.length - 1].color = nextDateFeast.color
                        }
                        if (CompareDayMonthDate(innerDate, 4, 1))
                            tempMasses[tempMasses.length - 1].intention = [...(tempMasses[tempMasses.length - 1].intention), 'O powołania kapłańskie, zakonne i misyjne, umocnienie istniejących oraz łaski dla osób konsekrowanych pracujących i wywodzących się z naszej parafii, a dla tych, co już odeszli do domu Pana o życie wieczne']
                        if (CompareDayMonthDate(innerDate, 6, 1))
                            tempMasses[tempMasses.length - 1].intention = [...(tempMasses[tempMasses.length - 1].intention), 'W intencji wynagradzającej za grzechy przeciwko Niepokalanemu Sercu Najświętszej Maryi Panny']
                        if (CompareDayMonthDate(innerDate, 0, -1)) {
                            const mass = tempMasses.find((mass) => mass.date.getHours() == 12)
                            if (mass)
                                mass.intention = [...(mass.intention), 'Za Ojczyznę']
                        }
                        if (CompareDayMonthDate(innerDate, 0, -1) && innerDate.getMonth() == 6)
                            tempIssues = [...tempIssues, 'Odpust parafialny']
                        if (CompareDayMonthDate(innerDate, 4, -1)) {
                            const mass = tempMasses.find((mass) => mass.date.getHours() == 18)
                            if (mass) {
                                mass.description = [...(mass.description), 'Msza przy ołtarzu św. Józefa'
                                    , 'Msza wotywna o św. Józefie']
                                mass.color = mass.color == '#00ff00' ? '#ffffff' : mass.color
                            }
                        }
                        if (CompareDayMonthDate(innerDate, 6, 2)) {
                            tempMasses[tempMasses.length - 1].collective = true
                            tempMasses[tempMasses.length - 1].date = AddTimeToDate(tempMasses[tempMasses.length - 1].date, 0, 10)
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Msza o Matce Bożej Zwycięskiej']
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 17, 30), type: 'Wystawienie Najświętszego Sakramentu' },
                            { date: AddTimeToDate(innerDate, 18, 0), type: 'Nabożeństwo do Matki Bożej Zwycięskiej' },]
                        }
                        if (CompareDayMonthDate(innerDate, 5, 3)) {
                            tempMasses[tempMasses.length - 1].collective = true
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Msza wotywna o Miłosierdziu Bożym']
                            tempMasses[tempMasses.length - 1].color = tempMasses[tempMasses.length - 1].color ?? '#ffffff'
                        }
                        if (CompareMonthDay(innerDate, new Date(2001, 11, 31)))
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Zakończenie Roku', 'Nieszpory']
                        if (CompareMonthDay(innerDate, propSchool?.start)) {
                            tempIssues = [...tempIssues, 'Rozpoczęcie Roku Szkolnego']
                            tempMasses = [...tempMasses, { date: AddTimeToDate(innerDate, 8, 30), intention: ['W intencji uczniów, nauczycieli oraz pracowników szkoły'], description: ['Rozpoczęcie Roku Szkolnego'], color: '#ffffff', },]
                        }
                        else if (CompareMonthDay(innerDate, propSchool?.end)) {
                            tempIssues = [...tempIssues, 'Zakończenie Roku Szkolnego']
                            tempMasses = [...tempMasses, { date: AddTimeToDate(innerDate, 8, 0), intention: ['W intencji uczniów, nauczycieli oraz pracowników szkoły'], description: ['Zakończenie Roku Szkolnego'], color: '#ffffff', },]
                        }
                        else if (BetweenDates(innerDate, propSchool?.break_start, propSchool?.break_end))
                            tempIssues = [...tempIssues, 'Ferie zimowe']



                        if (innerDate.getDay() == 0) {
                            if (tempMasses.find((mass) => mass.date.getHours() == 8) != null)
                                tempAppointments = [...tempAppointments, { date: AddTimeToDate(innerDate, 7, 45), type: 'Wypominki' }]
                            if (tempMasses.find((mass) => mass.date.getHours() == 10) != null)
                                tempAppointments = [...tempAppointments, { date: AddTimeToDate(innerDate, 9, 45), type: 'Wypominki' }]
                            if (tempMasses.find((mass) => mass.date.getHours() == 12) != null)
                                tempAppointments = [...tempAppointments, { date: AddTimeToDate(innerDate, 11, 45), type: 'Wypominki' }]
                        }
                        if ((CompareDayMonthDate(innerDate, 0, -2) && innerDate.getMonth() != 6) || (CompareDayMonthDate(innerDate, 0, -3) && innerDate.getMonth() == 6))
                            tempAppointments = [...tempAppointments, { date: AddTimeToDate(innerDate, 18, 0), type: 'Przygotowanie do Chrztu' }]
                        if ((CompareDayMonthDate(innerDate, 0, -1) && innerDate.getMonth() != 6) || (CompareDayMonthDate(innerDate, 0, -2) && innerDate.getMonth() == 6)) {
                            tempAppointments = [...tempAppointments, { date: AddTimeToDate(innerDate, 12, 0), type: 'Chrzty (na Mszy):' }]
                            const mass = tempMasses.find((mass) => mass.date.getHours() == 12)
                            if (mass)
                                mass.description = [...(mass.description), 'Msza Chrzcielna']
                        }
                        else if (innerDate.getDay() == 0)
                            tempAppointments = [...tempAppointments, { date: AddTimeToDate(innerDate, 13, 0), type: 'Chrzty (po Mszy):' }]
                        if (innerDate.getTime() == AddDaysToDate(propEastern, -47).getTime() && innerDate.getTime() == AddDaysToDate(propEastern, -48).getTime())
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 7, 30), type: 'Nabożeństwo 40-godzinne' },
                            { date: AddTimeToDate(innerDate, 9, 0), type: 'Schowanie Najświętszego Sakramentu' },
                            { date: AddTimeToDate(innerDate, 16, 30), type: 'Nabożeństwo 40-godzinne' },]
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, -49).getTime())
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 14, 0), type: 'Nabożeństwo 40-godzinne' },
                            { date: AddTimeToDate(innerDate, 15, 0), type: 'Nabożeństwo 40-godzinne' },
                            { date: AddTimeToDate(innerDate, 16, 0), type: 'Nabożeństwo 40-godzinne' },]
                        if (innerDate.getDay() == 3)
                            if (AddDaysToDate(propEastern, -46).getTime() == innerDate.getTime()) {
                                const mass = tempMasses.find((mass) => mass.date.getHours() == 18)
                                if (mass) {
                                    tempAppointments = [...tempAppointments,
                                    { date: AddTimeToDate(innerDate, 17, 30), type: 'Różaniec' },]
                                }
                            }
                            else if (innerDate.getMonth() == 4 || innerDate.getMonth() == 9) {
                                const mass = tempMasses.find((mass) => mass.date.getHours() == 18)
                                if (mass) {
                                    mass.color = mass.color == '#00ff00' ? '#ffffff' : mass.color
                                    mass.date = AddTimeToDate(mass.date, 0, 10)
                                    mass.description = [...(mass.description), 'Nowenna do Matki Bożej Nieustającej Pomocy']
                                    tempAppointments = [...tempAppointments,
                                    { date: AddTimeToDate(innerDate, 17, 30), type: 'Adoracja Najświętszego Sakramentu' },
                                    { date: AddTimeToDate(innerDate, 17, 30), type: 'Różaniec' },
                                    { date: AddTimeToDate(innerDate, 18, 0), type: 'Nowenna do Matki Bożej Nieustającej Pomocy' },]
                                }
                            }
                            else {
                                const mass = tempMasses.find((mass) => mass.date.getHours() == 18)
                                if (mass) {
                                    mass.color = mass.color == '#00ff00' ? '#ffffff' : mass.color
                                    mass.date = AddTimeToDate(mass.date, 0, 10)
                                    mass.description = [...(mass.description), 'Nowenna do Matki Bożej Nieustającej Pomocy',
                                        'Msza w kaplicy Matki Bożej']
                                    tempAppointments = [...tempAppointments,
                                    { date: AddTimeToDate(innerDate, 17, 30), type: 'Adoracja Najświętszego Sakramentu' },
                                    { date: AddTimeToDate(innerDate, 17, 30), type: 'Różaniec w kaplicy Matki Bożej' },
                                    { date: AddTimeToDate(innerDate, 18, 0), type: 'Nowenna do Matki Bożej Nieustającej Pomocy' },]
                                }
                            }
                        if (BetweenDates(innerDate, AddDaysToDate(propEastern, 37), AddDaysToDate(propEastern, 39)))
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 17, 50), type: 'Dni Krzyżowe' },]
                        if (BetweenDates(innerDate, AddDaysToDate(propEastern, -45), AddDaysToDate(propEastern, -7)))
                            if (AddDaysToDate(propEastern, -7).getTime() == innerDate.getTime()) {
                                tempAppointments = [...tempAppointments,
                                { date: AddTimeToDate(innerDate, 16, 0), type: 'Gorzkie Żale' },
                                { date: AddTimeToDate(innerDate, 19, 0), type: 'Droga Krzyżowa ulicami Zielonek' },]
                            }
                            else if (innerDate.getDay() == 0)
                                tempAppointments = [...tempAppointments,
                                { date: AddTimeToDate(innerDate, 13, 0), type: 'Droga Krzyżowa' },
                                { date: AddTimeToDate(innerDate, 16, 0), type: 'Gorzkie Żale' },]
                            else if (AddDaysToDate(propEastern, -9).getTime() == innerDate.getTime()) {
                                tempAppointments = [...tempAppointments,
                                { date: AddTimeToDate(innerDate, 17, 15), type: 'Droga Krzyżowa dla dzieci' },
                                { date: AddTimeToDate(innerDate, 18, 30), type: 'Droga Krzyżowa dla dorosłych' },]
                                tempMasses = [...tempMasses, { date: AddTimeToDate(innerDate, 20, 0), intention: [], description: ['Ekstremalna Droga Krzyżowa'], },]
                            }
                            else if (innerDate.getDay() == 5)
                                tempAppointments = [...tempAppointments,
                                { date: AddTimeToDate(innerDate, 17, 15), type: 'Droga Krzyżowa dla dzieci' },
                                { date: AddTimeToDate(innerDate, 18, 30), type: 'Droga Krzyżowa dla dorosłych' },
                                { date: AddTimeToDate(innerDate, 20, 0), type: 'Droga Krzyżowa dla młodzieży' },]
                        if (CompareDayMonthDate(innerDate, 2, 1))
                            tempAppointments = [...tempAppointments, { date: AddTimeToDate(innerDate, 19, 30), type: 'Adoracja Najświętszego Sakramentu' }]
                        if (CompareDayMonthDate(innerDate, 5, 1)) {
                            tempMasses[tempMasses.length - 1].color = tempMasses[tempMasses.length - 1].color == '#00ff00' ? '#ffffff' : tempMasses[tempMasses.length - 1].color
                            tempAppointments = [...tempAppointments, { date: AddTimeToDate(innerDate, 17, 0), type: 'Spowiedź I Piątkowa' },
                            { date: AddTimeToDate(innerDate, 18, 30), type: 'Nabożeństwo do Najświętszego Serca Pana Jezusa' },]
                        }
                        if (CompareDayMonthDate(innerDate, 6, 1))
                            if (innerDate.getMonth() == 4 || innerDate.getMonth() == 9) {
                                tempAppointments = [...tempAppointments, { date: AddTimeToDate(innerDate, 17, 10), type: 'Nabożeństwo I Sobót' }]

                            }
                            else {
                                tempAppointments = [...tempAppointments, { date: AddTimeToDate(innerDate, 17, 15), type: 'Nabożeństwo I Sobót' }]
                                const mass = tempMasses.find((mass) => mass.date.getHours() == 18)
                                if (mass)
                                    mass.description = [...(mass.description), 'Msza w kaplicy Matki Bożej']
                            }
                        else if (innerDate.getDay() == 6) {
                            tempAppointments = [...tempAppointments, { date: AddTimeToDate(innerDate, 17, 30), type: 'Różaniec w kaplicy Matki Bożej' }]
                            const mass = tempMasses.find((mass) => mass.date.getHours() == 18)
                            if (mass)
                                mass.description = [...(mass.description), 'Msza w kaplicy Matki Bożej']
                        }
                        if (innerDate.getTime() == AddDaysToDate(propEastern, -3).getTime())
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 17, 0), type: 'Spowiedź Święta' },
                            { date: AddTimeToDate(innerDate, 20, 0), type: 'Adoracja w ciemnicy' },
                            { date: AddTimeToDate(innerDate, 21, 0), type: 'Adoracja dla młodzieży' },
                            { date: AddTimeToDate(innerDate, 22, 0), type: 'Zakończenie adoracji' },]
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, -2).getTime())
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 7, 0), type: 'Rozpoczęcie adoracji' },
                            { date: AddTimeToDate(innerDate, 7, 0), type: 'Wezwanie, Godzina Czytań i Jutrznia' },
                            { date: AddTimeToDate(innerDate, 10, 0), type: 'Droga Krzyżowa dla dzieci do 3. klasy' },
                            { date: AddTimeToDate(innerDate, 12, 0), type: 'Droga Krzyżowa dla klasy 4. i 5.' },
                            { date: AddTimeToDate(innerDate, 14, 0), type: 'Droga Krzyżowa dla klasy 6. i 7.' },
                            { date: AddTimeToDate(innerDate, 15, 0), type: 'Koronka do Miłosierdzia Bożego' },
                            { date: AddTimeToDate(innerDate, 15, 15), type: 'Droga Krzyżowa dla młodzieży' },
                            { date: AddTimeToDate(innerDate, 17, 15), type: 'Droga Krzyżowa' },
                            { date: AddTimeToDate(innerDate, 17, 0), type: 'Spowiedź Święta' },
                            { date: AddTimeToDate(innerDate, 18, 0), type: 'Liturgia Męki Pańskiej' },
                            { date: AddTimeToDate(innerDate, 20, 0), type: 'Gorzkie Żale' },
                            { date: AddTimeToDate(innerDate, 20, 0), type: 'Spowiedź Święta' },
                            { date: AddTimeToDate(innerDate, 21, 0), type: 'Spowiedź Święta' },
                            { date: AddTimeToDate(innerDate, 22, 0), type: 'Spowiedź Święta' },
                            { date: AddTimeToDate(innerDate, 23, 0), type: 'Spowiedź Święta' },
                            { date: AddTimeToDate(innerDate, 12, 30), type: 'Spowiedź Święta po Drodze Krzyżowej' },
                            { date: AddTimeToDate(innerDate, 14, 30), type: 'Spowiedź Święta po Drodze Krzyżowej' },]
                        else if (innerDate.getTime() == AddDaysToDate(propEastern, -1).getTime())
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 7, 0), type: 'Rozpoczęcie adoracji' },
                            { date: AddTimeToDate(innerDate, 7, 0), type: 'Wezwanie, Godzina Czytań i Jutrznia' },
                            { date: AddTimeToDate(innerDate, 9, 50), type: 'Spowiedź Święta' },
                            { date: AddTimeToDate(innerDate, 10, 0), type: 'Poświęcenie Pokarmów' },
                            { date: AddTimeToDate(innerDate, 10, 20), type: 'Spowiedź Święta' },
                            { date: AddTimeToDate(innerDate, 10, 30), type: 'Poświęcenie Pokarmów' },
                            { date: AddTimeToDate(innerDate, 10, 50), type: 'Spowiedź Święta' },
                            { date: AddTimeToDate(innerDate, 11, 0), type: 'Poświęcenie Pokarmów' },
                            { date: AddTimeToDate(innerDate, 11, 20), type: 'Spowiedź Święta' },
                            { date: AddTimeToDate(innerDate, 11, 30), type: 'Poświęcenie Pokarmów' },
                            { date: AddTimeToDate(innerDate, 11, 50), type: 'Spowiedź Święta' },
                            { date: AddTimeToDate(innerDate, 12, 0), type: 'Poświęcenie Pokarmów' },
                            { date: AddTimeToDate(innerDate, 12, 30), type: 'Poświęcenie Pokarmów - Garlica Murowana' },
                            { date: AddTimeToDate(innerDate, 13, 0), type: 'Poświęcenie Pokarmów - Pękowice' },
                            { date: AddTimeToDate(innerDate, 15, 0), type: 'Poświęcenie Pokarmów' },]
                        else if (innerDate.getTime() == propEastern?.getTime())
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 16, 30), type: 'Nieszpory' },]
                        if (BetweenDates(innerDate, new Date(innerDate.getFullYear(), 3, 29), new Date(innerDate.getFullYear(), 4, 7))) {
                            const mass = tempMasses.find((mass) => mass.date.getHours() == 18 || mass.date.getHours() == 17)
                            if (mass) {
                                tempAppointments = [...tempAppointments,
                                { date: AddTimeToDate(innerDate, mass.date.getHours() - 1, 50), type: 'Nowenna do św. Stanisława' },]
                            }
                        }
                        if (innerDate.getDate() > 12 && innerDate.getDate() < 20 && innerDate.getDay() == 0 && innerDate.getMonth() > 3 && innerDate.getMonth() < 10)
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 16, 0), type: 'Nabożeństwo Fatimskie' },]
                        else if (CompareDayMonthDate(innerDate, 0, 1) && innerDate.getMonth() == 9) {
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 13, 0), type: 'Procesja Różańcowa' },]
                            const mass = tempMasses.find((mass) => mass.date.getHours() == 12)
                            if (mass) {
                                mass.description = [...mass.description, 'Procesja Różańcowa']
                                mass.color = '#ffffff'
                            }
                        }
                        else if (BetweenDates(innerDate, AddDaysToDate(propEastern, 61), AddDaysToDate(propEastern, 67))) {
                            const mass = tempMasses.find((mass) => mass.date.getHours() == 18 || mass.date.getHours() == 17)
                            if (mass)
                                tempAppointments = [...tempAppointments,
                                { date: AddTimeToDate(innerDate, 18, mass.date.getHours() == 17 ? 0 : 30), type: 'Procesja Oktawy Bożego Ciała' },]
                        }
                        else if (BetweenDates(innerDate, new Date(innerDate.getFullYear(), 4, 1), new Date(innerDate.getFullYear(), 4, 31))) {
                            const mass = tempMasses.find((mass) => mass.date.getHours() == 18 || mass.date.getHours() == 17)
                            if (mass)
                                tempAppointments = [...tempAppointments,
                                { date: AddTimeToDate(innerDate, 18, mass.date.getHours() == 17 ? 0 : 30), type: 'Nabożeństwo Majowe' },]
                        }
                        else if (BetweenDates(innerDate, new Date(innerDate.getFullYear(), 5, 1), new Date(innerDate.getFullYear(), 5, 30))) {
                            const mass = tempMasses.find((mass) => mass.date.getHours() == 18 || mass.date.getHours() == 17)
                            if (mass)
                                tempAppointments = [...tempAppointments,
                                { date: AddTimeToDate(innerDate, 18, mass.date.getHours() == 17 ? 0 : 30), type: 'Nabożeństwo Czerwcowe' },]
                        }
                        else if (BetweenDates(innerDate, new Date(innerDate.getFullYear(), 9, 1), new Date(innerDate.getFullYear(), 9, 31))) {
                            const mass = tempMasses.find((mass) => mass.date.getHours() == 18 || mass.date.getHours() == 17)
                            if (mass) {
                                tempAppointments = [...tempAppointments,
                                { date: AddTimeToDate(innerDate, mass.date.getHours() == 17 ? 16 : 17, 30), type: 'Adoracja Najświętszego Sakramentu' },
                                { date: AddTimeToDate(innerDate, mass.date.getHours() == 17 ? 16 : 17, 30), type: 'Nabożeństwo Różańcowe' },]
                                mass.date = AddTimeToDate(mass.date, 0, 0)
                            }
                            if (innerDate.getDay() != 0 && innerDate.getDay() != 6)
                                tempAppointments = [...tempAppointments,
                                { date: AddTimeToDate(innerDate, 7, 40), type: '10-tka Różańca' },]
                        }
                        if (innerDate.getDay() == 2 || innerDate.getDay() == 4)
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 16, 30), type: 'Kancelaria parafialna' },]
                        else if (innerDate.getDay() == 6)
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 8, 30), type: 'Kancelaria parafialna' },]
                        if (CompareMonthDay(innerDate, new Date(2001, 7, 15)))
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 11, 30), type: 'Konkurs bukietów' },]
                        if (CompareMonthDay(innerDate, new Date(2001, 7, 6)))
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 11, 30), type: 'Postój Wspólnoty 2 (Pielgrzymka Krakowska)' },]
                        if (CompareMonthDay(innerDate, new Date(2001, 10, 1)))
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 20, 0), type: 'Różaniec na cmentarzu' },]
                        if (BetweenDates(innerDate, new Date(innerDate.getFullYear(), 10, 3), new Date(innerDate.getFullYear(), 10, 8)) && innerDate.getDay() != 0)
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 17, 15), type: 'Różaniec z wypominkami jednorazowymi' },]
                        if (innerDate.getTime() == new Date(innerDate.getFullYear(), 11, 27).getTime()) {
                            const mass = tempMasses.find((mass) => mass.date.getHours() == 7)
                            if (mass)
                                mass.description = [...mass.description, 'Poświęcenie wina']
                        }
                        if (innerDate.getTime() == new Date(innerDate.getFullYear(), 1, 3).getTime()) {
                            const mass = tempMasses.find((mass) => mass.date.getHours() == 7)
                            if (mass)
                                mass.description = [...mass.description, 'Poświęcenie jabłek']
                        }
                        if (CompareDayMonthDate(innerDate, 0, 2) && innerDate.getMonth() == 4)
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 9, 0), type: 'Procesja na Skałce' },]
                        if (propExams?.find((exam) => exam.date.getTime() == innerDate.getTime()) != null)
                            tempIssues = [...tempIssues, propExams?.find((exam) => exam.date.getTime() == innerDate.getTime())?.type ?? '']
                        if (propExams?.find((exam) => exam.date.getTime() - 86400000 == innerDate.getTime()) != null) {
                            tempMasses[tempMasses.length - 1].intention = [...(tempMasses[tempMasses.length - 1].intention), 'W intencji uczniów rozpoczynających egzaminy']
                            tempMasses[tempMasses.length - 1].description = [...(tempMasses[tempMasses.length - 1].description), 'Z okazji ' + propExams?.find((exam) => exam.date.getTime() - 86400000 == innerDate.getTime())?.type?.replace('Rozpoczęcie', 'rozpoczęcia')]
                        }
                        if ((CompareDayMonthDate(innerDate, 1, 1) && [8, 9, 11, 1, 2, 3].find((month) => month == innerDate.getMonth())) || CompareDayMonthDate(AddDaysToDate(innerDate, -2), 6, 1) && innerDate.getMonth() == 10)
                            tempAppointments = [...tempAppointments,
                            { date: AddTimeToDate(innerDate, 18, 30), type: 'Spotkanie dla przygotowujących do I Komunii Świętej' },]
                        if (tempMasses.length != 0 && tempIssues.length != 0) {
                            setPrepare(true)
                        }
                        tempAppointments = tempAppointments.sort((a, b) => a.date.getTime() - b.date.getTime())
                        if (autoIncrement) {
                            console.log(innerDate)
                            await getParams({
                                func: async (param: string | User) => {
                                    const token = param as string
                                    for (let i = 0; i < tempMasses.length; i++) {
                                        const massID = await FetchInformationPost(token, 'new_intention_admin', ['new_zielonki_mass'], tempMasses[i].date, [tempMasses[i].date.getTime()])
                                        for (let j = 0; j < tempMasses[i].intention.length; j++)
                                            await FetchInformationPost(token, 'new_intention_admin', [massID + 'intention'], tempMasses[i].intention[j], [1])
                                        if (tempMasses[i].collective == true)
                                            await FetchInformationPost(token, 'new_intention_admin', [massID + 'collective'], true, [1])
                                        await FetchInformationPost(token, 'new_intention_admin', [massID + 'color'], tempMasses[i].color ?? '#ffffff', [1])
                                        for (let j = 0; j < tempMasses[i].description.length; j++)
                                            await FetchInformationPost(token, 'new_intention_admin', [massID + 'description'], tempMasses[i].description[j], [1])
                                    }
                                    if (innerDate != null) {
                                        for (let j = 0; j < tempIssues.length; j++) {
                                            await FetchInformationPost(token, 'new_intention_admin', ['new_zielonki_date'], tempIssues[j], [innerDate.getTime()])
                                        }
                                        for (let j = 0; j < tempAppointments.length; j++) {
                                            const appointmentID = await FetchInformationPost(token, 'new_intention_admin', ['new_zielonki_appointment'], tempAppointments[j].date, [tempAppointments[j].date.getTime()])
                                            await FetchInformationPost(token, 'new_intention_admin', [appointmentID + 'description'], tempAppointments[j].type, [j])
                                        }
                                    }
                                    setPrepare(false)
                                }, type: 'token', show: false
                            });
                        }
                        setPropIssues(tempIssues)
                        setPropMasses(tempMasses)
                        setPropAppointments(tempAppointments)
                        innerDate = AddDaysToDate(innerDate, 1)
                    }
                }
                )();
        }, [date, getParams, propFeastes, propEastern, propStartWeek, propExams, propSchool, autoIncrement])

    const onCreate = () => {
        getParams({
            func: async (param: string | User) => {
                const token = param as string
                for (let i = 0; i < propMasses.length; i++) {
                    const massID = await FetchInformationPost(token, 'new_intention_admin', ['new_zielonki_mass'], propMasses[i].date, [propMasses[i].date.getTime()])
                    for (let j = 0; j < propMasses[i].intention.length; j++)
                        await FetchInformationPost(token, 'new_intention_admin', [massID + 'intention'], propMasses[i].intention[j], [1])
                    if (propMasses[i].collective == true)
                        await FetchInformationPost(token, 'new_intention_admin', [massID + 'collective'], true, [1])
                    await FetchInformationPost(token, 'new_intention_admin', [massID + 'color'], propMasses[i].color ?? '#ffffff', [1])
                    for (let j = 0; j < propMasses[i].description.length; j++)
                        await FetchInformationPost(token, 'new_intention_admin', [massID + 'description'], propMasses[i].description[j], [1])
                }
                if (date != null) {
                    for (let j = 0; j < propIssues.length; j++) {
                        console.log(date.getTime())
                        await FetchInformationPost(token, 'new_intention_admin', ['new_zielonki_date'], propIssues[j], [date.getTime()])
                    }
                    for (let j = 0; j < propAppointments.length; j++) {
                        const appointmentID = await FetchInformationPost(token, 'new_intention_admin', ['new_zielonki_appointment'], propAppointments[j].date, [propAppointments[j].date.getTime()])
                        await FetchInformationPost(token, 'new_intention_admin', [appointmentID + 'description'], propAppointments[j].type, [j])
                    }
                }
                setPrepare(false)
            }, type: 'token', show: false
        });
    }
    return (

        <>
            <MonthDateSelectionElement onSelectionChange={(date) => setDate(date)} />
            {propMasses.map((mass) => (<>
                <div key={mass.date.getTime()}>
                    {mass.date.toTimeString()
                        + ' | ' + (mass.intention.map((intention, index) => ((index != 0 ? ' - ' : '') + intention)))
                        + ' | ' + (mass.description.map((description, index) => ((index != 0 ? ' - ' : '') + description)))
                        + ' | ' + mass.color}
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
            <div>
            {prepare ? 
                <input type='button' value='Przygotuj dzień' onClick={onCreate} />
                    : null}
                {autoIncrement ? <span><input type='button' value='Zakończ' onClick={() => setAutoincrement(false)} /></span>
                    : <span><input type='button' value='Zacznij automatyczne dodawanie do końca miesiąca' onClick={() => setAutoincrement(true)} /></span>}
            </div> 
            {!showEdit ? <span><input type='button' value='Pokaż edytowanie' onClick={() => setShowEdit(true)} /></span>
                : <>

                    <span><input type='button' value='Schowaj edytowanie' onClick={() => setShowEdit(false)} /></span>
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
                            display: 'single',
                        },
                        {
                            name: 'feast',
                            type: 'radio',
                            multiple: false,
                            description: 'Rodzaj',
                            display: 'single',
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
                            display: 'single',
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
                            display: 'single',
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
                            display: 'single',
                        },
                        {
                            name: 'break_end',
                            type: 'date',
                            multiple: false,
                            description: 'Koniec ferii',
                            display: 'single',
                        },
                        {
                            name: 'end',
                            type: 'date',
                            multiple: false,
                            description: 'Zakończenie',
                            display: 'single',
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
                            display: 'single',
                        }
                    ],
                }
            } />
                </>}
        </>
    );
}