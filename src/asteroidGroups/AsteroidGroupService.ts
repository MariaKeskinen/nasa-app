import { Service } from 'typedi'
import { AsteroidsFilter } from '@/asteroids/AsteroidResolverArgs'
import { SortBy, SortDirection } from '@/helpers/enums'
import { Asteroid } from '@/asteroids/Asteroid'
import { format, getDate, getMonth, getYear, lastDayOfMonth, parse, subYears } from 'date-fns'
import { AsteroidGroupByMonthFilter } from '@/asteroidGroups/AsteroidGroupResolver'
import { AsteroidGroupMonth } from '@/asteroidGroups/AsteroidGroup'
import { getNextMonthWithYear } from '@/helpers/date-helpers'
import { AsteroidService } from '@/asteroids/AsteroidService'

@Service()
export class AsteroidGroupService {
    constructor(private readonly asteroidService: AsteroidService) {}

    public async getAsteroidsByMonth(
        month: number,
        year: number,
        filter: AsteroidsFilter,
        sort: SortBy,
        sortDirection: SortDirection,
        limit?: number
    ): Promise<Asteroid[]> {
        if (!filter) filter = {}
        const startDate = new Date(year, month, 1)
        filter.startDate = format(startDate, 'yyyy-MM-dd')
        filter.endDate = format(
            new Date(year, month, getDate(lastDayOfMonth(startDate))),
            'yyyy-MM-dd'
        )

        return this.asteroidService.getAsteroids(filter, sort, sortDirection, limit)
    }

    public getGroupsByMonth(filter: AsteroidGroupByMonthFilter): AsteroidGroupMonth[] {
        // By default, get results of last year
        const startDate = filter?.startDate
            ? parse(filter.startDate, 'MM-yyyy', new Date())
            : subYears(new Date(), 1)
        const endDate = filter?.endDate ? parse(filter?.endDate, 'MM-yyyy', new Date()) : new Date()

        const groups: AsteroidGroupMonth[] = []

        const lastMonth = getMonth(endDate)
        const lastYear = getYear(endDate)

        let monthAndYear = {
            month: getMonth(startDate),
            year: getYear(startDate)
        }

        do {
            groups.push(new AsteroidGroupMonth(monthAndYear.month, monthAndYear.year))
            monthAndYear = getNextMonthWithYear(monthAndYear)
        } while (
            monthAndYear.year < lastYear ||
            (monthAndYear.year === lastYear && monthAndYear.month <= lastMonth)
        )

        return groups
    }
}
