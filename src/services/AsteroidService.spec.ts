// import { Repository } from 'typeorm'
// import { Asteroid } from '@/asteroids/Asteroid'
// import { instance, mock, verify, when } from 'ts-mockito'
// import { AsteroidService } from '@/asteroids/AsteroidService'
// import { AsteroidMocker } from '@/asteroids/mockers/AsteroidMocker'
// import { format } from 'date-fns'
// import { SortBy, SortDirection } from '@/helpers/enums'
//
// describe('AsteroidService', () => {
//     const mockResponseAsteroidsCount = 9
//
//     let repositoryMock: Repository<Asteroid>
//     let asteroidService: AsteroidService
//     let asteroids: Asteroid[]
//
//     beforeEach(() => {
//         repositoryMock = mock(Repository)
//
//         asteroidService = new AsteroidService(instance(repositoryMock))
//
//         asteroids = [AsteroidMocker.mockAsteroid()]
//     })
//
//     it('Should get asteroids', async () => {
//         const startDate = new Date(2020, 1, 1)
//         const endDate = new Date(2020, 1, 2)
//
//         const asteroidQuery = repositoryMock
//             .createQueryBuilder('asteroid')
//             .innerJoinAndSelect('asteroid.closeApproachData', 'closeApproachData')
//             .where('closeApproachData.epochDate < :endDate', { endDate })
//             .andWhere('closeApproachData.epochDate >= :startDate', { startDate })
//             .andWhere('asteroid.isPotentiallyHazardous = :isPotentiallyHazardous', {
//                 isPotentiallyHazardous: true
//             })
//             .orderBy('closeApproachData.epochDate', 'ASC')
//             .take(1)
//             .getMany()
//
//         when(asteroidQuery).thenResolve(asteroids)
//
//         const result = await asteroidService.getAsteroids(
//             {
//                 startDate: format(startDate, 'yyyy-MM-dd'),
//                 endDate: format(endDate, 'yyyy-MM-dd'),
//                 isPotentiallyHazardous: true
//             },
//             SortBy.date,
//             SortDirection.asc,
//             1
//         )
//
//         verify(asteroidQuery).called()
//
//         expect(result).toEqual(asteroids)
//     })
// })
