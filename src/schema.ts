import { buildSchemaSync } from 'type-graphql'
import { AsteroidResolver } from '@/asteroids/AsteroidResolver'
import { GraphQLSchema } from 'graphql'

export function createSchema(): GraphQLSchema {
    return buildSchemaSync({
        resolvers: [AsteroidResolver]
    })
}
