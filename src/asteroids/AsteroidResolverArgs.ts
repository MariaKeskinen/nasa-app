import { ArgsType, Field, InputType, Int } from 'type-graphql'
import { IsDateString } from '@/graphql/validators/IsDateString'
import { IsSameOrBeforeDay } from '@/graphql/validators/IsSameOrBeforeDay'
import { QueryBaseArguments } from '@/graphql/query-arguments/QueryBaseArguments'
import { SortBy, SortDirection, UNIT } from '@/asteroids/enums'
import { Max, Min, ValidateNested } from 'class-validator'

@InputType()
export class AsteroidsFilter {
    @Field(type => String, { nullable: true })
    @IsDateString()
    @IsSameOrBeforeDay('endDate', {
        message: 'Start date should be same or before as end date'
    })
    startDate?: string

    @Field(type => String, { nullable: true })
    @IsDateString()
    @IsSameOrBeforeDay(new Date(), { message: 'End date should be current day or earlier' })
    endDate?: string

    @Field(type => Boolean, { nullable: true })
    isPotentiallyHazardous?: boolean
}

@ArgsType()
export class AsteroidsArgs extends QueryBaseArguments<AsteroidsFilter>(AsteroidsFilter) {
    @Field(type => SortBy, { defaultValue: SortBy.date })
    sort: SortBy

    @Field(type => SortDirection, { defaultValue: SortDirection.desc })
    sortDirection: SortDirection

    @Field(type => AsteroidsFilter, { defaultValue: {} })
    @ValidateNested()
    filter: AsteroidsFilter

    @Field(limit => Int, { defaultValue: 10 })
    @Min(1)
    @Max(100)
    limit: number
}

@ArgsType()
export class DiameterArgs {
    @Field(type => UNIT, { defaultValue: SortBy.date })
    unit: UNIT

    @Field(type => Int, { defaultValue: 3, nullable: true })
    @Min(0)
    round: number | null
}
