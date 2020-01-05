import { buildSchemaSync } from 'type-graphql'
import { AsteroidResolver } from '@/resolvers/AsteroidResolver'
import { GraphQLSchema } from 'graphql'
import { CloseApproachDataResolver } from '@/resolvers/CloseApproachDataResolver'
import { AsteroidMonthResolver } from '@/resolvers/AsteroidMonthResolver'
import { Container } from 'typedi'
import { QueryResolver } from '@/resolvers/QueryResolver'

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
