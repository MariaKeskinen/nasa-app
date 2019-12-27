import { Arg, Field, Float, ObjectType } from 'type-graphql'
import { Diameter } from '@/asteroids/Diameter'
import { UNIT } from '@/asteroids/enums'
import { CloseApproachData } from '@/asteroids/CloseApproachData'
import { Column, Entity, getRepository, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@ObjectType()
export class Asteroid {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Field(type => String)
    nasaId: string

    @Column()
    @Field(type => String)
    neoReferenceId: string

    @Column()
    @Field(type => String)
    name: string

    @Column()
    @Field(type => String)
    nasaJplUrl: string

    @Column({ type: 'float' })
    @Field(type => Float)
    absoluteMagnitudeH: number

    @Column({ type: 'boolean' })
    @Field(type => Boolean)
    isPotentiallyHazardous: boolean

    @Field(type => Diameter)
    estimatedDiameter(
        @Arg('unit', returns => UNIT, { defaultValue: UNIT.KM }) unit: UNIT
    ): Diameter {
        const data = JSON.parse(this.estimatedDiameterData)
        const values = {
            min: data?.[unit]?.estimated_diameter_min,
            max: data?.[unit]?.estimated_diameter_max
        }
        return new Diameter(values)
    }

    @OneToMany(
        type => CloseApproachData,
        closeApproachData => closeApproachData.id,
        {
            cascade: true
        }
    )
    closeApproachDataItems: CloseApproachData[]

    @Column()
    private estimatedDiameterData: string

    public static fromApiData(data: Record<string, any>): Asteroid {
        const asteroid = new Asteroid()

        asteroid.nasaId = data.id
        asteroid.neoReferenceId = data.neo_reference_id
        asteroid.name = data.name
        asteroid.nasaJplUrl = data.nasa_jpl_url
        asteroid.absoluteMagnitudeH = data.absolute_magnitude_h
        asteroid.estimatedDiameterData = JSON.stringify(data.estimated_diameter || {})
        asteroid.isPotentiallyHazardous = data.is_potentially_hazardous_asteroid
        asteroid.closeApproachDataItems =
            data.close_approach_data &&
            data.close_approach_data.map((d: any) => CloseApproachData.fromApiData(d, asteroid))

        return asteroid
    }

    public async save(): Promise<Asteroid> {
        const repository = getRepository<Asteroid>(Asteroid)
        const savedAsteroid = await repository.save(this)
        console.info(`Asteroid id ${savedAsteroid.id} saved to database`)
        return savedAsteroid
    }
}
