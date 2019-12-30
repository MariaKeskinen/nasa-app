import { Service } from 'typedi'
import { ApiService } from '@/nasa-api/ApiService'
import { Asteroid } from '@/asteroids/Asteroid'
import { addDays, format, isAfter, isBefore } from 'date-fns'
import * as error from 'http-errors'
import { getRepository, Repository } from 'typeorm'
import { CloseApproachData } from '@/asteroids/CloseApproachData'

type DatePeriod = { start: Date; end: Date }

@Service()
export class AsteroidNeoWsService {
    constructor(
        private readonly apiService: ApiService,
        private readonly asteroidRepository?: Repository<Asteroid>,
        private readonly cadRepository?: Repository<CloseApproachData>
    ) {
        this.asteroidRepository = asteroidRepository || getRepository(Asteroid)
        this.cadRepository = cadRepository || getRepository(CloseApproachData)
    }

    public async fetchAsteroidFeed(startDate: string, endDate: string): Promise<void> {
        const start = new Date(startDate)
        const end = new Date(endDate)

        if (isBefore(start, new Date('2010-01-01'))) {
            throw new error.BadRequest('Start date must be at least 2010-01-01')
        }

        if (isAfter(start, end)) {
            throw new error.BadRequest('Start date must be same or after end date')
        }

        let asteroidsCount = 0
        const periods = this.getDatePeriods(start, end)

        // Requests should be made on one by one, because simultaneous requests exceeds the api limits
        for (let period of periods) {
            try {
                const response = await this.apiService.getNeoFeed(
                    format(period.start, 'yyyy-MM-dd'),
                    format(period.end, 'yyyy-MM-dd')
                )
                const asteroids = await Promise.all(this.parseDailyAsteroidData(response))

                console.info(
                    `Asteroids, ${asteroids.length} pcs, from ${period.start} to ${period.end} fetched and saved.`
                )
                asteroidsCount = asteroidsCount + asteroids.length
            } catch (err) {
                console.error(err)
                break
            }
        }

        console.info(`Imported ${asteroidsCount} asteroids.`)
    }

    private parseDailyAsteroidData(apiResponse: Record<string, any>): Promise<Asteroid>[] {
        const dailyAsteroidData: Record<string, any>[] = apiResponse?.near_earth_objects || []

        return Object.values(dailyAsteroidData).reduce<Promise<Asteroid>[]>(
            (asteroidsArr, data) => {
                const asteroids = data.map((data: any) => this.updateOrCreateAsteroid(data))
                return [...asteroidsArr, ...asteroids]
            },
            []
        )
    }

    private async updateOrCreateAsteroid(data: Record<string, any>): Promise<Asteroid> {
        const existingAsteroid = await this.asteroidRepository.findOne({ nasaId: data.id })

        if (existingAsteroid) {
            const cadData = data?.close_approach_data || []
            await Promise.all(
                cadData.map(async (d: any) => {
                    const cad = CloseApproachData.fromApiData(d)
                    cad.asteroid = existingAsteroid
                    return cad.save()
                })
            )
            return existingAsteroid
        }

        const newAsteroid = Asteroid.fromApiData(data)
        return newAsteroid.save()
    }

    private getDatePeriods(start: Date, end: Date, periods: DatePeriod[] = []): DatePeriod[] {
        if (isAfter(start, end)) {
            return periods
        }

        const plusSevenDays = addDays(start, 7)
        if (isAfter(plusSevenDays, end)) {
            periods.push({ start, end })

            return periods
        }

        periods.push({ start, end: plusSevenDays })

        return this.getDatePeriods(addDays(plusSevenDays, 1), end, periods)
    }
}
