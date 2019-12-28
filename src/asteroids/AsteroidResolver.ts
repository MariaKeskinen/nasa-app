import {
    Args,
    ArgsType,
    Field,
    FieldResolver,
    InputType,
    Int,
    Query,
    Resolver,
    Root
} from 'type-graphql'
import { Service } from 'typedi'
import { Asteroid } from '@/asteroids/Asteroid'
import { AsteroidService } from '@/asteroids/AsteroidService'
import { SortBy, SortDirection, UNIT } from '@/asteroids/enums'
import { Max, Min, ValidateNested } from 'class-validator'
import { Diameter } from '@/asteroids/Diameter'
import { IsSameOrBeforeDay } from '@/graphql/validators/IsSameOrBeforeDay'
import { IsDateString } from '@/graphql/validators/IsDateString'

@InputType()
export class AsteroidsFilter {
    @Field(type => String, { nullable: true })
    @IsDateString()
    @IsSameOrBeforeDay('endDate', { message: 'Start date should be same or before as end date' })
    startDate: string

    @Field(type => String, { nullable: true })
    @IsDateString()
    @IsSameOrBeforeDay(new Date(), { message: 'End date should be current day or earlier' })
    endDate: string

    @Field(type => Boolean, { nullable: true })
    isPotentiallyHazardous: boolean
}

@ArgsType()
class AsteroidsArgs {
    @Field(type => AsteroidsFilter)
    @ValidateNested()
    filter: AsteroidsFilter

    @Field(type => SortBy, { defaultValue: SortBy.date })
    sort: SortBy

    @Field(type => SortDirection, { defaultValue: SortDirection.desc })
    sortDirection: SortDirection

    @Field(limit => Int, { defaultValue: 10 })
    @Min(1)
    @Max(100)
    limit: number
}

@ArgsType()
class DiameterArgs {
    @Field(type => UNIT, { defaultValue: SortBy.date })
    unit: UNIT

    @Field(type => Int, { defaultValue: 3, nullable: true })
    @Min(0)
    round: number | null
}

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
