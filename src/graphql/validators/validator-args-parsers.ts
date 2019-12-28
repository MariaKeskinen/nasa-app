import { ValidationArguments } from 'class-validator'
import { set } from 'date-fns'

export const parseComparableDate = (args: ValidationArguments): Date | null => {
    const arg = args?.constraints?.[0]
    if (!arg) return null

    if (arg instanceof Date) {
        return set(arg, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    } else if (typeof arg === 'string') {
        const relatedValue = (args.object as any)[arg]
        if (!relatedValue) return null

        return set(new Date(relatedValue), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    }

    return null
}
