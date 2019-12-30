import { Service } from 'typedi'
import {
    addDays,
    format,
    getDate,
    getMonth,
    getYear,
    lastDayOfMonth,
    parse,
    subYears
} from 'date-fns'
import { getRepository, SelectQueryBuilder } from 'typeorm'
import { Asteroid } from '@/asteroids/Asteroid'
import { SortBy, SortDirection } from '@/asteroids/enums'
import { AsteroidGroupMonth } from '@/asteroids/AsteroidGroup'
import { AsteroidGroupByMonthFilter } from '@/asteroids/AsteroidGroupResolver'
import { getNextMonthWithYear } from '@/helpers/date-helpers'
import { AsteroidsFilter } from '@/asteroids/AsteroidResolverArgs'

@Service()
export class AsteroidService {
    public async getAsteroids(
        filter: AsteroidsFilter,
        sort: SortBy,
        sortDirection: SortDirection,
        limit?: number
    ): Promise<Asteroid[]> {
        const repository = await getRepository(Asteroid)
        let query = repository
            .createQueryBuilder('asteroid')
            .innerJoinAndSelect('asteroid.closeApproachData', 'closeApproachData')

        query = this.addWhereConditions(query, filter)

        query = query.orderBy(this.getSortColumn(sort, sortDirection), sortDirection)

        if (limit) {
            query = query.take(limit)
        }

        return query.getMany()
    }

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

        return this.getAsteroids(filter, sort, sortDirection, limit)
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

    private addWhereConditions(
        query: SelectQueryBuilder<Asteroid>,
        filter: AsteroidsFilter = {}
    ): SelectQueryBuilder<Asteroid> {
        const startDate = filter.startDate && new Date(filter.startDate)
        const endDate = filter.endDate ? addDays(new Date(filter.endDate), 1) : new Date()
        const isPotentiallyHazardous = filter.isPotentiallyHazardous ?? null

        query = query.where('closeApproachData.epochDate < :endDate', { endDate })

        if (startDate) {
            query.andWhere('closeApproachData.epochDate >= :startDate', { startDate })
        }

        if (isPotentiallyHazardous !== null) {
            query.andWhere('asteroid.isPotentiallyHazardous = :isPotentiallyHazardous', {
                isPotentiallyHazardous: isPotentiallyHazardous
            })
        }

        return query
    }

    private getSortColumn(sort: SortBy, sortDirection: SortDirection): string {
        switch (sort) {
            case SortBy.date:
                return 'closeApproachData.epochDate'
            case SortBy.diameter:
                return sortDirection === SortDirection.asc
                    ? 'asteroid.estimatedDiameterMin'
                    : 'asteroid.estimatedDiameterMax'
            case SortBy.distance:
                return 'closeApproachData.missDistanceKm'
        }
    }
}
