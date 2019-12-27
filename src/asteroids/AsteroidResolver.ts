import { Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Asteroid } from '@/asteroids/Asteroid'
import { AsteroidService } from '@/asteroids/AsteroidService'

@Service()
@Resolver(Asteroid)
export class AsteroidResolver {
    constructor(private readonly asteroidService: AsteroidService) {}

    @Query(returns => [Asteroid])
    async nearEarthAsteroids(): Promise<Asteroid[]> {
        return this.asteroidService.getAsteroids()
    }
}
