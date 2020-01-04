import { Arg, Field, Float, ObjectType } from 'type-graphql'
import { LONG_DISTANCE_UNIT, VELOCITY_UNIT } from '@/helpers/enums'
import { Column, Entity, getRepository, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
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

    @Field(type => Float, { nullable: true })
    relativeVelocity: number

    @Field(type => Float, { nullable: true })
    missDistance: number

    @Column({ type: 'float', nullable: true })
    public relativeVelocityKmPerH: number

    @Column({ type: 'float', nullable: true })
    public missDistanceKm: number

    @Column({ nullable: true })
    public epochDate: number

    public static fromApiData(data: Record<string, any>): CloseApproachData {
        const closeApproachData = new CloseApproachData()
        closeApproachData.date = data?.close_approach_date
        closeApproachData.orbitingBody = data?.orbiting_body
        closeApproachData.relativeVelocityKmPerH = parseFloat(
            data?.relative_velocity?.kilometers_per_hour || '0'
        )
        closeApproachData.missDistanceKm = parseFloat(data?.miss_distance?.kilometers || '0')
        closeApproachData.epochDate = data?.epoch_date_close_approach

        return closeApproachData
    }

    public save(): Promise<CloseApproachData> {
        const repository = getRepository(CloseApproachData)
        return repository.save(this)
    }
}
