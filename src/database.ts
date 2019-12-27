import { createConnection } from 'typeorm'
import { Asteroid } from '@/asteroids/Asteroid'
import { CloseApproachData } from '@/asteroids/CloseApproachData'

export const connection = createConnection({
    type: 'sqlite',
    database: './db.sql',
    synchronize: true,
    logging: false,
    entities: [Asteroid, CloseApproachData]
})
    .then(() => {
        console.log('Database connection created')
    })
    .catch(err => {
        console.log('err', err)
        console.log('Cannot connect to database')
    })
