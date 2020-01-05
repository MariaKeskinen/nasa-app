import { Service } from 'typedi'
import { Args, ArgsType, FieldResolver, Resolver, Root } from 'type-graphql'
import { AsteroidGroupMonth } from '@/entities/AsteroidGroup'
import { Asteroid } from '@/entities/Asteroid'
import { Month } from '@/helpers/enums'
import { AsteroidGroupService } from '@/services/AsteroidGroupService'
import { SortLimitArgs } from '@/resolvers/QueryArguments'

@ArgsType()
class MonthlyAsteroidArgs extends SortLimitArgs {}

@Service()
@Resolver(AsteroidGroupMonth)
export class AsteroidGroupResolver {
    constructor(private readonly asteroidGroupService: AsteroidGroupService) {}

    @FieldResolver()
    asteroids(
        @Root() root: AsteroidGroupMonth,
        @Args() args: MonthlyAsteroidArgs
    ): Promise<Asteroid[]> {
        return this.asteroidGroupService.getAsteroidsByMonth(
            root.month,
            root.year,
            args.sort,
            args.sortDirection,
            args.limit
        )
    }

    @FieldResolver()
    month(@Root() root: AsteroidGroupMonth): string {
        return Month[root.month]
    }
}
