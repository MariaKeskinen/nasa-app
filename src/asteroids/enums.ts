import { registerEnumType } from 'type-graphql'

export enum UNIT {
    KM = 'kilometers',
    M = 'meters',
    MI = 'miles',
    FT = 'feet'
}

registerEnumType(UNIT, {
    name: 'DiameterUnit'
})

export enum VELOCITY_UNIT {
    KM_S = 'kilometers_per_second',
    KM_H = 'kilometers_per_hour',
    MI_H = 'miles_per_hour'
}

registerEnumType(VELOCITY_UNIT, {
    name: 'VelocityUnit'
})

export enum LONG_DISTANCE_UNIT {
    ASTRONOMICAL = 'astronomical',
    LUNAR = 'lunar',
    KM = 'kilometers',
    MI = 'miles'
}

registerEnumType(LONG_DISTANCE_UNIT, {
    name: 'LongDistanceUnit'
})

export enum SortBy {
    diameter,
    distance,
    date
}

registerEnumType(SortBy, {
    name: 'SortBy'
})

export enum SortDirection {
    desc = 'DESC',
    asc = 'ASC'
}

registerEnumType(SortDirection, {
    name: 'SortDirection'
})

export enum Month {
    jan = 1,
    feb,
    mar,
    apr,
    may,
    jun,
    jul,
    aug,
    sep,
    oct,
    nov,
    dec
}

registerEnumType(Month, {
    name: 'Month'
})
