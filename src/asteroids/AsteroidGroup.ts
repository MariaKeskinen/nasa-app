import { Field, Int, ObjectType } from 'type-graphql'
import { Asteroid } from '@/asteroids/Asteroid'
import { Month } from '@/asteroids/enums'

@ObjectType()
export class AsteroidGroupMonth {
    @Field(type => String)
    month: number

    @Field(type => Int)
    year: number

    @Field(type => [Asteroid])
    asteroids: Asteroid[]

    constructor(month: number, year: number) {
        this.month = month
        this.year = year
        this.asteroids = []
    }
}
