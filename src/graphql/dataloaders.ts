import Dataloader from 'dataloader'
import { AsteroidMonthService } from '@/services/AsteroidMonthService'
import { Asteroid } from '@/entities/Asteroid'
import { SortBy, SortDirection } from '@/helpers/enums'
import { CloseApproachData } from '@/entities/CloseApproachData'

export type AsteroidsByMonthLoaderKey = {
    month: number
    year: number
    sort: SortBy
    sortDirection: SortDirection
    limit?: number
}

export type DataLoaders = {
    asteroidsByMonthLoader: Dataloader<AsteroidsByMonthLoaderKey, Asteroid[]>
    asteroidApproachesByMonthLoader: Dataloader<AsteroidsByMonthLoaderKey, CloseApproachData[]>
}

export const dataLoaders: DataLoaders = {
    asteroidsByMonthLoader: new Dataloader<AsteroidsByMonthLoaderKey, Asteroid[], string>(
        AsteroidMonthService.getAsteroidsByMonthBatch,
        {
            cacheKeyFn: (key: AsteroidsByMonthLoaderKey) => JSON.stringify(key)
        }
    ),
    asteroidApproachesByMonthLoader: new Dataloader<
        AsteroidsByMonthLoaderKey,
        CloseApproachData[],
        string
    >(AsteroidMonthService.getAsteroidApproachDataByMonthBatch, {
        cacheKeyFn: (key: AsteroidsByMonthLoaderKey) => JSON.stringify(key)
    })
}
