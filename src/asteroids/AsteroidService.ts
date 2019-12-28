import { Service } from 'typedi'
import { addDays, parse } from 'date-fns'
import { Asteroid } from '@/asteroids/Asteroid'
import { SortBy, SortDirection } from '@/asteroids/enums'
import { getRepository } from 'typeorm'
import { AsteroidsFilter } from '@/asteroids/AsteroidResolver'

@Service()
export class AsteroidService {
    public async getAsteroids(
        filter: AsteroidsFilter,
        sort: SortBy,
        sortDirection: SortDirection,
        limit: number
    ): Promise<Asteroid[]> {
        const startDate = parse(filter.startDate, 'yyyy-MM-dd', new Date())
        const endDate = addDays(parse(filter.endDate, 'yyyy-MM-dd', new Date()), 1)

        return await getRepository(Asteroid)
            .createQueryBuilder('asteroid')
            .innerJoinAndSelect('asteroid.closeApproachData', 'closeApproachData')
            .where('closeApproachData.epochDate >= :startDate', { startDate })
            .andWhere('closeApproachData.epochDate < :endDate', { endDate })
            .orderBy(this.getSortColumn(sort, sortDirection), sortDirection)
            .take(limit)
            .getMany()
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
