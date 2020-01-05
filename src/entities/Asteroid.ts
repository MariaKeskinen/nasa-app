import { Field, Float, Int, ObjectType } from 'type-graphql'
import { Diameter } from '@/entities/Diameter'
import { CloseApproachData } from '@/entities/CloseApproachData'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@ObjectType()
export class Asteroid {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number

    @Column({ nullable: true })
    @Field(type => String, { nullable: true })
    nasaId: string

    @Column({ nullable: true })
    @Field(type => String, { nullable: true })
    neoReferenceId: string

    @Column({ nullable: true })
    @Field(type => String, { nullable: true })
    name: string

    @Column({ nullable: true })
    @Field(type => String, { nullable: true })
    nasaJplUrl: string

    @Column({ type: 'float', nullable: true })
    @Field(type => Float, { nullable: true })
    absoluteMagnitudeH: number

    @Column({ type: 'boolean', nullable: true })
    @Field(type => Boolean, { nullable: true })
    isPotentiallyHazardous: boolean

    @Column({ type: 'float', nullable: true })
    estimatedDiameterMin: number

    @Column({ type: 'float', nullable: true })
    estimatedDiameterMax: number

    @Field(type => Diameter, { nullable: true })
    estimatedDiameter: Diameter

    @OneToMany(
        type => CloseApproachData,
        closeApproachData => closeApproachData.asteroid,
        {
            cascade: true
        }
    )
    @Field(type => [CloseApproachData], { nullable: true })
    closeApproachData: CloseApproachData[]

    public static fromApiData(data: Record<string, any>): Asteroid {
        const asteroid = new Asteroid()

        asteroid.nasaId = data.id
        asteroid.neoReferenceId = data.neo_reference_id
        asteroid.name = data.name
        asteroid.nasaJplUrl = data.nasa_jpl_url
        asteroid.absoluteMagnitudeH = data.absolute_magnitude_h
        asteroid.estimatedDiameterMin = data.estimated_diameter?.meters?.estimated_diameter_min
        asteroid.estimatedDiameterMax = data.estimated_diameter?.meters?.estimated_diameter_max
        asteroid.isPotentiallyHazardous = data.is_potentially_hazardous_asteroid
        asteroid.closeApproachData =
            data.close_approach_data &&
            data.close_approach_data.map((d: any) => CloseApproachData.fromApiData(d))

        return asteroid
    }
}
