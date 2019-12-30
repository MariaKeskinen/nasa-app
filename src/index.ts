import 'reflect-metadata'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import bodyParser from 'body-parser'
import { createSchema } from '@/schema'

require('dotenv').config()
import '@/container'
import { connection } from '@/database'
import { Request, Response } from 'express'

const app = express()

const schema = createSchema()

const isDevelopment = process.env.NODE_ENV === 'DEVELOPMENT'

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: isDevelopment,
        pretty: isDevelopment
    })
)

connection.then(() => {
    app.listen(4000)
    console.log('Running in port 4000')
})
