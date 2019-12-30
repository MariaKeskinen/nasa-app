import { Service } from 'typedi'
import { ApiService } from '@/nasa-api/ApiService'
import { Asteroid } from '@/asteroids/Asteroid'
import { addDays, format, isAfter, isBefore } from 'date-fns'
import * as error from 'http-errors'

type DatePeriod = { start: Date; end: Date }

@Service()
export class AsteroidNeoWsService {
    constructor(private readonly apiService: ApiService) {}

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
                const asteroids = this.parseDailyAsteroidData(response)
                await this.saveAsteroids(asteroids)

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

    private parseDailyAsteroidData(apiResponse: Record<string, any>): Asteroid[] {
        const dailyAsteroidData = apiResponse?.near_earth_objects || []

        return Object.values(dailyAsteroidData).reduce<Asteroid[]>(
            (asteroidsArr: Asteroid[], data: any[]) => {
                const asteroids = data.map(data => Asteroid.fromApiData(data))
                return [...asteroidsArr, ...asteroids]
            },
            []
        )
    }

    private async saveAsteroids(asteroids: Asteroid[]): Promise<Asteroid[]> {
        return Promise.all(asteroids.map(asteroid => asteroid.save()))
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
