import { Arg, Field, ObjectType } from 'type-graphql'
import { LONG_DISTANCE_UNIT, VELOCITY_UNIT } from '@/asteroids-neo/enums'

@ObjectType()
export class CloseApproachData {
    @Field(type => String, { nullable: true })
    date: string

    @Field(type => String, { nullable: true })
    orbitingBody: string

    @Field(type => String, { nullable: true })
    relativeVelocity(
        @Arg('unit', returns => VELOCITY_UNIT, {
            defaultValue: VELOCITY_UNIT.KM_S
        })
        unit: VELOCITY_UNIT
    ): string {
        return this.relativeVelocityData?.[unit]
    }

    @Field(type => String)
    missDistance(
        @Arg('unit', returns => LONG_DISTANCE_UNIT, {
            defaultValue: LONG_DISTANCE_UNIT.ASTRONOMICAL,
            nullable: true
        })
        unit: LONG_DISTANCE_UNIT
    ): string {
        return this.missDistanceData?.[unit]
    }

    private readonly relativeVelocityData: Record<string, string>
    private readonly missDistanceData: Record<string, string>

    constructor(data: Record<string, any>) {
        this.date = data?.close_approach_date
        this.orbitingBody = data?.orbiting_body
        this.relativeVelocityData = data?.relative_velocity || {}
        this.missDistanceData = data?.miss_distance || {}
    }
}
