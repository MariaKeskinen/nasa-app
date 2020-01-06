import { buildSchemaSync } from 'type-graphql'
import { Container } from 'typedi'
import { GraphQLSchema } from 'graphql'
import {
    AsteroidMonthResolver,
    AsteroidResolver,
    CloseApproachDataResolver,
    QueryResolver
} from '@/resolvers'

export function createSchema(): GraphQLSchema {
    return buildSchemaSync({
        resolvers: [
            CloseApproachDataResolver,
            AsteroidResolver,
            AsteroidMonthResolver,
            QueryResolver
        ],
        container: Container
    })
}
