import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'
import { isBefore, isSameDay, set } from 'date-fns'
import { parseComparableDate } from '@/graphql/validators/validator-args-parsers'

/**
 * Validates, that given date is before than date to compared
 * Date to compared can be given as javascript Date or string, that refers to other field of same object
 * Usage:
 *  @IsBefore(new Date())
 *  @IsBefore('startDate')
 */
export function IsSameOrBeforeDay(property: Date | string, validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsSameOrBeforeDay',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const compareToDate = parseComparableDate(args)
                    if (!compareToDate) return true

                    const date = set(new Date(value), {
                        hours: 0,
                        minutes: 0,
                        seconds: 0,
                        milliseconds: 0
                    })

                    return isBefore(date, compareToDate) || isSameDay(date, compareToDate)
                }
            }
        })
    }
}
