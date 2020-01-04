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
import { AsteroidGroupMonth } from '@/asteroidGroups/AsteroidGroup'
import { QueryBaseArguments } from '@/graphql/query-arguments/QueryBaseArguments'
import { Asteroid } from '@/asteroids/Asteroid'
import { AsteroidsArgs } from '@/asteroids/AsteroidResolverArgs'
import { Month } from '@/helpers/enums'
import { AsteroidGroupService } from '@/asteroidGroups/AsteroidGroupService'

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
    constructor(private readonly asteroidGroupService: AsteroidGroupService) {}

    @Query(returns => [AsteroidGroupMonth])
    async asteroidsByMonth(@Args() args: AsteroidGroupByMonthArgs): Promise<AsteroidGroupMonth[]> {
        return this.asteroidGroupService.getGroupsByMonth(args.filter)
    }

    @FieldResolver()
    asteroids(@Root() root: AsteroidGroupMonth, @Args() args: AsteroidsArgs): Promise<Asteroid[]> {
        return this.asteroidGroupService.getAsteroidsByMonth(
            root.month,
            root.year,
            args.filter,
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
