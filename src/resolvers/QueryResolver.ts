import { Args, ArgsType, Field, InputType, Query, Resolver } from 'type-graphql'
import { AsteroidService } from '@/services/AsteroidService'
import { Asteroid } from '@/entities/Asteroid'
import { DateFilter, MonthYearArgs, SortLimitArgs } from '@/resolvers/QueryArguments'
import { ValidateNested } from 'class-validator'
import { AsteroidMonthService } from '@/services/AsteroidMonthService'
import { AsteroidMonth } from '@/entities/AsteroidMonth'
import { CloseApproachData } from '@/entities/CloseApproachData'

@InputType()
export class AsteroidsFilter extends DateFilter {
    @Field(type => Boolean, { nullable: true })
    isPotentiallyHazardous?: boolean

    @Field(type => Boolean, {
        defaultValue: false,
        description:
            'List all of the asteroids approaches, not only those within selected time period'
    })
    listAllApproaches?: boolean
}

@ArgsType()
export class AsteroidsArgs extends SortLimitArgs {
    @Field(type => AsteroidsFilter, { defaultValue: {} })
    @ValidateNested()
    filter: AsteroidsFilter
}

@ArgsType()
export class AsteroidMonthArgs {
    @Field(type => MonthYearArgs, { nullable: true })
    @ValidateNested()
    start?: MonthYearArgs

    @Field(type => MonthYearArgs, { nullable: true })
    @ValidateNested()
    end?: MonthYearArgs
}

@Resolver()
export class QueryResolver {
    constructor(
        private readonly asteroidService: AsteroidService,
        private readonly asteroidMonthService: AsteroidMonthService
    ) {}

    @Query(returns => [Asteroid])
    async asteroids(
        @Args() { filter, sort, sortDirection, limit }: AsteroidsArgs
    ): Promise<Asteroid[]> {
        return this.asteroidService.getAsteroids(filter, sort, sortDirection, limit)
    }

    @Query(returns => [CloseApproachData])
    async asteroidApproaches(
        @Args() { filter, sort, sortDirection, limit }: AsteroidsArgs
    ): Promise<CloseApproachData[]> {
        return this.asteroidService.getCloseApproachData(filter, sort, sortDirection, limit)
    }

    @Query(returns => [AsteroidMonth])
    async asteroidsByMonth(@Args() { start, end }: AsteroidMonthArgs): Promise<AsteroidMonth[]> {
        return this.asteroidMonthService.getGroupsByMonth(start, end)
    }
}
