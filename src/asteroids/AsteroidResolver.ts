import { Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { Service } from 'typedi'
import { Asteroid } from '@/asteroids/Asteroid'
import { AsteroidService } from '@/asteroids/AsteroidService'
import { Diameter } from '@/asteroids/Diameter'
import { AsteroidsArgs, DiameterArgs } from '@/asteroids/AsteroidResolverArgs'

@Service()
@Resolver(Asteroid)
export class AsteroidResolver {
    @Query(returns => [Asteroid])
    async asteroids(
        @Args() { filter, sort, sortDirection, limit }: AsteroidsArgs
    ): Promise<Asteroid[]> {
        const asteroidService = new AsteroidService()

        return asteroidService.getAsteroids(filter, sort, sortDirection, limit)
    }

    @FieldResolver()
    estimatedDiameter(@Root() asteroid: Asteroid, @Args() { unit, round }: DiameterArgs): Diameter {
        return new Diameter(
            asteroid.estimatedDiameterMin,
            asteroid.estimatedDiameterMax,
            unit,
            round
        )
    }
}
