import 'reflect-metadata'
import { format } from 'date-fns'
import { connection } from '@/database'
import { AsteroidNeoWsService } from '@/nasa-api/AsteroidNeoWsService'
import { NasaApiService } from '@/nasa-api/NasaApiService'
import '@/container'

require('dotenv').config()

async function fetchNeoFeed() {
    const asteroidNeoWsService = new AsteroidNeoWsService(new NasaApiService())

    const start = process.argv[2] || format(new Date(), 'yyyy-MM-dd')
    const end = process.argv[3] || format(new Date(), 'yyyy-MM-dd')

    console.info(`Importing asteroids from ${start} to ${end}`)

    try {
        await asteroidNeoWsService.fetchAsteroidFeed(start, end)

        process.exit(0)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

connection.then(() => fetchNeoFeed())
