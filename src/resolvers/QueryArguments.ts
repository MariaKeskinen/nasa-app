import { ArgsType, Field, InputType, Int } from 'type-graphql'
import { Max, Min } from 'class-validator'
import { IsDateString } from '@/graphql/validators/IsDateString'
import { IsSameOrBeforeDay } from '@/graphql/validators/IsSameOrBeforeDay'
import { SortBy, SortDirection } from '@/helpers/enums'

@ArgsType()
export class SortLimitArgs {
    @Field(type => SortBy, { defaultValue: SortBy.date })
    sort: SortBy

    @Field(type => SortDirection, { defaultValue: SortDirection.desc })
    sortDirection: SortDirection

    @Field(limit => Int, { nullable: true })
    @Min(1)
    limit: number
}

@ArgsType()
@InputType()
export class DateFilter {
    @Field(type => String, { nullable: true, description: 'Date format YYYY-MM-DD' })
    @IsDateString()
    @IsSameOrBeforeDay('endDate', {
        message: 'Start date should be same or before as end date'
    })
    startDate?: string

    @Field(type => String, { nullable: true, description: 'Date format YYYY-MM-DD' })
    @IsDateString()
    @IsSameOrBeforeDay(new Date(), { message: 'End date should be current day or earlier' })
    endDate?: string
}

@InputType()
export class MonthYearArgs {
    @Field(type => Int, { description: 'Month as number 1-12' })
    @Min(1)
    @Max(12)
    month: number

    @Field(type => Int, { description: `Year as number 2010-${new Date().getFullYear()}` })
    @Min(2010)
    @Max(new Date().getFullYear())
    year: number
}
