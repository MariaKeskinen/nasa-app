import { Service } from 'typedi'
import { Args, ArgsType, FieldResolver, Resolver, Root } from 'type-graphql'
import { Asteroid } from '@/entities/Asteroid'
import { Month } from '@/helpers/enums'
import { SortLimitArgs } from '@/resolvers/QueryArguments'
import { AsteroidMonthService } from '@/services/AsteroidMonthService'
import { AsteroidMonth } from '@/entities/AsteroidMonth'
import { CloseApproachData } from '@/entities/CloseApproachData'

@ArgsType()
class MonthlyAsteroidArgs extends SortLimitArgs {}

@Service()
@Resolver(AsteroidMonth)
export class AsteroidMonthResolver {
    constructor(private readonly asteroidMonthService: AsteroidMonthService) {}

    @FieldResolver()
    asteroids(@Root() root: AsteroidMonth, @Args() args: MonthlyAsteroidArgs): Promise<Asteroid[]> {
        return this.asteroidMonthService.getAsteroidsByMonth(
            root.month,
            root.year,
            args.sort,
            args.sortDirection,
            args.limit
        )
    }

    @FieldResolver()
    asteroidApproaches(
        @Root() root: AsteroidMonth,
        @Args() args: MonthlyAsteroidArgs
    ): Promise<CloseApproachData[]> {
        return this.asteroidMonthService.getAsteroidApproachesByMonth(
            root.month,
            root.year,
            args.sort,
            args.sortDirection,
            args.limit
        )
    }

    @FieldResolver()
    month(@Root() root: AsteroidMonth): string {
        return Month[root.month]
    }
}
