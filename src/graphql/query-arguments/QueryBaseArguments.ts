import { ArgsType, Field, Int } from 'type-graphql'
import { Max, Min, ValidateNested } from 'class-validator'
import { ReturnTypeFuncValue } from 'type-graphql/dist/decorators/types'

export function QueryBaseArguments<FilterType>(filterReturnFunctionValue: ReturnTypeFuncValue) {
    @ArgsType()
    abstract class QueryBaseArgumentsClass {
        @Field(type => filterReturnFunctionValue, { defaultValue: {} })
        @ValidateNested()
        filter: FilterType

        @Field(limit => Int, { defaultValue: 10 })
        @Min(1)
        @Max(100)
        limit: number
    }

    return QueryBaseArgumentsClass
}
