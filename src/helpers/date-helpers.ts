import { format, subYears } from 'date-fns'

type MonthAndYear = {
    month: number
    year: number
}

export const getNextMonthWithYear = ({ month, year }: MonthAndYear): MonthAndYear => {
    if (month + 1 > 11) {
        return {
            month: 1,
            year: year + 1
        }
    }
    return {
        month: month + 1,
        year
    }
}
