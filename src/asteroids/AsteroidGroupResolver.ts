import { Service } from 'typedi'
import {
    Args,
    ArgsType,
    Field,
    FieldResolver,
    InputType,
    Query,
    Resolver,
    Root
} from 'type-graphql'
import { AsteroidGroupMonth } from '@/asteroids/AsteroidGroup'
import { AsteroidService } from '@/asteroids/AsteroidService'
import { QueryBaseArguments } from '@/graphql/query-arguments/QueryBaseArguments'
import { Asteroid } from '@/asteroids/Asteroid'
import { AsteroidsArgs } from '@/asteroids/AsteroidResolverArgs'

@InputType()
export class AsteroidGroupByMonthFilter {
    @Field(type => String)
    startDate: string

    @Field(type => String)
    endDate: string
}

@ArgsType()
export class AsteroidGroupByMonthArgs extends QueryBaseArguments<AsteroidGroupByMonthFilter>(
    AsteroidGroupByMonthFilter
) {}

@Service()
@Resolver(AsteroidGroupMonth)
export class AsteroidGroupResolver {
    @Query(returns => [AsteroidGroupMonth])
    async asteroidsByMonth(@Args() args: AsteroidGroupByMonthArgs): Promise<AsteroidGroupMonth[]> {
        const asteroidService = new AsteroidService()
        return asteroidService.getGroupsByMonth(args.filter)
    }

    @FieldResolver()
    asteroids(@Root() root: AsteroidGroupMonth, @Args() args: AsteroidsArgs): Promise<Asteroid[]> {
        const asteroidService = new AsteroidService()
        return asteroidService.getAsteroidsByMonth(
            root.month,
            root.year,
            args.filter,
            args.sort,
            args.sortDirection,
            args.limit
        )
    }
}
