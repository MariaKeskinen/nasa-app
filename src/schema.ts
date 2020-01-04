import { buildSchemaSync } from 'type-graphql'
import { AsteroidResolver } from '@/asteroids/AsteroidResolver'
import { GraphQLSchema } from 'graphql'
import { CloseApproachDataResolver } from '@/asteroids/CloseApproachDataResolver'
import { AsteroidGroupResolver } from '@/asteroidGroups/AsteroidGroupResolver'

export function createSchema(): GraphQLSchema {
    return buildSchemaSync({
        resolvers: [CloseApproachDataResolver, AsteroidResolver, AsteroidGroupResolver]
    })
}
