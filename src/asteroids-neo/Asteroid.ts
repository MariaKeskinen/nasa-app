import { Arg, Field, Float, ObjectType } from 'type-graphql'
import { Diameter } from '@/asteroids-neo/Diameter'
import { UNIT } from '@/asteroids-neo/enums'
import { CloseApproachData } from '@/asteroids-neo/CloseApproachData'

@ObjectType()
export class Asteroid {
    @Field(type => String)
    id: string

    @Field(type => String)
    neoReferenceId: string

    @Field(type => String)
    name: string

    @Field(type => String)
    nasaJplUrl: string

    @Field(type => Float)
    absoluteMagnitudeH: number

    @Field(type => Boolean)
    isPotentiallyHazardous: boolean

    @Field(type => Diameter)
    estimatedDiameter(
        @Arg('unit', returns => UNIT, { defaultValue: UNIT.KM }) unit: UNIT
    ): Diameter {
        const values = {
            min: this.estimatedDiameterData?.[unit]?.estimated_diameter_min,
            max: this.estimatedDiameterData?.[unit]?.estimated_diameter_max
        }
        return new Diameter(values)
    }

    @Field(type => [CloseApproachData])
    closeApproachData: CloseApproachData[]

    private estimatedDiameterData: Record<string, any>

    public static fromApiData(data: Record<string, any>): Asteroid {
        const asteroid = new Asteroid()

        asteroid.id = data.id
        asteroid.neoReferenceId = data.neo_reference_id
        asteroid.name = data.name
        asteroid.nasaJplUrl = data.nasa_jpl_url
        asteroid.absoluteMagnitudeH = data.absolute_magnitude_h
        asteroid.estimatedDiameterData = data.estimated_diameter || {}
        asteroid.isPotentiallyHazardous = data.is_potentially_hazardous_asteroid
        asteroid.closeApproachData = data.close_approach_data.map(
            (d: Record<string, any>) => new CloseApproachData(d)
        )

        return asteroid
    }
}
