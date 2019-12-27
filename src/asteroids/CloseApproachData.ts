import { Arg, Field, ObjectType } from 'type-graphql'
import { LONG_DISTANCE_UNIT, VELOCITY_UNIT } from '@/asteroids/enums'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Asteroid } from '@/asteroids/Asteroid'

@Entity()
@ObjectType()
export class CloseApproachData {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(
        type => Asteroid,
        asteroid => asteroid.closeApproachData
    )
    asteroid: Asteroid

    @Column()
    @Field(type => String, { nullable: true })
    date: string

    @Column()
    @Field(type => String, { nullable: true })
    orbitingBody: string

    @Field(type => String, { nullable: true })
    relativeVelocity(
        @Arg('unit', returns => VELOCITY_UNIT, {
            defaultValue: VELOCITY_UNIT.KM_S
        })
        unit: VELOCITY_UNIT
    ): string {
        const data = JSON.parse(this.relativeVelocityData)
        return data?.[unit]
    }

    @Field(type => String, { nullable: true })
    missDistance(
        @Arg('unit', returns => LONG_DISTANCE_UNIT, {
            defaultValue: LONG_DISTANCE_UNIT.ASTRONOMICAL,
            nullable: true
        })
        unit: LONG_DISTANCE_UNIT
    ): string {
        const data = JSON.parse(this.missDistanceData)
        return data?.[unit]
    }

    @Column()
    private relativeVelocityData: string

    @Column()
    private missDistanceData: string

    public static fromApiData(data: Record<string, any>): CloseApproachData {
        const closeApproachData = new CloseApproachData()
        closeApproachData.date = data?.close_approach_date
        closeApproachData.orbitingBody = data?.orbiting_body
        closeApproachData.relativeVelocityData = JSON.stringify(data?.relative_velocity || {})
        closeApproachData.missDistanceData = JSON.stringify(data?.miss_distance || {})

        return closeApproachData
    }
}
