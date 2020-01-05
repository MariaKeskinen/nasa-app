import { Args, ArgsType, Field, InputType, Query, Resolver } from 'type-graphql'
import { AsteroidService } from '@/services/AsteroidService'
import { Asteroid } from '@/entities/Asteroid'
import { AsteroidGroupMonth } from '@/entities/AsteroidGroup'
import { AsteroidGroupService } from '@/services/AsteroidGroupService'
import { DateFilter, MonthYearArgs, SortLimitArgs } from '@/resolvers/QueryArguments'
import { ValidateNested } from 'class-validator'

@InputType()
export class AsteroidsFilter extends DateFilter {
    @Field(type => Boolean, { nullable: true })
    isPotentiallyHazardous?: boolean
}

@ArgsType()
export class AsteroidsArgs extends SortLimitArgs {
    @Field(type => AsteroidsFilter, { defaultValue: {} })
    @ValidateNested()
    filter: AsteroidsFilter
}

@ArgsType()
export class AsteroidGroupByMonthArgs {
    @Field(type => MonthYearArgs, { nullable: true })
    @ValidateNested()
    start: MonthYearArgs

    @Field(type => MonthYearArgs, { nullable: true })
    @ValidateNested()
    end: MonthYearArgs
}

@Resolver()
export class QueryResolver {
    constructor(
        private readonly asteroidService: AsteroidService,
        private readonly asteroidGroupService: AsteroidGroupService
    ) {}

    @Query(returns => [Asteroid])
    async asteroids(
        @Args() { filter, sort, sortDirection, limit }: AsteroidsArgs
    ): Promise<Asteroid[]> {
        return this.asteroidService.getAsteroids(filter, sort, sortDirection, limit)
    }

    @Query(returns => [AsteroidGroupMonth])
    async asteroidsByMonth(
        @Args() { start, end }: AsteroidGroupByMonthArgs
    ): Promise<AsteroidGroupMonth[]> {
        return this.asteroidGroupService.getGroupsByMonth(start, end)
    }

    // @Query()
    // closeApproachData(): CloseApproachData[] {}
}
