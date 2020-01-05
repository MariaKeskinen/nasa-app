import { Service } from 'typedi'
import { addDays } from 'date-fns'
import { reverse, sortBy } from 'lodash'
import { getManager, SelectQueryBuilder } from 'typeorm'
import { Asteroid } from '@/entities/Asteroid'
import { SortBy, SortDirection } from '@/helpers/enums'
import { AsteroidsFilter } from '@/resolvers/QueryResolver'
import { CloseApproachData } from '@/entities/CloseApproachData'

@Service()
export class AsteroidService {
    public async getAsteroids(
        filter: AsteroidsFilter,
        sort: SortBy,
        sortDirection: SortDirection,
        limit?: number
    ): Promise<Asteroid[]> {
        return this.getData<Asteroid>('asteroid', filter, sort, sortDirection, limit)
    }

    public async getCloseApproachData(
        filter: AsteroidsFilter,
        sort: SortBy,
        sortDirection: SortDirection,
        limit?: number
    ): Promise<CloseApproachData[]> {
        return this.getData<CloseApproachData>(
            'closeApproachData',
            filter,
            sort,
            sortDirection,
            limit
        )
    }

    private async getData<T extends Asteroid | CloseApproachData>(
        type: 'asteroid' | 'closeApproachData',
        filter: AsteroidsFilter,
        sort: SortBy,
        sortDirection: SortDirection,
        limit?: number
    ): Promise<T[]> {
        let queryBuilder: SelectQueryBuilder<Asteroid | CloseApproachData>

        switch (type) {
            case 'asteroid':
                queryBuilder = await getManager()
                    .createQueryBuilder(Asteroid, 'asteroid')
                    .leftJoinAndSelect('asteroid.closeApproachData', 'closeApproachData')
                if (filter.listAllApproaches) {
                    queryBuilder.leftJoin('asteroid.closeApproachData', 'closeApproachDataFilter')
                }
                break
            case 'closeApproachData':
                queryBuilder = await getManager()
                    .createQueryBuilder(CloseApproachData, 'closeApproachData')
                    .innerJoinAndSelect('closeApproachData.asteroid', 'asteroid')
                break
        }

        let query = this.addWhereConditions(queryBuilder, filter)

        query = query.orderBy(this.getSortColumn(sort), sortDirection, 'NULLS LAST')

        if (limit && sort !== SortBy.diameterAvg) {
            query = query.take(limit)
        }

        const result = await query.getMany()

        if (sort === SortBy.diameterAvg) {
            // Sort here, because cannot be sorted with sql
            return this.sortByDiameterAvg<T>(result, sortDirection).slice(0, limit ?? result.length)
        }

        return result
    }

    private addWhereConditions(
        query: SelectQueryBuilder<any>,
        filter: AsteroidsFilter = {}
    ): SelectQueryBuilder<any> {
        const startDate = filter.startDate && new Date(filter.startDate)
        const endDate = filter.endDate ? addDays(new Date(filter.endDate), 1) : new Date()
        const isPotentiallyHazardous = filter.isPotentiallyHazardous ?? null

        const closeApproachDataField = filter.listAllApproaches
            ? 'closeApproachDataFilter'
            : 'closeApproachData'

        query = query.where(`${closeApproachDataField}.epochDate < :endDate`, { endDate })

        if (startDate) {
            query.andWhere(`${closeApproachDataField}.epochDate >= :startDate`, { startDate })
        }

        if (isPotentiallyHazardous !== null) {
            query.andWhere('asteroid.isPotentiallyHazardous = :isPotentiallyHazardous', {
                isPotentiallyHazardous: isPotentiallyHazardous
            })
        }

        return query
    }

    private getSortColumn(sort: SortBy): string {
        switch (sort) {
            case SortBy.date:
                return 'closeApproachData.epochDate'
            case SortBy.diameterMin:
                return 'asteroid.estimatedDiameterMin'
            case SortBy.diameterMax:
                return 'asteroid.estimatedDiameterMax'
            case SortBy.distance:
                return 'closeApproachData.missDistanceKm'
        }
    }

    private sortByDiameterAvg<T extends CloseApproachData | Asteroid>(
        data: T[],
        sortDirection: SortDirection
    ): T[] {
        const sorted = sortBy(data, d => {
            const asteroid = (d instanceof CloseApproachData ? d.asteroid : d) as Asteroid
            if (!asteroid.estimatedDiameterMax || !asteroid.estimatedDiameterMin) return null

            return (asteroid.estimatedDiameterMin + asteroid.estimatedDiameterMax) / 2
        })

        if (sortDirection === SortDirection.desc) {
            return reverse(sorted)
        }

        return sorted
    }
}
