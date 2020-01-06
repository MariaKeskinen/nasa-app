import { createConnection, useContainer } from 'typeorm'
import { Asteroid } from '@/entities/Asteroid'
import { CloseApproachData } from '@/entities/CloseApproachData'

import { Container } from 'typedi'

useContainer(Container)

export const connection = createConnection({
    type: 'sqlite',
    database: './db.sql',
    synchronize: true,
    logging: false,
    entities: [Asteroid, CloseApproachData]
})
    .then(c => {
        console.log('Database connection created')
    })
    .catch(err => {
        console.log('err', err)
        console.log('Cannot connect to database')
    })
