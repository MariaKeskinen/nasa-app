import { buildSchemaSync } from 'type-graphql'
import { NeoResolver } from './asteroids-neo/NeoResolver'
import { GraphQLSchema } from 'graphql'

export function createSchema(): GraphQLSchema {
    return buildSchemaSync({
        resolvers: [NeoResolver]
    })
}
