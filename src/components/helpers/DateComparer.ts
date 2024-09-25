export function CompareMonthDay(date0: Date | undefined, date1: Date | undefined) {
    return (date0 == null || date1 == null) ? false :(date0.getDay() == date1.getDay()) && (date0.getMonth() == date1.getMonth())

}
export function CompareDayMonthDate(date: Date | undefined, day: number | undefined, index: number | undefined) {
    if (date == null || day == null || index == null)
        return false
    if (date.getDate() != day)
        return false
    if (index > 0)
        return date.getDay() - index * 7 >= 0
    return (new Date(date.getTime() - index * 604800000)).getMonth() == date.getMonth()

}