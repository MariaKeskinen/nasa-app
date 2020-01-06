import { Container, Service } from 'typedi'
import { Asteroid } from '@/entities/Asteroid'
import { format, getMonth, getYear, subYears } from 'date-fns'
import { getNextMonthWithYear } from '@/helpers/date-helpers'
import { AsteroidService } from '@/services/AsteroidService'
import { MonthYearArgs } from '@/resolvers/QueryArguments'
import { AsteroidMonth } from '@/entities/AsteroidMonth'
import { CloseApproachData } from '@/entities/CloseApproachData'
import { AsteroidsByMonthLoaderKey } from '@/graphql/dataloaders'

@Service()
export class AsteroidMonthService {
    public static async getAsteroidsByMonthBatch(
        keys: AsteroidsByMonthLoaderKey[]
    ): Promise<Asteroid[][]> {
        return AsteroidMonthService.getAsteroidDataByMonthBatch<Asteroid>('asteroid', keys)
    }

    public static async getAsteroidApproachDataByMonthBatch(
        keys: AsteroidsByMonthLoaderKey[]
    ): Promise<CloseApproachData[][]> {
        return AsteroidMonthService.getAsteroidDataByMonthBatch<CloseApproachData>(
            'closeApproachData',
            keys
        )
    }

    public getGroupsByMonth(start: MonthYearArgs, end: MonthYearArgs): AsteroidMonth[] {
        // By default, get results of last year
        const startDate = start ? new Date(start.year, start.month - 1, 1) : subYears(new Date(), 1)
        const endDate = end ? new Date(end.year, end.month - 1, 1) : new Date()

        const groups: AsteroidMonth[] = []

        const lastMonth = getMonth(endDate)
        const lastYear = getYear(endDate)

        let monthAndYear = {
            month: getMonth(startDate),
            year: getYear(startDate)
        }

        do {
            groups.push(new AsteroidMonth(monthAndYear.month, monthAndYear.year))
            monthAndYear = getNextMonthWithYear(monthAndYear)
        } while (
            monthAndYear.year < lastYear ||
            (monthAndYear.year === lastYear && monthAndYear.month <= lastMonth)
        )

        return groups
    }

    private static async getAsteroidDataByMonthBatch<T extends Asteroid | CloseApproachData>(
        type: 'asteroid' | 'closeApproachData',
        keys: AsteroidsByMonthLoaderKey[]
    ): Promise<T[][]> {
        const asteroidService = Container.get(AsteroidService)

        const filter = {
            startDate: format(new Date(keys[0].year, keys[0].month), 'yyyy-MM-dd'),
            endDate: format(
                new Date(keys[keys.length - 1].year, keys[keys.length - 1].month),
                'yyyy-MM-dd'
            )
        }

        let data: T[]

        if (type === 'asteroid') {
            data = (await asteroidService.getAsteroids(
                filter,
                keys[0].sort,
                keys[0].sortDirection
            )) as T[]
        } else {
            data = (await asteroidService.getCloseApproachData(
                filter,
                keys[0].sort,
                keys[0].sortDirection
            )) as T[]
        }

        return keys.reduce<T[][]>((arr, key) => {
            arr.push(
                AsteroidMonthService.getAsteroidsOfSelectedMonth<T>(
                    data,
                    keys[0].month,
                    keys[0].year,
                    keys[0].limit
                )
            )
            return arr
        }, [])
    }

    private static getAsteroidsOfSelectedMonth<T extends Asteroid | CloseApproachData>(
        data: T[],
        month: number,
        year: number,
        limit?: number
    ): T[] {
        const currentMonthData: T[] = []
        for (let i = 0; i < data.length; i++) {
            if (AsteroidMonthService.approachedInSelectedMonth(data[i], month, year)) {
                currentMonthData.push(data[i])
            }

            if (limit && currentMonthData.length === limit) break
        }

        return currentMonthData
    }

    private static approachedInSelectedMonth(
        data: Asteroid | CloseApproachData,
        month: number,
        year: number
    ): boolean {
        if (data instanceof Asteroid) {
            return !!data.closeApproachData?.find(
                cad => getMonth(cad.epochDate) === month && getYear(cad.epochDate) === year
            )
        }

        return getMonth(data.epochDate) === month && getYear(data.epochDate) === year
    }
}
