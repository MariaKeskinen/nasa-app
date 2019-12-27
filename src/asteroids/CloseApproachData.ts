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
    @Field(type => Asteroid)
    asteroid: Asteroid

    @Column({ nullable: true })
    @Field(type => String, { nullable: true })
    date: string

    @Column({ nullable: true })
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

    @Column({ nullable: true })
    private relativeVelocityData: string

    @Column({ nullable: true })
    private missDistanceData: string

    @Column({ nullable: true })
    private epochDate: number

    public static fromApiData(data: Record<string, any>): CloseApproachData {
        const closeApproachData = new CloseApproachData()
        closeApproachData.date = data?.close_approach_date
        closeApproachData.orbitingBody = data?.orbiting_body
        closeApproachData.relativeVelocityData = JSON.stringify(data?.relative_velocity || {})
        closeApproachData.missDistanceData = JSON.stringify(data?.miss_distance || {})
        closeApproachData.epochDate = data?.epoch_date_close_approach

        return closeApproachData
    }
}
