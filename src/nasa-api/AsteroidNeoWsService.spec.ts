import { Repository } from 'typeorm'
import * as error from 'http-errors'
import { anything, instance, mock, verify, when } from 'ts-mockito'
import { Asteroid } from '@/entities/Asteroid'
import * as mockResponse from '@/test-helpers/nasa-neo-feed-mock-response.json'
import { AsteroidMocker } from '@/test-helpers/AsteroidMocker'
import { NasaApiService } from '@/nasa-api/NasaApiService'
import { CloseApproachData } from '@/entities/CloseApproachData'
import { AsteroidNeoWsService } from '@/nasa-api/AsteroidNeoWsService'

describe('AsteroidNeoWsService', () => {
    const mockResponseAsteroidsCount = 9

    let apiServiceMock: NasaApiService
    let asteroidRepositoryMock: Repository<Asteroid>
    let cadRepositoryMock: Repository<CloseApproachData>
    let asteroidNeoWsService: AsteroidNeoWsService
    let asteroid: Asteroid

    beforeEach(() => {
        apiServiceMock = mock(NasaApiService)
        asteroidRepositoryMock = mock(Repository)
        cadRepositoryMock = mock(Repository)

        asteroidNeoWsService = new AsteroidNeoWsService(
            instance(apiServiceMock),
            instance(asteroidRepositoryMock),
            instance(cadRepositoryMock)
        )

        asteroid = AsteroidMocker.mockAsteroid()

        when(apiServiceMock.getNeoFeed(anything(), anything())).thenResolve(mockResponse)
    })

    it('Should get array of asteroids for short period', async () => {
        const start = '2015-09-07'
        const end = '2015-09-08'

        await asteroidNeoWsService.fetchAsteroidFeed(start, end)

        verify(apiServiceMock.getNeoFeed(start, end)).once()
        verify(asteroidRepositoryMock.save(anything())).times(9)
    })

    it('Should get array of asteroids for longer period', async () => {
        await asteroidNeoWsService.fetchAsteroidFeed('2015-09-07', '2015-10-01')

        verify(apiServiceMock.getNeoFeed('2015-09-07', '2015-09-14')).once()
        verify(apiServiceMock.getNeoFeed('2015-09-15', '2015-09-22')).once()
        verify(apiServiceMock.getNeoFeed('2015-09-23', '2015-09-30')).once()
        verify(apiServiceMock.getNeoFeed('2015-10-01', '2015-10-01')).once()
        verify(apiServiceMock.getNeoFeed(anything(), anything())).times(4)
        verify(asteroidRepositoryMock.save(anything())).times(mockResponseAsteroidsCount * 4)
    })

    it('Should set periods properly when there is only one full period', async () => {
        await asteroidNeoWsService.fetchAsteroidFeed('2015-09-07', '2015-09-14')

        verify(apiServiceMock.getNeoFeed('2015-09-07', '2015-09-14')).once()
        verify(apiServiceMock.getNeoFeed(anything(), anything())).times(1)
    })

    it('Should set periods properly when last period is not full', async () => {
        await asteroidNeoWsService.fetchAsteroidFeed('2015-09-07', '2015-09-15')

        verify(apiServiceMock.getNeoFeed('2015-09-07', '2015-09-14')).once()
        verify(apiServiceMock.getNeoFeed('2015-09-15', '2015-09-15')).once()
        verify(apiServiceMock.getNeoFeed(anything(), anything())).times(2)
    })

    it('Should set periods when start date is same as end date', async () => {
        await asteroidNeoWsService.fetchAsteroidFeed('2015-09-07', '2015-09-07')

        verify(apiServiceMock.getNeoFeed('2015-09-07', '2015-09-07')).once()
        verify(apiServiceMock.getNeoFeed(anything(), anything())).times(1)
    })

    it('should throw an error if start date is after end date', async () => {
        await expect(
            asteroidNeoWsService.fetchAsteroidFeed('2015-09-08', '2015-09-07')
        ).rejects.toThrowError(new error.BadRequest('Start date must be same or after end date'))
    })

    it('should throw an error if start date is before 2010-01-01', async () => {
        await expect(
            asteroidNeoWsService.fetchAsteroidFeed('2009-12-30', '2015-09-07')
        ).rejects.toThrowError(new error.BadRequest('Start date must be at least 2010-01-01'))
    })
})
