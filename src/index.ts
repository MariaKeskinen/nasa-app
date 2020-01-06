import 'reflect-metadata'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import bodyParser from 'body-parser'

import '@/container'
import { createSchema } from '@/schema'
import { connection } from '@/database'
import { dataLoaders } from '@/graphql/dataloaders'

require('dotenv').config()

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

connection.then(() => {
    const schema = createSchema()
    app.use(
        '/graphql',
        graphqlHTTP({
            schema,
            graphiql: true, // In real production mode, should consider graphql should not be visible
            pretty: true, // In real production mode, usually no need to pretty print
            context: {
                loaders: dataLoaders
            }
        })
    )

    app.listen(4000)
    console.log('Running in port 4000')
})
