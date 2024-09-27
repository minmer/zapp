export function CompareDate(date0: Date | undefined, date1: Date | undefined) {
    return (date0 == null || date1 == null) ? false : (date0.getDate() == date1.getDate()) && (date0.getMonth() == date1.getMonth()) && (date0.getFullYear() == date1.getFullYear())

}
export function CompareMonthDay(date0: Date | undefined, date1: Date | undefined) {
    return (date0 == null || date1 == null) ? false : (date0.getDate() == date1.getDate()) && (date0.getMonth() == date1.getMonth())

}
export function CompareDayMonthDate(date: Date | undefined, day: number | undefined, index: number | undefined) {
    if (date == null || day == null || index == null)
        return false
    if (date.getDay() != day)
        return false
    if (index > 0)
        return date.getDate() - index * 7 > -7 && date.getDate() - index * 7 <= 0
    return !(AddDaysToDate(date, - index * 7).getMonth() == date.getMonth()) && !(AddDaysToDate(date, -index * 7 - 7).getMonth() != date.getMonth())
}
export function BetweenDates(date: Date | undefined, start: Date | undefined, end: Date | undefined) {
    if (date == null || start == null || end == null)
        return false
    return date.getTime() >= start.getTime() && date.getTime() <= end.getTime()

}
export function AddDaysToDate(date: Date | undefined, number: number | undefined) {
    if (date == null || number == null)
        return date ?? new Date()
    const newDate = new Date(date.getTime())
    newDate.setDate(newDate.getDate() + number)
    newDate.setHours(0, 0, 0, 0)
    return newDate

}
export function AddTimeToDate(date: Date | undefined, hours: number | undefined, minutes: number | undefined) {
    if (date == null || hours == null)
        return date ?? new Date()
    const newDate = new Date(date.getTime())
    newDate.setHours(hours, minutes, 0, 0)
    return newDate

}