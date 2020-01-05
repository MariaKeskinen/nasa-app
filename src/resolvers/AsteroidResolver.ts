import { Args, ArgsType, Field, FieldResolver, Int, Resolver, Root } from 'type-graphql'
import { Service } from 'typedi'
import { Asteroid } from '@/entities/Asteroid'
import { Diameter } from '@/entities/Diameter'
import { UNIT } from '@/helpers/enums'
import { Min } from 'class-validator'

@ArgsType()
export class DiameterArgs {
    @Field(type => UNIT, { defaultValue: UNIT.KM })
    unit: UNIT

    @Field(type => Int, { defaultValue: 3, nullable: true })
    @Min(0)
    round: number | null
}

@Service()
@Resolver(Asteroid)
export class AsteroidResolver {
    @FieldResolver()
    estimatedDiameter(@Root() asteroid: Asteroid, @Args() { unit, round }: DiameterArgs): Diameter {
        return new Diameter(
            asteroid.estimatedDiameterMin,
            asteroid.estimatedDiameterMax,
            unit,
            round
        )
    }
}
