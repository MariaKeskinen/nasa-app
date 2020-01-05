import { AsteroidService } from '@/services/AsteroidService'
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito'
import { Asteroid } from '@/entities/Asteroid'
import { AsteroidMocker } from '@/test-helpers/AsteroidMocker'
import { SortBy, SortDirection } from '@/helpers/enums'
import { AsteroidMonthService } from '@/services/AsteroidMonthService'
import { AsteroidMonth } from '@/entities/AsteroidMonth'

describe('AsteroidMonthService', () => {
    let asteroidServiceMock: AsteroidService
    let asteroidMonthService: AsteroidMonthService
    let mockedAsteroids: Asteroid[]

    beforeEach(() => {
        asteroidServiceMock = mock(AsteroidService)
        asteroidMonthService = new AsteroidMonthService(instance(asteroidServiceMock))
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

            await asteroidMonthService.getAsteroidsByMonth(
                month,
                year,
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
            const expectedResult = [new AsteroidMonth(11, 2019)]

            expect(
                asteroidMonthService.getGroupsByMonth(
                    { month: 12, year: 2019 },
                    { month: 12, year: 2019 }
                )
            ).toEqual(expectedResult)
        })

        it('Should get groups for multiple months', () => {
            const expectedResult = [
                new AsteroidMonth(11, 2019),
                new AsteroidMonth(0, 2020),
                new AsteroidMonth(1, 2020),
                new AsteroidMonth(2, 2020)
            ]

            expect(
                asteroidMonthService.getGroupsByMonth(
                    { month: 12, year: 2019 },
                    { month: 3, year: 2020 }
                )
            ).toEqual(expectedResult)
        })

        it('Should get groups for last year, if no filter given', () => {
            const currentMonth = new Date().getMonth()
            const currentYear = new Date().getFullYear()

            const result = asteroidMonthService.getGroupsByMonth(null, null)

            expect(result[0]).toEqual(new AsteroidMonth(currentMonth, currentYear - 1))
            expect(result[12]).toEqual(new AsteroidMonth(currentMonth, currentYear))
        })
    })
})
