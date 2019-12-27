import { Service } from 'typedi'
import { Asteroid } from '@/asteroids/Asteroid'
import { SortBy, SortDirection } from '@/asteroids/enums'
import { getRepository } from 'typeorm'

@Service()
export class AsteroidService {
    public async getAsteroids(
        sort: SortBy,
        sortDirection: SortDirection,
        limit: number
    ): Promise<Asteroid[]> {
        return await getRepository(Asteroid)
            .createQueryBuilder('asteroid')
            .innerJoinAndSelect('asteroid.closeApproachData', 'closeApproachData')
            .orderBy('closeApproachData.epochDate', sortDirection)
            .take(limit)
            .getMany()
    }
}
