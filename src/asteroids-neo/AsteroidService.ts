import { Service } from 'typedi'
import { addDays, isAfter, format, isBefore } from 'date-fns'
import { ApiService } from '@/nasa-api/ApiService'
import { Asteroid } from '@/asteroids-neo/Asteroid'
import { getRepository, Repository } from 'typeorm'
import * as error from 'http-errors'

type DatePeriod = { start: Date; end: Date }

@Service()
export class AsteroidService {
    constructor(
        private readonly apiService: ApiService,
        private readonly repository?: Repository<Asteroid>
    ) {
        this.repository = repository || getRepository(Asteroid)
    }

    public async fetchAsteroidFeed(startDate: string, endDate: string): Promise<Asteroid[]> {
        const start = new Date(startDate)
        const end = new Date(endDate)

        if (isBefore(start, new Date('2010-01-01'))) {
            throw new error.BadRequest('Start date must be at least 2010-01-01')
        }

        if (isAfter(start, end)) {
            throw new error.BadRequest('Start date must be same or after end date')
        }

        const periods = this.getDatePeriods(start, end)

        const apiRequests = periods.map(period =>
            this.apiService.getNeoFeed(
                format(period.start, 'yyyy-MM-dd'),
                format(period.end, 'yyyy-MM-dd')
            )
        )

        const responses = await Promise.all(apiRequests)

        const parsedAsteroids = this.parseApiResponses(responses)

        await this.saveAsteroids(parsedAsteroids)

        return parsedAsteroids
    }

    private parseApiResponses(apiResponses: Record<string, any>[]): Asteroid[] {
        return apiResponses.reduce<Asteroid[]>((asteroidArr, apiResponse) => {
            const dailyAsteroidData = apiResponse?.near_earth_objects || []
            const dailyAsteroids = this.parseDailyAsteroidData(dailyAsteroidData)
            return [...asteroidArr, ...dailyAsteroids]
        }, [])
    }

    private parseDailyAsteroidData(dailyAsteroidData: any[]): Asteroid[] {
        if (!dailyAsteroidData) return []

        return Object.values(dailyAsteroidData).reduce<Asteroid[]>(
            (asteroidsArr: Asteroid[], data: any[]) => {
                const asteroids = data.map(data => Asteroid.fromApiData(data))
                return [...asteroidsArr, ...asteroids]
            },
            []
        )
    }

    private async saveAsteroids(asteroids: Asteroid[]): Promise<Asteroid[]> {
        return Promise.all(asteroids.map(asteroid => this.repository.save(asteroid)))
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
