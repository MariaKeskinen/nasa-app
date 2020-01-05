import { Service } from 'typedi'
import { SortBy, SortDirection } from '@/helpers/enums'
import { Asteroid } from '@/entities/Asteroid'
import { format, getDate, getMonth, getYear, lastDayOfMonth, subYears } from 'date-fns'
import { getNextMonthWithYear } from '@/helpers/date-helpers'
import { AsteroidService } from '@/services/AsteroidService'
import { MonthYearArgs } from '@/resolvers/QueryArguments'
import { AsteroidMonth } from '@/entities/AsteroidMonth'

@Service()
export class AsteroidMonthService {
    constructor(private readonly asteroidService: AsteroidService) {}

    public async getAsteroidsByMonth(
        month: number,
        year: number,
        sort: SortBy,
        sortDirection: SortDirection,
        limit?: number
    ): Promise<Asteroid[]> {
        const startDate = new Date(year, month, 1)

        const filter = {
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(new Date(year, month, getDate(lastDayOfMonth(startDate))), 'yyyy-MM-dd')
        }

        return this.asteroidService.getAsteroids(filter, sort, sortDirection, limit)
    }

    public getGroupsByMonth(start: MonthYearArgs, end: MonthYearArgs): AsteroidMonth[] {
        // By default, get results of last year
        const startDate = start ? new Date(start.year, start.month - 1, 1) : subYears(new Date(), 1)
        const endDate = end ? new Date(end.year, end.month - 1, 1) : new Date()

        const groups: AsteroidMonth[] = []

        const lastMonth = getMonth(endDate)
        const lastYear = getYear(endDate)

        let monthAndYear = {
            month: getMonth(startDate),
            year: getYear(startDate)
        }

        do {
            groups.push(new AsteroidMonth(monthAndYear.month, monthAndYear.year))
            monthAndYear = getNextMonthWithYear(monthAndYear)
        } while (
            monthAndYear.year < lastYear ||
            (monthAndYear.year === lastYear && monthAndYear.month <= lastMonth)
        )

        return groups
    }
}
