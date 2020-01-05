import { buildSchemaSync } from 'type-graphql'
import { AsteroidResolver } from '@/resolvers/AsteroidResolver'
import { GraphQLSchema } from 'graphql'
import { CloseApproachDataResolver } from '@/resolvers/CloseApproachDataResolver'
import { AsteroidGroupResolver } from '@/resolvers/AsteroidGroupResolver'
import { Container } from 'typedi'
import { QueryResolver } from '@/resolvers/QueryResolver'

export function createSchema(): GraphQLSchema {
    return buildSchemaSync({
        resolvers: [
            CloseApproachDataResolver,
            AsteroidResolver,
            AsteroidGroupResolver,
            QueryResolver
        ],
        container: Container
    })
}
