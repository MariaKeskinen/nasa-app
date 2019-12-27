import 'reflect-metadata'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import { createSchema } from '@/schema'

require('dotenv').config()
import '@/container'
import { connection } from '@/database'

const app = express()

const schema = createSchema()

const isProduction = process.env.NODE_ENV !== 'production'

app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: !isProduction,
        pretty: !isProduction
    })
)

connection.then(() => {
    app.listen(4000)
    console.log('Running in port 4000')
})
