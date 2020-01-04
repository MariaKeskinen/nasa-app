import { Service } from 'typedi'
import { addDays } from 'date-fns'
import { getRepository, SelectQueryBuilder } from 'typeorm'
import { Asteroid } from '@/asteroids/Asteroid'
import { SortBy, SortDirection } from '@/helpers/enums'
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
