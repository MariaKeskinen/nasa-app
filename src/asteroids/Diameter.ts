import { Field, Float, ObjectType } from 'type-graphql'
import { UNIT } from '@/asteroids/enums'

@ObjectType()
export class Diameter {
    @Field(type => Float, { nullable: true })
    min: number

    @Field(type => Float, { nullable: true })
    max: number

    @Field(type => Float, { nullable: true })
    avg(): number {
        return this.getRounded(this.getAverage(), this.round)
    }

    private readonly round: number | null
    private readonly unit: UNIT

    constructor(min: number, max: number, unit: UNIT, round: number | null) {
        this.min = this.getRounded(this.formatValue(min, unit), round)
        this.max = this.getRounded(this.formatValue(max, unit), round)
        this.unit = unit
        this.round = round
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

    private getRounded(value: number, round: number | null): number | null {
        if (!value) return null
        if (round === null || round === undefined) return value

        return parseFloat(value.toFixed(round))
    }
}
