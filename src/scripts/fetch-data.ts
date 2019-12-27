import 'reflect-metadata'
import { AsteroidService } from '@/asteroids-neo/AsteroidService'
import { ApiService } from '@/nasa-api/ApiService'

require('dotenv').config()
import '@/container'
import { connection } from '@/database'

async function fetchNeoFeed() {
    if (process.argv.length < 2) {
        console.error('Start and end date are required arguments')
        process.exit(1)
    }

    const asteroidService = new AsteroidService(new ApiService())

    const start = process.argv[2]
    const end = process.argv[3]

    console.info(`Importing asteroids from ${start} to ${end}`)

    try {
        const asteroids = await asteroidService.fetchAsteroidFeed(start, end)

        console.info(`Imported ${asteroids.length} asteroids`)

        process.exit(0)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

connection.then(() => fetchNeoFeed())
