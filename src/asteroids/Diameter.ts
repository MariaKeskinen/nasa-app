import { Field, Float, ObjectType } from 'type-graphql'
import round from 'lodash.round'
import { UNIT } from '@/asteroids/enums'

@ObjectType()
export class Diameter {
    @Field(type => Float, { nullable: true })
    min: number

    @Field(type => Float, { nullable: true })
    max: number

    @Field(type => Float, { nullable: true })
    avg(): number {
        return round(this.getAverage(), this.round)
    }

    private readonly round: number | null
    private readonly unit: UNIT

    constructor(min: number, max: number, unit: UNIT, roundTo: number | null) {
        this.min = round(this.formatValue(min, unit), roundTo)
        this.max = round(this.formatValue(max, unit), roundTo)
        this.unit = unit
        this.round = roundTo
    }

    private formatValue(value: number, unit: UNIT): number | null {
        if (!value) return null

        const conversionRates: Record<string, number> = {
            [UNIT.M]: 1,
            [UNIT.KM]: 0.01,
            [UNIT.MI]: 0.00062137,
            [UNIT.FT]: 3.2808
        }

        return value * conversionRates[unit]
    }

    private getAverage(): number | null {
        if (!this.min || !this.max) return null

        return (this.min + this.max) / 2
    }
}
