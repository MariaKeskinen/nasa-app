import 'reflect-metadata'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import { createConnection } from 'typeorm'
import { createSchema } from '@/schema'

require('dotenv').config()
import '@/container'
import { Asteroid } from '@/asteroids-neo/Asteroid'
import { CloseApproachData } from '@/asteroids-neo/CloseApproachData'

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

createConnection({
    type: 'sqlite',
    database: './db.sql',
    synchronize: true,
    logging: false,
    entities: [Asteroid, CloseApproachData]
})
    .then(() => {
        console.log('Database connection created')

        app.listen(4000)
        console.log('Running in port 4000')
    })
    .catch(err => {
        console.log('err', err)
        console.log('Cannot connect to database')
    })
