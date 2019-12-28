import { registerDecorator, ValidationOptions } from 'class-validator'
import { isValid } from 'date-fns'

/**
 * Validates, that given date is before than date to compared
 * Date to compared can be given as javascript Date or string, that refers to other field of same object
 * Usage:
 *  @IsBefore(new Date())
 *  @IsBefore('startDate')
 */
export function IsDateString(validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsDateString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any) {
                    return isValid(new Date(value))
                }
            }
        })
    }
}
