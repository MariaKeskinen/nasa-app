import { Field, Float, ObjectType } from 'type-graphql'

@ObjectType()
export class Diameter {
    @Field(type => Float, { nullable: true })
    min: number

    @Field(type => Float, { nullable: true })
    max: number

    constructor(data: { min: number; max: number }) {
        this.min = data.min
        this.max = data.max
    }
}
