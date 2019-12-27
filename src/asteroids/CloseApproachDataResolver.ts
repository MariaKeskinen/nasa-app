import { Args, ArgsType, Field, FieldResolver, Int, Resolver, Root } from 'type-graphql'
import round from 'lodash.round'
import { Min } from 'class-validator'
import { CloseApproachData } from '@/asteroids/CloseApproachData'
import { LONG_DISTANCE_UNIT, VELOCITY_UNIT } from '@/asteroids/enums'

@ArgsType()
class RelativeVelocityArgs {
    @Field(type => VELOCITY_UNIT, { defaultValue: VELOCITY_UNIT.KM_H })
    unit: VELOCITY_UNIT

    @Field(type => Int, { defaultValue: 5, nullable: true })
    @Min(0)
    round: number | null
}

@ArgsType()
class MissDistanceArgs {
    @Field(type => LONG_DISTANCE_UNIT, { defaultValue: LONG_DISTANCE_UNIT.KM })
    unit: LONG_DISTANCE_UNIT

    @Field(type => Int, { defaultValue: 5, nullable: true })
    @Min(0)
    round: number | null
}

@Resolver(CloseApproachData)
export class CloseApproachDataResolver {
    @FieldResolver()
    relativeVelocity(
        @Root() root: CloseApproachData,
        @Args() relativeVelocityArgs: RelativeVelocityArgs
    ): number | null {
        if (!root.relativeVelocityKmPerH) return null

        const conversionRates: Record<string, number> = {
            [VELOCITY_UNIT.KM_H]: 1,
            [VELOCITY_UNIT.KM_S]: 0.0002777778,
            [VELOCITY_UNIT.MI_H]: 0.6213711922
        }

        return round(
            root.relativeVelocityKmPerH * conversionRates[relativeVelocityArgs.unit],
            relativeVelocityArgs.round
        )
    }

    @FieldResolver()
    missDistance(
        @Root() root: CloseApproachData,
        @Args() missDistanceArgs: MissDistanceArgs
    ): number | null {
        if (!root.missDistanceKm) return null

        const conversionRates: Record<string, number> = {
            [LONG_DISTANCE_UNIT.KM]: 1,
            [LONG_DISTANCE_UNIT.ASTRONOMICAL]: 6.684587124056e-9,
            [LONG_DISTANCE_UNIT.LUNAR]: 2.604166e-6,
            [LONG_DISTANCE_UNIT.MI]: 0.6213711922373
        }

        return round(
            root.missDistanceKm * conversionRates[missDistanceArgs.unit],
            missDistanceArgs.round
        )
    }
}
