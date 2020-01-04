import 'reflect-metadata'
import '@/container'
import { connection } from '@/database'
import { AsteroidNeoWsService } from '@/nasa-api/AsteroidNeoWsService'
import { NasaApiService } from '@/nasa-api/NasaApiService'

require('dotenv').config()

async function fetchNeoFeed() {
    if (process.argv.length < 2) {
        console.error('Start and end date are required arguments')
        process.exit(1)
    }

    const asteroidNeoWsService = new AsteroidNeoWsService(new NasaApiService())

    const start = process.argv[2]
    const end = process.argv[3]

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
