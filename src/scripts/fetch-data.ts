import 'reflect-metadata'
import { ApiService } from '@/nasa-api/ApiService'

require('dotenv').config()
import '@/container'
import { connection } from '@/database'
import { AsteroidNeoWsService } from '@/nasa-api/AsteroidNeoWsService'

async function fetchNeoFeed() {
    if (process.argv.length < 2) {
        console.error('Start and end date are required arguments')
        process.exit(1)
    }

    const asteroidNeoWsService = new AsteroidNeoWsService(new ApiService())

    const start = process.argv[2]
    const end = process.argv[3]

    console.info(`Importing asteroids from ${start} to ${end}`)

    try {
        const asteroids = await asteroidNeoWsService.fetchAsteroidFeed(start, end)

        console.info(`Imported ${asteroids.length} asteroids`)

        process.exit(0)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

connection.then(() => fetchNeoFeed())