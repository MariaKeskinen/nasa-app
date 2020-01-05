import { AsteroidService } from '@/asteroids/AsteroidService'
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito'
import { AsteroidGroupService } from '@/asteroidGroups/AsteroidGroupService'
import { Asteroid } from '@/asteroids/Asteroid'
import { AsteroidMocker } from '@/asteroids/mockers/AsteroidMocker'
import { SortBy, SortDirection } from '@/helpers/enums'
import { AsteroidGroupMonth } from '@/asteroidGroups/AsteroidGroup'

describe('AsteroidGroupService', () => {
    let asteroidServiceMock: AsteroidService
    let asteroidGroupService: AsteroidGroupService
    let mockedAsteroids: Asteroid[]

    beforeEach(() => {
        asteroidServiceMock = mock(AsteroidService)
        asteroidGroupService = new AsteroidGroupService(instance(asteroidServiceMock))
    })

    describe('getAsteroidsByMonth', () => {
        beforeEach(() => {
            mockedAsteroids = AsteroidMocker.mockAsteroids()
            when(
                asteroidServiceMock.getAsteroids(anything(), anything(), anything(), anything())
            ).thenResolve(mockedAsteroids)
        })

        it('Should get asteroids for given month', async () => {
            const month = 0
            const year = 2020

            await asteroidGroupService.getAsteroidsByMonth(
                month,
                year,
                {},
                SortBy.date,
                SortDirection.desc,
                10
            )

            verify(
                asteroidServiceMock.getAsteroids(
                    deepEqual({ startDate: '2020-01-01', endDate: '2020-01-31' }),
                    SortBy.date,
                    SortDirection.desc,
                    10
                )
            ).called()
        })
    })

    describe('getGroupsByMonth', () => {
        it('Should get groups for one month', () => {
            const filter = {
                startDate: '12-2019',
                endDate: '12-2019'
            }

            const expectedResult = [new AsteroidGroupMonth(11, 2019)]

            expect(asteroidGroupService.getGroupsByMonth(filter)).toEqual(expectedResult)
        })

        it('Should get groups for multiple months', () => {
            const filter = {
                startDate: '12-2019',
                endDate: '03-2020'
            }

            const expectedResult = [
                new AsteroidGroupMonth(11, 2019),
                new AsteroidGroupMonth(0, 2020),
                new AsteroidGroupMonth(1, 2020),
                new AsteroidGroupMonth(2, 2020)
            ]

            expect(asteroidGroupService.getGroupsByMonth(filter)).toEqual(expectedResult)
        })

        it('Should get groups for last year, if no filter given', () => {
            const currentMonth = new Date().getMonth()
            const currentYear = new Date().getFullYear()

            const result = asteroidGroupService.getGroupsByMonth({ startDate: null, endDate: null })

            expect(result[0]).toEqual(new AsteroidGroupMonth(currentMonth, currentYear - 1))
            expect(result[12]).toEqual(new AsteroidGroupMonth(currentMonth, currentYear))
        })
    })
})
