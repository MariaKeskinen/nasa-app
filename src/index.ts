import 'reflect-metadata'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import bodyParser from 'body-parser'
import { createSchema } from '@/schema'
import '@/container'
import { connection } from '@/database'
import { dataLoaders } from '@/graphql/dataloaders'

require('dotenv').config()

const app = express()

const isDevelopment = process.env.NODE_ENV === 'DEVELOPMENT'

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

connection.then(() => {
    const schema = createSchema()
    app.use(
        '/graphql',
        graphqlHTTP({
            schema,
            graphiql: isDevelopment,
            pretty: isDevelopment,
            context: {
                loaders: dataLoaders
            }
        })
    )

    app.listen(4000)
    console.log('Running in port 4000')
})
