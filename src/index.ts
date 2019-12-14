import 'reflect-metadata'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import { createSchema } from '@/schema'

const schema = createSchema()
const app = express()

app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true,
        pretty: true
    })
)

app.listen(4000)
console.log('Running in port 4000')
