import { Service } from 'typedi'
import { Args, ArgsType, Ctx, FieldResolver, Resolver, Root } from 'type-graphql'
import { Asteroid } from '@/entities/Asteroid'
import { Month } from '@/helpers/enums'
import { SortLimitArgs } from '@/resolvers/QueryArguments'
import { AsteroidMonth } from '@/entities/AsteroidMonth'
import { CloseApproachData } from '@/entities/CloseApproachData'
import { Context } from '@/graphql/graphqlContext'

@ArgsType()
class MonthlyAsteroidArgs extends SortLimitArgs {}

@Service()
@Resolver(AsteroidMonth)
export class AsteroidMonthResolver {
    @FieldResolver()
    asteroids(
        @Root() root: AsteroidMonth,
        @Args() args: MonthlyAsteroidArgs,
        @Ctx() ctx: Context
    ): Promise<Asteroid[]> {
        return ctx.loaders.asteroidsByMonthLoader.load({
            month: root.month,
            year: root.year,
            sort: args.sort,
            sortDirection: args.sortDirection,
            limit: args.limit
        })
    }

    @FieldResolver()
    asteroidApproaches(
        @Root() root: AsteroidMonth,
        @Args() args: MonthlyAsteroidArgs,
        @Ctx() ctx: any
    ): Promise<CloseApproachData[]> {
        return ctx.loaders.asteroidApproachesByMonthLoader.load({
            month: root.month,
            year: root.year,
            sort: args.sort,
            sortDirection: args.sortDirection,
            limit: args.limit
        })
    }

    @FieldResolver()
    month(@Root() root: AsteroidMonth): string {
        return Month[root.month]
    }
}
