import { ApiService } from '@/nasa-api/ApiService'
import { Repository } from 'typeorm'
import { Asteroid } from '@/asteroids/Asteroid'
import { anything, instance, mock, verify, when } from 'ts-mockito'
import { AsteroidService } from '@/asteroids/AsteroidService'
import * as mockResponse from '@/test-helpers/nasa-neo-feed-mock-response.json'
import { AsteroidMocker } from '@/asteroids/mockers/AsteroidMocker'
import * as error from 'http-errors'

describe('AsteroidService', () => {
    const mockResponseAsteroidsCount = 9

    let apiServiceMock: ApiService
    let repositoryMock: Repository<Asteroid>
    let asteroidService: AsteroidService
    let asteroid: Asteroid

    beforeEach(() => {
        apiServiceMock = mock(ApiService)
        repositoryMock = mock(Repository)

        asteroidService = new AsteroidService(instance(apiServiceMock), instance(repositoryMock))

        asteroid = AsteroidMocker.mockAsteroid()

        when(apiServiceMock.getNeoFeed(anything(), anything())).thenResolve(mockResponse)
    })

    it('Should get array of asteroids for short period', async () => {
        const start = '2015-09-07'
        const end = '2015-09-08'

        const asteroids = await asteroidService.fetchAsteroidFeed(start, end)

        verify(apiServiceMock.getNeoFeed(start, end)).once()
        verify(repositoryMock.save(anything())).times(9)

        expect(asteroids).toHaveLength(mockResponseAsteroidsCount)
        expect(asteroids[0]).toBeInstanceOf(Asteroid)
    })

    it('Should get array of asteroids for longer period', async () => {
        const asteroids = await asteroidService.fetchAsteroidFeed('2015-09-07', '2015-10-01')

        verify(apiServiceMock.getNeoFeed('2015-09-07', '2015-09-14')).once()
        verify(apiServiceMock.getNeoFeed('2015-09-15', '2015-09-22')).once()
        verify(apiServiceMock.getNeoFeed('2015-09-23', '2015-09-30')).once()
        verify(apiServiceMock.getNeoFeed('2015-10-01', '2015-10-01')).once()
        verify(apiServiceMock.getNeoFeed(anything(), anything())).times(4)
        verify(repositoryMock.save(anything())).times(mockResponseAsteroidsCount * 4)

        expect(asteroids).toHaveLength(mockResponseAsteroidsCount * 4)
    })

    it('Should set periods properly when there is only one full period', async () => {
        await asteroidService.fetchAsteroidFeed('2015-09-07', '2015-09-14')

        verify(apiServiceMock.getNeoFeed('2015-09-07', '2015-09-14')).once()
        verify(apiServiceMock.getNeoFeed(anything(), anything())).times(1)
    })

    it('Should set periods properly when last period is not full', async () => {
        await asteroidService.fetchAsteroidFeed('2015-09-07', '2015-09-15')

        verify(apiServiceMock.getNeoFeed('2015-09-07', '2015-09-14')).once()
        verify(apiServiceMock.getNeoFeed('2015-09-15', '2015-09-15')).once()
        verify(apiServiceMock.getNeoFeed(anything(), anything())).times(2)
    })

    it('Should set periods when start date is same as end date', async () => {
        await asteroidService.fetchAsteroidFeed('2015-09-07', '2015-09-07')

        verify(apiServiceMock.getNeoFeed('2015-09-07', '2015-09-07')).once()
        verify(apiServiceMock.getNeoFeed(anything(), anything())).times(1)
    })

    it('should throw an error if start date is after end date', async () => {
        await expect(
            asteroidService.fetchAsteroidFeed('2015-09-08', '2015-09-07')
        ).rejects.toThrowError(new error.BadRequest('Start date must be same or after end date'))
    })

    it('should throw an error if start date is before 2010-01-01', async () => {
        await expect(
            asteroidService.fetchAsteroidFeed('2009-12-30', '2015-09-07')
        ).rejects.toThrowError(new error.BadRequest('Start date must be at least 2010-01-01'))
    })
})
