import { Field, Int, ObjectType } from 'type-graphql'
import { Asteroid } from '@/entities/Asteroid'
import { CloseApproachData } from '@/entities/CloseApproachData'

@ObjectType()
export class AsteroidMonth {
    @Field(type => String)
    month: number

    @Field(type => Int)
    year: number

    @Field(type => [Asteroid])
    asteroids: Asteroid[]

    @Field(type => [CloseApproachData])
    asteroidApproaches: CloseApproachData[]

    constructor(month: number, year: number) {
        this.month = month
        this.year = year
        this.asteroids = []
    }
}
